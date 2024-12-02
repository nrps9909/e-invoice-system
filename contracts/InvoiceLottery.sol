// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InvoiceLottery {
    address public owner;
    address[] public participants;
    uint public lotteryEndTime;
    bool public winnerDrawn;
    address public winner;

    event InvoiceUploaded(address participant);
    event WinnerSelected(address winner);

    constructor(uint _durationMinutes) {
        owner = msg.sender;
        lotteryEndTime = block.timestamp + (_durationMinutes * 1 minutes);
        winnerDrawn = false;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    modifier beforeEnd() {
        require(block.timestamp <= lotteryEndTime, "Lottery has ended.");
        _;
    }

    modifier afterEnd() {
        require(block.timestamp > lotteryEndTime, "Lottery is still ongoing.");
        _;
    }

    function uploadInvoice() public beforeEnd {
        participants.push(msg.sender);
        emit InvoiceUploaded(msg.sender);
    }

    function getParticipants() public view returns (address[] memory) {
        return participants;
    }

    function drawWinner() public onlyOwner afterEnd {
        require(!winnerDrawn, "Winner has already been drawn.");
        require(participants.length > 0, "No participants in the lottery.");
        uint randomIndex = uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty, participants.length))) % participants.length;
        winner = participants[randomIndex];
        winnerDrawn = true;
        emit WinnerSelected(winner);
    }
}
