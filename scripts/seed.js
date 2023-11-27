// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat")
const config = require('../src/config.json')

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

async function main() {
  let transaction, result
  const accounts = await ethers.getSigners()
  const deployer = accounts[0]
  const guest = accounts[1]

  // Fetch network
  const { chainId } = await ethers.provider.getNetwork()
  console.log("Using chainId:", chainId)

  // Fetch Token & Auction
  const token = await hre.ethers.getContractAt('ResToken', config[chainId].token.address)
  console.log(`ResToken fetched: ${token.address}\n`)

  const auction = await hre.ethers.getContractAt('Auction', config[chainId].auction.address)
  console.log(`Auction fetched: ${auction.address}\n`)
  
  // Create listings
  transaction = await token.connect(deployer).createListing("Luxury Villa", 3)
  result = await transaction.wait()

  transaction = await token.connect(deployer).createListing("Downtown Highrise", 2)
  result = await transaction.wait()

  // Create reservations
  transaction = await token.connect(guest).reserve(1, 1, 4, { value: ether(9) })
  result = await transaction.wait()
  console.log("After reserving")

  // Create auctions
  transaction = await token.connect(guest).setApprovalForAll(auction.address, true)
  result = await transaction.wait()
  
  transaction = await auction.connect(guest).auctionRes(1, ether(9))
  result = await transaction.wait()

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
})
