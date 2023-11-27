const { expect } = require('chai')
const { ethers } = require('hardhat')

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('Auction', () => {

  let token, accounts, deployer, transaction, result

  beforeEach(async () => {
    accounts = await ethers.getSigners()
    deployer = accounts[0]
    guest = accounts[1]
    receiver = accounts[2]

    const Token = await ethers.getContractFactory('ResToken')

    token = await Token.deploy()

    const Auction = await ethers.getContractFactory('Auction')

    auction = await Auction.deploy(token.address)

    transaction = await token.connect(deployer).createListing("Luxury Villa", 1)
    result = await transaction.wait()
      
    transaction = await token.connect(guest).reserve(1, 3,7, { value: ether(4) })
    result = await transaction.wait()

    transaction = await token.connect(guest).setApprovalForAll(auction.address, true)
    result = await transaction.wait()

  })
  describe('Success', () => {

    beforeEach(async () => {

      transaction = await auction.connect(guest).auctionRes(1, ether(4))
      result = await transaction.wait()
    })

    it("creates an auction", async () => {
      expect(await token.balanceOf(auction.address, 1)).to.equal(1)

    })
    it("completes an auction", async () => {
      transaction = await auction.connect(deployer).buyRes(1, { value: ether(4) })
      result = await transaction.wait()

      expect(await token.balanceOf(deployer.address, 1)).to.equal(1)

    })
  })

  describe('Failure', () => {

    beforeEach(async () => {

      transaction = await auction.connect(guest).auctionRes(1, ether(4))
      result = await transaction.wait()
    })

    it("rejects insufficient payment", async () => {
      await expect(auction.connect(deployer).buyRes(1, { value: ether(2) })).to.be.reverted

    })
  })

})