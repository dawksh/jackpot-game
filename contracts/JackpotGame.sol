// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract JackpotGame is Ownable, ReentrancyGuard {
    IERC20 public immutable jackpotToken;
    address public immutable prizeWallet;

    event PrizeClaimed(address indexed winner, uint256 amount);

    constructor(address _jackpotToken, address _prizeWallet) {
        jackpotToken = IERC20(_jackpotToken);
        prizeWallet = _prizeWallet;
    }

    function claimPrize(uint256 amount) external nonReentrant {
        require(amount > 0, "Prize amount must be greater than zero");
        require(jackpotToken.balanceOf(prizeWallet) >= amount, "Insufficient funds in prize wallet");

        require(jackpotToken.transferFrom(prizeWallet, msg.sender, amount), "Prize transfer failed");

        emit PrizeClaimed(msg.sender, amount);
    }

    function getPrizePoolBalance() external view returns (uint256) {
        return jackpotToken.balanceOf(prizeWallet);
    }

    function recoverERC20(address tokenAddress, uint256 amount) external onlyOwner {
        IERC20(tokenAddress).transfer(owner(), amount);
    }
}

