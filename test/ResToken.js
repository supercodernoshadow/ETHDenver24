const { expect } = require('chai')
const { ethers } = require('hardhat')

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('ResToken', () => {
  let token, accounts, deployer, transaction, result

  beforeEach(async () => {
    accounts = await ethers.getSigners()
    deployer = accounts[0]
    guest = accounts[1]
    receiver = accounts[2]

    const Token = await ethers.getContractFactory('ResToken')

    token = await Token.deploy()

  })

  describe('Success', () => {

    beforeEach(async () => {
      transaction = await token.connect(deployer).createListing("Luxury Villa", 1)
      result = await transaction.wait()

    })
    describe('Listings', () => {
      it("creates a listing", async () => {

        const listing = await token.getListing(1)
        expect(listing).to.equal("Luxury Villa")

      })
      it("emits a create listing event", async () => {
         expect(transaction).to.emit(token, 'newListing')
            .withArgs(1)  

      })
    })

    describe('Reservations', () => {
      beforeEach(async () => {
      transaction = await token.connect(guest).reserve(1, 3,7, { value: ether(4)})
      result = await transaction.wait()

      })

      it("creates a reservation", async () => {
        const guestBalance = await token.balanceOf(guest.address, 1)
        expect(guestBalance).to.equal(1)
      })
      it("transfers a reservation", async () => {
        transaction = await token.connect(guest).transferRes(receiver.address, 1)
        result = await transaction.wait()

        const receiverBalance = await token.balanceOf(receiver.address, 1)
        guestBalance = await token.balanceOf(guest.address, 1)
        expect(receiverBalance).to.equal(1)
        expect(guestBalance).to.equal(0)
      })
      it("enforces calendar", async () => {
        expect(token.connect(guest).reserve(1, 3,7, { value: ether(5)})).to.be.reverted
     
      })

    })

  })

})
