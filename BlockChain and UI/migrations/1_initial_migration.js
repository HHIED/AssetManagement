var Migrations = artifacts.require("./Migrations.sol");
var CarRegistrationContract = artifacts.require("./CarRegistrationContract");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};

module.exports = function(deployer) {
  deployer.deploy(CarRegistrationContract);
}


