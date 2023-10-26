//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ResToken is ERC1155, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter public tokenId;
    Counters.Counter public listingCount;

    struct Listing {
        string name;
    }

    // Mapping from token ID to the listing it belongs to
    //mapping(uint256 => uint256) public tokenIdToListingId;

    mapping(uint256 => Listing) public listings;

    constructor() ERC1155("https://ipfs.io/ipfs/bafybeihjjkwdrxxjnuwevlqtqmh3iegcadc32sio4wmo7bv2gbf34qs34a/{id}.json") Ownable(){}
    
    // Create a new listing with a specified name 
    function createListing(string memory name) external {
        listingCount.increment();
        listings[listingCount.current()] = Listing(name);
    }

    // Reserve a listing and create a new reservation token
    function reserve(uint256 listingId, uint256 startDate, uint256 endDate) external {
        require(startDate < endDate, "Invalid date range");
        
        tokenId.increment();
        uint256 newTokenId = tokenId.current();

        _mint(msg.sender, newTokenId, 1, "");
        //listings[newTokenId] = _listing;
    }

    // Transfer a reservation token to another address
    function transferRes(address to, uint256 _tokenId) external {
        require(_tokenId > 0, "Invalid token ID");
        require(balanceOf(msg.sender, _tokenId) > 0, "Not the token owner");

        safeTransferFrom(msg.sender, to, _tokenId, 1, "");
    }

    // Get the details of a listing
    function getListing(uint256 listingId) external view returns (string memory) {
        //require(listingId < listings.length, "Invalid listing ID");
        return (listings[listingId].name);
    }
}
