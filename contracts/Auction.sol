//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";


import "hardhat/console.sol";
import "./ResToken.sol";

contract Auction is IERC1155Receiver {
	IERC1155 public token;
    mapping(uint256 => address) public tokenOwner;
    mapping(uint256 => uint256) public auctionPrice;

    event auctionStarted(uint256 id);
    event auctionCompleted(uint256 id);

    constructor(address _tokenAddress) {
        token = IERC1155(_tokenAddress);
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

        // Update token owner and aution price
        tokenOwner[_tokenId] = msg.sender;
		auctionPrice[_tokenId] = _auctionPrice;

		// Transfer the token to the contract as escrow
        token.safeTransferFrom(msg.sender, address(this), _tokenId, 1, "");

        emit auctionStarted(_tokenId);
    }

    // Allows users to purchase auctioned tokens
    function buyRes(uint256 _tokenId) external payable {
    	require(token.balanceOf(address(this), _tokenId) > 0, "Token is not available for purchase");
    	require(msg.value >= auctionPrice[_tokenId], "Insufficient Funds");

	    // Transfer the token to the buyer
	    token.safeTransferFrom(address(this), msg.sender, _tokenId, 1, "");

		// Send the Ether to the original owner
	    (bool sent, ) = tokenOwner[_tokenId].call{value: msg.value}("");
	    require(sent, "Failed to send Ether");

        emit auctionCompleted(_tokenId);
    }

}
