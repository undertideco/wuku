// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

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
        mapping(address => bool) votes;
    }
    
    uint minimumContribution = 250000000000000;
    address public host;
    uint numContributions;
    mapping (uint => Contribution) public contributions;
    
    constructor (string memory startText, address storyCreator, uint startingAmount) payable {
        host = storyCreator;
        
        Contribution storage c = contributions[0];
        c.description = startText;
        c.contributor = storyCreator;
        c.amount = startingAmount;
    }
    
    function createContribution(string memory description) public payable {
        require(msg.sender != host);
        require(msg.value == minimumContribution);

        uint contributionID = numContributions++;
        
        Contribution storage c = contributions[contributionID];
        c.description = description;
        c.contributor = msg.sender;
        c.amount = minimumContribution;

        minimumContribution = minimumContribution * 2;
    }
    
    function getMinimumContribution() public view returns(uint) {
        return minimumContribution;
    }
}