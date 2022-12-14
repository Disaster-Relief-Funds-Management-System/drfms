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
    address PshContract;


    mapping(address => uint256) balances;

    mapping(address => mapping (address => uint256)) allowed;

    uint256 totalAmount;


   constructor() {
    PshContract =  address(this);
    totalAmount = 1000000000000000000000000000000000000;
    balances[PshContract] = totalAmount;
    }

    // modifier onlyContract(){
    //     require(msg.sender == PshContract, "Only Owner is allowed to AirDrop!");
    //     _;
    // }

    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a >= b ? a : b;
    }

    function mint(uint256 amount) internal {
        balances[PshContract] += max(amount, 1000000000000000000000000000000000000);
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

    function sendPaSheuem(address from, address to, uint256 numTokens) public{
        // require(numTokens <= 100);
        // require(balances[PshContract] > numTokens);
        // numTokens *= 10**18;
        if (from == PshContract && balances[PshContract] < numTokens) { // mints additions tokens if contract runs out
            mint(numTokens);
        } else if (from != PshContract) {
            require(balances[from] >= numTokens, "sender does not have enough tokens");
        }
        balances[to] = balances[to] >= 0 ? balances[to] + numTokens:numTokens;
        balances[from] = balances[from] - numTokens;
        emit Transfer(from, to, numTokens);
    }
}
