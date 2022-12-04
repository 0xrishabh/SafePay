// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

const path = require("path");
const fs = require("fs");
const { ethers, upgrades } = require('hardhat');

async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());
  
  const Gnosis_safe = "0x5992d889d8955B18fb71D0fE2C4A1f9C4BeE4a2a"
  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy(Gnosis_safe);
  await token.deployed();

  console.log("Token address:", token.address);
  /*
  const SafePay = await ethers.getContractFactory("SafePay");
  const safePay = await SafePay.deploy();
  await safePay.deployed();

  console.log("SafePay address:", safePay.address);


  // We also save the contract's artifacts and address in the frontend directory
  
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  let data = {
    "Token": token.address,
    "SafePay": safePay.address
  }
  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify(data, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("Token");
  fs.writeFileSync(
    path.join(contractsDir, `Token.json`),
    JSON.stringify(TokenArtifact, null, 2)
  );

  const SafePayArtifact = artifacts.readArtifactSync("SafePay");
  fs.writeFileSync(
    path.join(contractsDir, `SafePay.json`),
    JSON.stringify(SafePayArtifact, null, 2)
  );

}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  let data = {}
  data[name] = contract.address
  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
   
    JSON.stringify(data, undefined, 2)
  );

  */
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
