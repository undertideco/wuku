
// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "./Story.sol";

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