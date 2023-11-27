//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

import "hardhat/console.sol";
import "./ResToken.sol";

contract Auction is IERC1155Receiver {
	ResToken public token;

	struct AuctionRes {
    	uint256 id;
    	uint256 price;
        uint256 startDate;
        uint256 endDate;
    }

    mapping(uint256 => address) public tokenOwner;
    mapping(uint256 => AuctionRes) public auctions;

    event auctionStarted(uint256 id);
    event auctionCompleted(uint256 id);


    constructor(address _tokenAddress) {
        token = ResToken(_tokenAddress);
    }

    // Allow contract to receive ether
    receive() external payable {
    }

    // Allow contract to receive tokens
 function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external override returns (bytes4) {
        // Handle the receipt of a single ERC1155 token type
        // Implement your logic here

        return this.onERC1155Received.selector;
    }

    /**
     * Always returns `IERC1155Receiver.onERC1155BatchReceived.selector`.
     */
    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external override returns (bytes4) {
        // Handle the receipt of multiple ERC1155 token types
        // Implement your logic here

        return this.onERC1155BatchReceived.selector;
    }

    // Supports Interface function
	function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165) returns (bool) {
	    return interfaceId == type(IERC1155Receiver).interfaceId || interfaceId == type(IERC165).interfaceId;
	}



	// Allows reservation owner to list token for auction
	function auctionRes(uint256 _tokenId, uint256 _auctionPrice) external {
        require(token.balanceOf(msg.sender, _tokenId) > 0, "You do not own the token");
        require(token.isApprovedForAll(msg.sender, address(this)), "Contract must be approved");

        // Update token owner and aution mapping
        tokenOwner[_tokenId] = msg.sender;
        auctions[_tokenId].id = _tokenId;
		auctions[_tokenId].price = _auctionPrice;

		// Update start and end dates of the auctioned reservation
		(uint256 _startDate,uint256 _endDate) = token.getRes(_tokenId);

		auctions[_tokenId].startDate = _startDate;
		auctions[_tokenId].endDate = _endDate;

		// Transfer the token to the contract as escrow
        token.safeTransferFrom(msg.sender, address(this), _tokenId, 1, "");

        emit auctionStarted(_tokenId);
    }

    // Allows users to purchase auctioned tokens
    function buyRes(uint256 _tokenId) external payable {
    	require(token.balanceOf(address(this), _tokenId) > 0, "Token is not available for purchase");
    	require(msg.value >= auctions[_tokenId].price, "Insufficient Funds");

	    // Transfer the token to the buyer
	    token.safeTransferFrom(address(this), msg.sender, _tokenId, 1, "");

		// Send the Ether to the original owner
	    (bool sent, ) = tokenOwner[_tokenId].call{value: msg.value}("");
	    require(sent, "Failed to send Ether");

	    // Update token owner
	    tokenOwner[_tokenId] = msg.sender;

        emit auctionCompleted(_tokenId);
    }

    // Get the owner of an auction
    function getAuctionOwner(uint256 _tokenId) external view returns (address) {
        return (tokenOwner[_tokenId]);
    }

    // Get price of an auction 
	function getAuctionPrice(uint256 _tokenId) external view returns (uint256) {
        return (auctions[_tokenId].price);
    }

    // Get start date of an auction 
	function getAuctionStart(uint256 _tokenId) external view returns (uint256) {
        return (auctions[_tokenId].startDate);
    }

    // Get start date of an auction 
	function getAuctionEnd(uint256 _tokenId) external view returns (uint256) {
        return (auctions[_tokenId].endDate);
    }
}
