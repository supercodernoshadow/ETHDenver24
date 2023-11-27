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
        uint256 id;
        uint256 nightlyRate;
        mapping(uint256 => bool) calendar;
    }

    struct Reservstion {
        uint256 id;
        uint256 startDate;
        uint256 endDate;
    }

    // Mappings to link token id to a listing and reservation struct
    mapping(uint256 => Listing) public listings;
    mapping(uint256 => Reservstion) public reservations;

    // Events
    event Mint(uint256 id, address minter);
    event newListing(uint256 id);

    constructor() ERC1155("https://ipfs.io/ipfs/bafybeihjjkwdrxxjnuwevlqtqmh3iegcadc32sio4wmo7bv2gbf34qs34a/{id}.json") Ownable(){
        _mint(address(this), tokenId.current(), 1e18, "");
    }
    
    // Create a new listing with a specified name 
    function createListing(string memory name, uint256 rate) external {
        listingCount.increment();
        uint256 currentId = listingCount.current();

        listings[currentId].name = name;
        listings[currentId].id = currentId;
        listings[currentId].nightlyRate = rate;
        //listings[listingCount.current()] = Listing(name, listingCount.current(), rate);
        emit newListing(listingCount.current());
    }

    // Check if nights are open
    function checkCalendar(uint256 listingId, uint256 startDate, uint256 endDate) internal view returns (bool){
        bool available = true;
        for(uint256 i = startDate; i < endDate; i++){
            if(listings[listingId].calendar[i] == true){
                available = false;
            }
        }
        return available;
    }
    // Reserve a listing and create a new reservation token
    function reserve(uint256 listingId, uint256 _startDate, uint256 _endDate) external payable{
        require(msg.value >= (_endDate - _startDate) * listings[listingId].nightlyRate, "Broke boi");
        require(_startDate < _endDate, "Invalid date range");
        require(checkCalendar(listingId, _startDate, _endDate) == true);
        tokenId.increment();
        uint256 newTokenId = tokenId.current();

        // Update calendar
        for(uint256 i = _startDate; i < _endDate; i++){
            listings[listingId].calendar[i] = true;
        }

        // Store dates
        reservations[tokenId.current()].id = tokenId.current();
        reservations[tokenId.current()].startDate = _startDate;
        reservations[tokenId.current()].endDate = _endDate;

        _mint(msg.sender, newTokenId, 1, "");
        emit Mint(listingId, msg.sender);


    }

    // Transfer a reservation token to another address
    function transferRes(address to, uint256 _tokenId) external {
        require(_tokenId > 0, "Invalid token ID");
        require(balanceOf(msg.sender, _tokenId) > 0, "Not the token owner");

        safeTransferFrom(msg.sender, to, _tokenId, 1, "");
    }

    // Get the details of a listing
    function getListing(uint256 listingId) external view returns (string memory) {
        require(listingId <= listingCount.current(), "Invalid listing ID");
        return (listings[listingId]).name;
    }

    // Get nightly rate for a listing
    function getCost(uint256 listingId) external view returns (uint256) {
        return(listings[listingId].nightlyRate);
    }

    // Return booking status for a listing
    function getBookedDates(uint256 listingId, uint256 start, uint256 end) public view returns (bool[] memory) {
        bool[] memory booked = new bool[](end - start + 1);
        for (uint256 i = start; i <= end; i++) {
            booked[i - start] = listings[listingId].calendar[i];
        }
        return booked;
    }

    // Get the details of a reservation
    function getRes(uint256 _tokenId) external view returns (uint256, uint256) {
        require(_tokenId <= tokenId.current(), "Invalid res ID");
        return (reservations[_tokenId].startDate, reservations[_tokenId].endDate);
    }

}
