// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IERC20 {

    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    // function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);


    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}


contract ERC20Basic is IERC20 {

    string public constant name = "PaSheuem";
    string public constant symbol = "PSH";
    uint8 public constant decimals = 18;
    address PshOwner;


    mapping(address => uint256) balances;

    mapping(address => mapping (address => uint256)) allowed;

    uint256 totalAmount;


   constructor() {
    PshOwner =  msg.sender;
    totalAmount = 1000000000000000000000000000000000000;
    balances[msg.sender] = totalAmount;
    }

    modifier onlyOwner(){
        require(msg.sender == PshOwner, "Only Owner is allowed  to AirDrop!");
        _;
    }

    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a >= b ? a : b;
    }

    function mint(uint256 amount) internal {
        balances[PshOwner] += max(amount, 1000000000000000000000000000000000000);
    }

    function totalSupply() public override view returns (uint256) {
        return totalAmount;
    }

    function balanceOf(address tokenOwner) public override view returns (uint256) {
        return balances[tokenOwner];
    }

    function transfer(address receiver, uint256 numTokens) public override returns (bool) {
        require(numTokens <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender]-numTokens;
        balances[receiver] = balances[receiver]+numTokens;
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }

    function approve(address delegate, uint256 numTokens) public override returns (bool) {
        allowed[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }

    function sendPaSheuem(address receiver, uint256 numTokens) onlyOwner public{
        // require(numTokens <= 100);
        // require(balances[PshOwner] > numTokens);
        if (balances[PshOwner] < numTokens) { // mints additions tokens if contract runs out
            mint(numTokens);
        }
        balances[receiver] = balances[receiver] >= 0 ? balances[receiver] + numTokens:numTokens;
        balances[PshOwner] = balances[PshOwner] - numTokens;
        emit Transfer(PshOwner, receiver, numTokens);
    }
}
