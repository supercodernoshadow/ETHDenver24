// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  // Deploy Token
  const Token = await hre.ethers.getContractFactory('ResToken')
  let token = await Token.deploy()

  await token.deployed()
  console.log(`Res Token deployed to: ${token.address}\n`)

  // Deploy Auction
  const Auction = await hre.ethers.getContractFactory('Auction')
  let auction = await Auction.deploy(token.address)

  await auction.deployed()
  console.log(`Auction deployed to: ${auction.address}\n`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
