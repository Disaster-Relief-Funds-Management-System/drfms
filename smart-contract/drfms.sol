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
    }

    struct UsageInfo {
        string reason;
        uint256 val;
        uint256 usedOn; // epochs in frontend
    }
    
    mapping(address => ReliefFundsDetails) public reliefFundsManagers;
    mapping(address => UsageInfo[]) internal usageMapping;

    modifier onlyDeveloper() {
        require(msg.sender == developer);
        _;
    }

    modifier authorizedManager(address addr) {
        require(msg.sender == reliefFundsManagers[addr].manager, "You don't have the permission to add usage informaation.");
        _;
    }

    modifier registeredReliefFunds(address addr) {
        require(reliefFundsManagers[addr].fundsNeeded == true, "No more funds needed / address not registered / address not valid. Thus, we can't transfer funds.");
        _;
    }

    function addUsage(address fundsAddress, string memory reason, uint256 val, uint256 usedOn) authorizedManager(fundsAddress) public {
        UsageInfo memory info = UsageInfo({
            reason: reason,
            val: val,
            usedOn: usedOn
        });

        usageMapping[fundsAddress].push(info);
    }

    function getUsage(address fundsAddress) public view returns (UsageInfo[] memory) {
        return usageMapping[fundsAddress];
    }

    function addReliefFundsManager(address fundsAddress, string memory description) public {
        ReliefFundsDetails memory details = ReliefFundsDetails({
            description: description,
            manager: msg.sender,
            createdOn: block.timestamp,
            totalAmount: 0,
            fundsNeeded: true
        });

        reliefFundsManagers[fundsAddress] = details;
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
    }

    function closeContract() public onlyDeveloper { 
        selfdestruct(developer);
    }

}