// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Strings.sol";

contract InvoiceLottery {
    address public owner;
    uint public lotteryEndTime;
    bool public winnerDrawn;
    address public winner;
    using Strings for uint256;

    // 定義參與者列表
    address[] public participants;

    struct Invoice {
        address participant;
        string invoiceNumber;
    }

    Invoice[] public invoices;
    mapping(address => string[]) public userInvoices; // 用於儲存每個用戶的發票

    // 中獎號碼
    string public specialPrize; // 特別獎
    string public grandPrize;   // 特獎
    string[] public firstPrizes; // 頭獎

    bool public drawn;

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

    function uploadAllInvoices(address[] memory _participants, string[] memory _invoiceNumbers) public onlyOwner {
        require(_participants.length == _invoiceNumbers.length, "Participants and invoice numbers length mismatch");
        for (uint i = 0; i < _participants.length; i++) {
            require(bytes(_invoiceNumbers[i]).length == 8, "Invoice number must be 8 digits");
            require(_isNumeric(_invoiceNumbers[i]), "Invoice number must contain only digits");
            invoices.push(Invoice(_participants[i], _invoiceNumbers[i]));
            userInvoices[_participants[i]].push(_invoiceNumbers[i]);
            // 確保參與者列表中不重複
            if (!_isExistingParticipant(_participants[i])) {
                participants.push(_participants[i]);
            }
            emit InvoiceUploaded(_participants[i]);
        }
    }

    function _isExistingParticipant(address _participant) internal view returns (bool) {
        for (uint i = 0; i < participants.length; i++) {
            if (participants[i] == _participant) {
                return true;
            }
        }
        return false;
    }

    function uploadInvoice(string memory _invoiceNumber) public beforeEnd {
        require(bytes(_invoiceNumber).length == 8, "Invoice number must be 8 digits");
        require(_isNumeric(_invoiceNumber), "Invoice number must contain only digits");

        // 確保同一用戶只加入一次到 participants 中
        bool isExistingParticipant = false;
        for (uint i = 0; i < participants.length; i++) {
            if (participants[i] == msg.sender) {
                isExistingParticipant = true;
                break;
            }
        }
        if (!isExistingParticipant) {
            participants.push(msg.sender);
        }

        invoices.push(Invoice(msg.sender, _invoiceNumber));
        userInvoices[msg.sender].push(_invoiceNumber); // 儲存到用戶發票列表
        emit InvoiceUploaded(msg.sender);
    }

    function getAllInvoices() public view returns (Invoice[] memory) {
        return invoices;
    }

    function checkIfWinner(address _user) public view returns (bool) {
        require(drawn, "Winning numbers have not been drawn yet");
        string[] memory invoicesOfUser = userInvoices[_user];
        for (uint i = 0; i < invoicesOfUser.length; i++) {
            string memory invoiceNumber = invoicesOfUser[i];
            if (_isWinningInvoice(invoiceNumber)) {
                return true;
            }
        }
        return false;
    }

    function _isWinningInvoice(string memory invoiceNumber) internal view returns (bool) {
        // 檢查是否中獎
        if (keccak256(abi.encodePacked(invoiceNumber)) == keccak256(abi.encodePacked(specialPrize)) ||
            keccak256(abi.encodePacked(invoiceNumber)) == keccak256(abi.encodePacked(grandPrize))) {
            return true;
        }
        for (uint i = 0; i < firstPrizes.length; i++) {
            if (keccak256(abi.encodePacked(invoiceNumber)) == keccak256(abi.encodePacked(firstPrizes[i]))) {
                return true;
            }
        }
        return false;
    }

    function getParticipants() public view returns (address[] memory) {
        return participants;
    }

    function drawWinner() public onlyOwner afterEnd {
        require(!winnerDrawn, "Winner has already been drawn.");
        require(participants.length > 0, "No participants in the lottery.");
        uint randomIndex = uint(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, participants.length))) % participants.length;
        winner = participants[randomIndex];
        winnerDrawn = true;
        emit WinnerSelected(winner);
    }

    function drawWinningNumbers() public onlyOwner {
        require(!drawn, "Winning numbers have already been drawn");
        // 生成中獎號碼
        specialPrize = _generateRandomNumber();
        grandPrize = _generateRandomNumber();
        firstPrizes.push(_generateRandomNumber());
        firstPrizes.push(_generateRandomNumber());
        firstPrizes.push(_generateRandomNumber());
        drawn = true;
    }

    function _generateRandomNumber() private view returns (string memory) {
        uint256 random = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao, // 將 block.difficulty 改回 block.prevrandao
            invoices.length,
            msg.sender,
            gasleft()
        ))) % 100000000;
        string memory randomStr = random.toString();
        while (bytes(randomStr).length < 8) {
            randomStr = string(abi.encodePacked("0", randomStr));
        }
        return randomStr;
    }

    function getWinningNumbers() public view returns (string memory, string memory, string[] memory) {
        require(drawn, "Winning numbers have not been drawn yet");
        return (specialPrize, grandPrize, firstPrizes);
    }

    function _isNumeric(string memory str) internal pure returns (bool) {
        bytes memory b = bytes(str);
        for(uint i; i < b.length; i++){
            if(b[i] < 0x30 || b[i] > 0x39){
                return false;
            }
        }
        return true;
    }
}
