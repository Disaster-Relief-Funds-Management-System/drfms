// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DRFMS {
    address payable developer;
    
    constructor() {
        developer = payable (msg.sender);
    }

    struct ReliefFundsDetails {
        string description;
        address manager; // creator and owner who is incharge of the relief efforts
        uint256 createdOn;
        uint256 totalAmount;
        bool fundsNeeded;
        uint256 remainingUsage; // remaining amount whose usage hasn't been displayed yet
    }

    struct UsageInfo {
        string reason;
        uint256 val;
        uint256 usedOn; // epochs in frontend
    }

    struct DonationInfo {
        address donor;
        uint256 val;
        uint256 donatedOn; // in seconds
    }
    
    mapping(address => ReliefFundsDetails) public reliefFundsManagers;
    mapping(address => UsageInfo[]) internal usageMapping;
    mapping(address => DonationInfo[]) internal donationHistoryMapping;

    modifier onlyDeveloper() {
        require(msg.sender == developer);
        _;
    }

    modifier authorizedManager(address addr) {
        require(msg.sender == reliefFundsManagers[addr].manager, "You don't have the permission to modify this relief funds' informaation.");
        _;
    }

    modifier registeredReliefFunds(address addr) {
        require(reliefFundsManagers[addr].fundsNeeded == true, "No more funds needed / address not registered / address not valid. Thus, we can't transfer funds.");
        _;
    }

    modifier newReliefFunds(address addr) {
        require(reliefFundsManagers[addr].createdOn == 0, "Relief funds already exists.");
        _;
    }

    modifier reliefFundsExists(address addr) {
        require(reliefFundsManagers[addr].createdOn != 0, "Relief funds does not exist.");
        _;
    }

    modifier shouldHaveRemainingAmount(address addr, uint256 val) {
        require(reliefFundsManagers[addr].remainingUsage >= val, "Invalid request. You are trying to add usage info.for the amount which is greater than what's remaining.");
        _;
    }

    function addUsage(address fundsAddress, string memory reason, uint256 val, uint256 usedOn) authorizedManager(fundsAddress) shouldHaveRemainingAmount(fundsAddress, val) public {
        UsageInfo memory info = UsageInfo({
            reason: reason,
            val: val,
            usedOn: usedOn
        });

        usageMapping[fundsAddress].push(info);
        reliefFundsManagers[fundsAddress].remainingUsage -= val;
    }

    function getUsage(address fundsAddress) public view returns (UsageInfo[] memory) {
        return usageMapping[fundsAddress];
    }

    function addReliefFundsManager(address fundsAddress, string memory description) newReliefFunds(fundsAddress) public {
        ReliefFundsDetails memory details = ReliefFundsDetails({
            description: description,
            manager: msg.sender,
            createdOn: block.timestamp,
            totalAmount: 0,
            fundsNeeded: true,
            remainingUsage: 0
        });

        reliefFundsManagers[fundsAddress] = details;
    }

    function viewReliefFundsDetails(address fundsAddress) public view returns(string memory, bool) {
        return (reliefFundsManagers[fundsAddress].description, reliefFundsManagers[fundsAddress].fundsNeeded);
    }
    
    // TODO: Remove ReliefFundsDetails from reliefFundsManager after efforts are done.
    // Question: What to do with the rest of the donations?

    /**
    * Following section is for transfering donations.
    *
    * 1. Check if the address is a registered funds' address.
    * 2. Transfer the funds.
    * 3. Increase the totalAmount variable for said address mapping.
    */
    function donate(address payable receiver) registeredReliefFunds(receiver) public payable {
        receiver.transfer(msg.value);
        reliefFundsManagers[receiver].totalAmount += msg.value;
        reliefFundsManagers[receiver].remainingUsage += msg.value;

        DonationInfo memory donationInfo = DonationInfo({
            val: msg.value,
            donor: address(msg.sender),
            donatedOn: block.timestamp
        });
        donationHistoryMapping[receiver].push(donationInfo);
    }

    function getDonationHistory(address fundsAddress) public view returns(DonationInfo[] memory) {
        return donationHistoryMapping[fundsAddress];
    }

    function toggleFundsNeeded(address fundsAddress) reliefFundsExists(fundsAddress) authorizedManager(fundsAddress) public returns(bool){
        reliefFundsManagers[fundsAddress].fundsNeeded = !reliefFundsManagers[fundsAddress].fundsNeeded;
        return reliefFundsManagers[fundsAddress].fundsNeeded;
    }

    function removeReliefFunds(address fundsAddress) authorizedManager(fundsAddress) public {
        reliefFundsManagers[fundsAddress].description = "";
        reliefFundsManagers[fundsAddress].fundsNeeded = false;
        reliefFundsManagers[fundsAddress].manager = address(0x0000000000000000000000000000000000000000);
        reliefFundsManagers[fundsAddress].createdOn = 0;
        reliefFundsManagers[fundsAddress].totalAmount = 0;
        reliefFundsManagers[fundsAddress].remainingUsage = 0;

        delete usageMapping[fundsAddress];
        delete donationHistoryMapping[fundsAddress];
    }

    function closeContract() public onlyDeveloper { 
        selfdestruct(developer);
    }

}