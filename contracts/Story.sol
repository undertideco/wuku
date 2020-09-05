// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

contract Story {
    struct Contribution {
        string description;
        uint amount;
        address contributor;
        address[] votes;
    }

    uint public createdTime;
    address public host;
    Contribution[] public contributions;
    mapping(address => bool) public voters;
    // FIXME: Since first contribution will always be haiku opener, it will remain the "winner" until another contribution has a vote
    uint highestVotedContributionIndex = 0;
    uint minimumContribution = 250000000000000; 
    
    constructor (string memory startText, address storyCreator, uint startingAmount) payable {        
        Contribution memory newContribution = Contribution({
           description: startText,
           contributor: storyCreator,
           amount: startingAmount,
           votes: new address[](0)
        });

        createdTime = block.timestamp;
        contributions.push(newContribution);
        voters[storyCreator] = true;

        host = storyCreator;
    }
    
    function createContribution(string memory description) public payable {
        require(!hasClosedForContributions(), 'Contribution window has closed!');
        require(msg.sender != host);
        require(msg.value == minimumContribution);

        Contribution memory newContribution = Contribution({
           description: description,
           contributor: msg.sender,
           amount: minimumContribution,
            votes: new address[](0)
        });
        
        contributions.push(newContribution);
        voters[msg.sender] = true;

        minimumContribution = minimumContribution * 2;
    }

    function voteContribution(uint index) public {
        require(!hasClosedForVoting(), "Voting window has closed!");
        require(voters[msg.sender]);

        Contribution storage contribution = contributions[index];
        require(msg.sender != contribution.contributor, "User not allowed to vote for their own contribution");
        contribution.votes.push(msg.sender);

        if (highestVotedContributionIndex == 0) {
            highestVotedContributionIndex = index;          
        } else {
            Contribution memory highestVotedContribution = contributions[highestVotedContributionIndex];
            if (highestVotedContribution.votes.length < contribution.votes.length) {
                highestVotedContributionIndex = index;
            }
        }
    }

    function finalize() public hostOnly {
        require(hasClosedForVoting());
        require(hasClosedForContributions());

        Contribution memory winningContribution = contributions[highestVotedContributionIndex];
        address payable winningWallet = address(uint160(winningContribution.contributor));

        uint winningShare = address(this).balance * 70 / 100;
        winningWallet.transfer(winningShare);
        
        msg.sender.transfer(address(this).balance);
    }

    modifier hostOnly() {
        require(msg.sender == host, 'Only story host can make this operation');
        _;
    }

    function getHighestVotedContribution() public view returns(Contribution memory) {
        return contributions[highestVotedContributionIndex];
    }

    function getContributionVoteCount(uint index) public view returns(uint) {
      Contribution storage contribution = contributions[index];

      return contribution.votes.length;
    }

    function getMinimumContribution() public view returns(uint) {
        return minimumContribution;
    }

    function getContributionsCount() public view returns(uint) {
      return contributions.length;
    }

    function getSummary() public view returns(Contribution[] memory, uint, address, uint, uint) {
      uint contributionTimeLeft = (block.timestamp + 3 days) - createdTime;
      uint votingTimeLeft = contributionTimeLeft + 1 days;

      return (
        contributions,
        minimumContribution,
        host,
        contributionTimeLeft,
        votingTimeLeft
      );
    }

    function hasClosedForContributions() public view returns (bool) {
      return (block.timestamp - createdTime) >= 3 days;
    }

    function hasClosedForVoting() public view returns (bool) {
        return (block.timestamp - createdTime) >= 4 days;
    }

    function isContributor(address addr) public view returns (bool) {
      return voters[addr];
    }
}