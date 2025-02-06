// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract JackpotGameStore is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable jackpotToken;
    address public prizeWallet;
    address public signer;
    mapping(address => uint) internal playsCounter;
    uint public PRICE = 100000 ether;

    bytes32 private constant EIP712_DOMAIN_TYPEHASH =
        keccak256(
            "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
        );
    bytes32 private constant CLAIM_TYPEHASH =
        keccak256("claim(address winner,uint256 amount)");
    bytes32 private immutable DOMAIN_SEPARATOR;

    event PrizeClaimed(address indexed winner, uint256 amount);
    error InvalidAllowance();
    error WithdrawAmountExceeded();
    error TransferFailed();
    error InvalidSignature();

    constructor(
        address _jackpotToken,
        address _prizeWallet,
        address _signer
    ) Ownable(msg.sender) {
        jackpotToken = IERC20(_jackpotToken);
        prizeWallet = _prizeWallet;
        signer = _signer;

        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                EIP712_DOMAIN_TYPEHASH,
                keccak256("JackpotGameStore"),
                keccak256("1"),
                block.chainid,
                address(this)
            )
        );
    }

    function deposit(uint plays) external {
        uint allowance = jackpotToken.allowance(msg.sender, address(this));
        uint total = plays * PRICE;
        if (allowance < total) revert InvalidAllowance();
        jackpotToken.safeTransferFrom(msg.sender, address(this), total);
        playsCounter[msg.sender] += plays;
    }

    function withdrawToken(uint balance) external onlyOwner {
        jackpotToken.safeTransfer(owner(), balance);
    }

    function play(address player) public {
        if (msg.sender != signer) revert InvalidSignature();
        require(playsCounter[player] > 0, "No plays left");
        playsCounter[player] -= 1;
    }

    function claim(bytes calldata data, uint256 amount) external nonReentrant {
        uint contractBalance = jackpotToken.balanceOf(address(this));
        uint walletBalance = jackpotToken.balanceOf(prizeWallet);

        if ((contractBalance + walletBalance) < amount)
            revert WithdrawAmountExceeded();

        if (contractBalance < amount) {
            jackpotToken.safeTransferFrom(
                prizeWallet,
                address(this),
                amount - contractBalance
            );
        }

        if (verifySignature(data, amount) == signer) {
            jackpotToken.safeTransfer(msg.sender, amount);
            emit PrizeClaimed(msg.sender, amount);
        } else {
            revert InvalidSignature();
        }
    }

    function verifySignature(
        bytes calldata data,
        uint256 amount
    ) public view returns (address) {
        (uint8 v, bytes32 r, bytes32 s) = splitSignature(data);

        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                DOMAIN_SEPARATOR,
                keccak256(abi.encode(CLAIM_TYPEHASH, msg.sender, amount))
            )
        );

        return ecrecover(digest, v, r, s);
    }

    function splitSignature(
        bytes memory sig
    ) internal pure returns (uint8 v, bytes32 r, bytes32 s) {
        require(sig.length == 65, "Invalid signature length");
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }

    function playsLeft(address player) external view returns (uint256) {
        return playsCounter[player];
    }

    function getPrizePoolBalance() external view returns (uint256) {
        return
            jackpotToken.balanceOf(address(this)) +
            jackpotToken.balanceOf(prizeWallet);
    }

    function updatePrice(uint newPrice) external onlyOwner {
        PRICE = newPrice;
    }
}
