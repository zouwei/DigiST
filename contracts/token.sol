pragma solidity ^0.4.25;

contract ERC20Interface {
  string public name;
  string public symbol;
  uint256 public constant decimals = 18;
  uint public totalSupply;


  function transfer(address _to, uint256 _value) public returns (bool success);
  function transferFrom(address _from, address _to, uint256 _value) public returns (bool success);
  function approve(address _spender, uint256 _value) public returns (bool success);
  function allowance(address _owner, address _spender) view public returns (uint256 remaining);

  event Transfer(address indexed _from, address indexed _to, uint256 _value);
  event Approval(address indexed _owner, address indexed _spender, uint256 _value);

}

contract ERC20 is ERC20Interface {

    mapping (address => uint256) public balanceOf;
    mapping (address => mapping (address => uint256)) internal allowed;

    constructor(uint256 _totalSupply,string _name,string _symbol) public {
        totalSupply = _totalSupply * 10 ** decimals;
        name = _name;
        symbol = _symbol;
        balanceOf[msg.sender] = totalSupply;
    }

  function balanceOf(address _owner) view public returns (uint256 balance) {
      return balanceOf[_owner];
  }

    function transfer(address _to, uint _value) public returns (bool success) {
        require(_to != address(0));
        require(_value <= balanceOf[msg.sender]);
        require(balanceOf[_to] + _value >= balanceOf[_to]);

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

      function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_to != address(0));
        require(_value <= balanceOf[_from]);
        require(_value <= allowed[_from][msg.sender]);
        require(balanceOf[_to] + _value >= balanceOf[_to]);

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        allowed[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
      }

  function approve(address _spender, uint256 _value) public returns (bool success) {
          allowed[msg.sender][_spender] = _value;
    emit Approval(msg.sender, _spender, _value);
    return true;
  }

  function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
      return allowed[_owner][_spender];
  }

}
