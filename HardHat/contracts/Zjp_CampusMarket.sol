// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// 定义 MarketplaceToken 合约，继承自 ERC20 和 Ownable
contract Marketplace is ERC20, Ownable {
    address private contractOwner;

    // 代币兑换事件
    event TokenSwapped(
        address indexed from,
        uint256 amount,
        uint256 ethReceived
    );

    // ProductAdded 事件，包含商品ID和卖家地址
    event ProductAdded(uint256 indexed productId, address indexed seller);

    // 交易结构体
    struct Transaction {
        address buyer; 
        address seller; 
        uint256 productId; 
        string productName; 
        uint256 amount; 
        bool reviewed;
    }

    // 商品结构体
    struct Product {
        string name;
        string description; 
        uint256 price; 
        uint256 quantity; 
        string image; 
        uint256 timestamp; 
        bool active; 
        address seller; 
        string category; 
    }

    // 用户结构体
    struct User {
        string username; 
        string gender;
        string contact; 
        string password; 
        bool registered;
        bool isBuyer;
        bool isSeller; 
        uint256 balance; 
        mapping(uint256 => Transaction) transactions; 
        uint256 transactionCount; 
        mapping(uint256 => Review) reviews; 
        uint256 reviewCount;
        uint256[] favoriteProducts; 
    }

    // 评价结构体
    struct Review {
        address reviewer; 
        string comment; 
        uint256 timestamp; 
    }


    mapping(address => User) private users; 
    mapping(uint256 => Product) private products; 
    uint256 private productCount; 

    Product[] private activeProducts; 

    // 构造函数
    constructor() ERC20("MarketplaceToken", "EJK") Ownable(msg.sender) {
        contractOwner = msg.sender; // 初始化合约所有者地址
    }

    // 注册买家
    function registerBuyer(
        string calldata _username,
        string calldata _gender,
        string calldata _contact,
        string calldata _password
    ) external {
        require(!users[msg.sender].registered, "User already registered");

        User storage user = users[msg.sender];
        user.username = _username;
        user.gender = _gender;
        user.contact = _contact;
        user.password = _password;
        user.registered = true;
        user.isBuyer = true;
    }

    // 注册卖家
    function registerSeller(
        string calldata _username,
        string calldata _gender,
        string calldata _contact,
        string calldata _password
    ) external {
        require(!users[msg.sender].registered, "User already registered");

        User storage user = users[msg.sender];
        user.username = _username;
        user.gender = _gender;
        user.contact = _contact;
        user.password = _password;
        user.registered = true;
        user.isSeller = true;
    }

    // 登录
    function login(string calldata _username, string calldata _password)
        external
        view
        returns (bool)
    {
        require(users[msg.sender].registered, "User not registered"); // 检查用户是否已注册
        require(
            keccak256(abi.encodePacked(users[msg.sender].username)) ==
                keccak256(abi.encodePacked(_username)),
            "Invalid username"
        ); // 检查用户名是否匹配
        require(
            keccak256(abi.encodePacked(users[msg.sender].password)) ==
                keccak256(abi.encodePacked(_password)),
            "Invalid password"
        ); // 检查密码是否匹配
        return true; // 登录成功
    }

    // 发布商品
    function addProduct(
        string calldata _name,
        string calldata _description,
        uint256 _price,
        uint256 _quantity,
        string calldata _image,
        string calldata _category
    ) external {
        require(users[msg.sender].isSeller, "Only sellers can add products");

        products[productCount] = Product({
            name: _name,
            description: _description,
            price: _price,
            quantity: _quantity,
            image: _image,
            timestamp: block.timestamp,
            active: true,
            seller: msg.sender,
            category: _category
        });

        emit ProductAdded(productCount, msg.sender);

        activeProducts.push(products[productCount]);
        productCount++;
    }

    // 浏览商品
    function browseProducts() external view returns (Product[] memory) {
        return activeProducts; // 返回所有激活状态的商品
    }

    // 获取商品总数
    function getProductCount() external view returns (uint256) {
        return productCount;
    }
    
    // 获取商品详细信息
    function getProduct(uint256 _index) external view returns (Product memory) {
        require(_index < productCount, "Invalid index"); 
        return products[_index]; 
    }

    // 添加收藏商品
    function addFavoriteProduct(uint256 _productId) external {
        require(users[msg.sender].registered, "User not registered");
        users[msg.sender].favoriteProducts.push(_productId);
    }

    // 查看收藏的商品
    function viewFavoriteProducts() external view returns (uint256[] memory) {
        require(users[msg.sender].registered, "User not registered");
        return users[msg.sender].favoriteProducts;
    }

    // 购买商品
    function buyProduct(uint256 _index, uint256 _quantity) external {
        require(_index < productCount, "Invalid index");
        require(users[msg.sender].registered, "User not registered"); 
        require(
            users[msg.sender].isBuyer,
            "User not authorized to buy product"
        ); // 检查用户是否为买家
        require(products[_index].quantity >= _quantity, "Not enough quantity");
        require(
            products[_index].active == true,
            "The product has been removed from the shelves"
        ); // 检查商品是否激活

        uint256 totalPrice = products[_index].price * _quantity;
        require(balanceOf(msg.sender) >= totalPrice, "Not enough balance");

        // 转账代币
        _transfer(msg.sender, products[_index].seller, totalPrice);

        // 减少商品数量
        products[_index].quantity -= _quantity;

        // 记录交易
        users[msg.sender].transactions[
            users[msg.sender].transactionCount
        ] = Transaction({
            buyer: msg.sender,
            seller: products[_index].seller,
            productId: _index,
            productName: products[_index].name,
            amount: totalPrice,
            reviewed: false
        });
        users[msg.sender].transactionCount++; // 增加交易记录数量

        // 如果商品数量为0，下架商品
        if (products[_index].quantity == 0) {
            delete products[_index];
        }
    }

    // 查看用户交易历史
    function getUserTransactionHistory()
        external
        view
        returns (Transaction[] memory)
    {
        require(users[msg.sender].registered, "User not registered");

        User storage user = users[msg.sender];
        Transaction[] memory transactionHistory = new Transaction[](
            user.transactionCount
        );

        for (uint256 i = 0; i < user.transactionCount; i++) {
            transactionHistory[i] = user.transactions[i];
        }

        return transactionHistory;
    }

    // 查看用户余额
    function getUserBalance(address _user) external view returns (uint256) {
        return balanceOf(_user); // 返回用户余额
    }

    // 兑换代币
    function swapTokensForEth() external payable {
        uint256 ethAmount = (msg.value / 1e18) * 100; 
        _mint(msg.sender, ethAmount);
        emit TokenSwapped(owner(), msg.value, ethAmount);
    }

    // 提交评价
    function addReview(uint256 _index, string calldata _comment) external {
        require(_index < productCount, "Invalid index"); 
        require(users[msg.sender].registered, "User not registered"); 
        require(users[msg.sender].isBuyer, "User not authorized to add review"); 
        users[msg.sender].reviews[users[msg.sender].reviewCount] = Review({
            reviewer: msg.sender,
            comment: _comment,
            timestamp: block.timestamp
        });
        users[msg.sender].reviewCount++;
        users[msg.sender].transactions[_index].reviewed = true; 
    }

    // 获取商品评价
    function getReviews(uint256 _index)
        external
        view
        returns (Review[] memory)
    {
        require(_index < productCount, "Invalid index"); 
        Review[] memory reviews = new Review[](users[msg.sender].reviewCount); 
        for (uint256 i = 0; i < users[msg.sender].reviewCount; i++) {
            reviews[i] = users[msg.sender].reviews[i]; 
        }
        return reviews; 
    }
}
