const StoryFactory = artifacts.require('StoryFactory');

module.exports = function (deployer) {
  deployer.deploy(StoryFactory);
};
