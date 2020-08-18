// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

contract StoryFactory {
    uint constant minimumStartingContribution = 13000000000000000;
    Story[] public deployedStories;

  function createStory(string memory startText) public payable {
    require(msg.value >= minimumStartingContribution);
    
    Story newStory = new Story(startText, msg.sender, msg.value);
    deployedStories.push(newStory);
  }
  
  function getDeployedStories() public view returns(Story[] memory) {
    return deployedStories;
  }
}

contract Story {
    struct Contribution {
        string description;
        uint amount;
        address contributor;
        address[] votes;
    }

    uint public createdTime;
    uint minimumContribution = 250000000000000;
    address public host;
    Contribution[] public contributions;
    mapping(address => bool) public voters;
    
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
      Contribution storage contribution = contributions[index];

      require(voters[msg.sender]);

      contribution.votes.push(msg.sender);
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

    function getSummary() public view returns(Contribution[] memory, uint, address) {
      return (
        contributions,
        minimumContribution,
        host
      );
    }

    function hasClosedForContributions() public view returns (bool) {
      return (block.timestamp - createdTime) >= 3 days;
    }
}