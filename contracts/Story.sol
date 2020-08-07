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
        address[] votes;
    }
    
    uint minimumContribution = 250000000000000;
    address public host;
    Contribution[] public contributions;
    
    constructor (string memory startText, address storyCreator, uint startingAmount) payable {        
        Contribution memory newContribution = Contribution({
           description: startText,
           contributor: storyCreator,
           amount: startingAmount,
           votes: new address[](0)
        });
        
        contributions.push(newContribution);

        host = storyCreator;
    }
    
    function createContribution(string memory description) public payable {
        require(msg.sender != host);
        require(msg.value == minimumContribution);

        Contribution memory newContribution = Contribution({
           description: description,
           contributor: msg.sender,
           amount: minimumContribution,
            votes: new address[](0)
        });
        
        contributions.push(newContribution);

        minimumContribution = minimumContribution * 2;
    }

    function getMinimumContribution() public view returns(uint) {
        return minimumContribution;
    }

    function getContributionsCount() public view returns(uint) {
      return contributions.length;
    }
}