pragma solidity ^ 0.4 .17;

contract StoryFactory {
    uint constant minimumStartingContribution = 13000000000000000;
    address[] public deployedStories;

  function createStory(string startText) public payable {
    require(msg.value >= minimumStartingContribution);
    
    address newStory = new Story(startText, msg.sender, msg.value);
    deployedStories.push(newStory);
  }
  
  function getDeployedStories() public view returns(address[]) {
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
    Contribution[] public contributions;
    address public host;
    
    function Story(string startText, address storyCreator, uint startingAmount) public payable {
        Contribution memory newContribution = Contribution({
            description: startText,
            contributor: storyCreator,
            amount: startingAmount
        });
        
        host = storyCreator;
        contributions.push(newContribution);
    }
    
    function createContribution(string description) public payable {
        require(msg.sender != host);
        require(msg.value == minimumContribution);
        
        Contribution memory newContribution = Contribution({
          description: description,
          contributor: msg.sender,
          amount: minimumContribution
        });
        
        minimumContribution = minimumContribution * 2;
        
        contributions.push(newContribution);
    }
    
    function getMinimumContribution() public view returns(uint) {
        return minimumContribution;
    }
}