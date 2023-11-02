// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat")
const config = require('../src/config.json')


async function main() {
  let transaction, result
  const accounts = await ethers.getSigners()

  // Fetch network
  const { chainId } = await ethers.provider.getNetwork()
  console.log("Using chainId:", chainId)

  // Fetch Token
  const token = await hre.ethers.getContractAt('ResToken', config[chainId].token.address)
  console.log(`ResToken fetched: ${token.address}\n`)

  // Set up exchange users
  const deployer = accounts[0]

  // Create listing
  transaction = await token.connect(deployer).createListing("Luxury Villa", 1)
  result = await transaction.wait()
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
})
