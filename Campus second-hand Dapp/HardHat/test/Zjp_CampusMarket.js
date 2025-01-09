const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Marketplace", function () {
  let Marketplace;
  let marketplace;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    Marketplace = await ethers.getContractFactory("Marketplace");
    [owner, addr1, addr2] = await ethers.getSigners();

    marketplace = await Marketplace.deploy();
  });

  it("允许用户注册和用户登录", async function () {
    const username = "user";
    const gender = "non-binary";
    const contact = "user@example.com";
    const password = "password123";

    await marketplace.registerBuyer(username, gender, contact, password);

    const loginSuccess = await marketplace.login(username, password);
    expect(loginSuccess).to.equal(true);
  });

  it("允许已注册的卖家添加商品、买家查看商品详情", async function () {
    const username = "seller";
    const gender = "female";
    const contact = "seller@example.com";
    const password = "password456";

    await marketplace.connect(addr1).registerSeller(username, gender, contact, password);

    const productName = "鞋架";
    const productDescription = "九九新，很棒的鞋架";
    const productPrice = BigInt(1) * BigInt(10 ** 18); // 1 ETH，单位转换为 wei
    const productQuantity = 2;
    const productImage = "鞋架.png";
    const category = "家居";

    await marketplace.connect(addr1).addProduct(productName, productDescription, productPrice, productQuantity, productImage, category);

    // 买家查看商品详情
    const product = await marketplace.getProduct(0);

    expect(product.name).to.equal(productName);
    expect(product.description).to.equal(productDescription);
    expect(product.price.toString()).to.equal(productPrice.toString());
    expect(product.quantity).to.equal(productQuantity);
    expect(product.image).to.equal(productImage);
    expect(product.category).to.equal(category);
    expect(product.seller).to.equal(addr1.address);
  });

  it("允许已注册的买家兑换代币、收藏商品、购买商品、用代币结算、查看余额和交易历史", async function () {
    const buyerUsername = "buyer";
    const buyerGender = "male";
    const buyerContact = "buyer@example.com";
    const buyerPassword = "password123";

    await marketplace.registerBuyer(buyerUsername, buyerGender, buyerContact, buyerPassword);

    const sellerUsername = "seller";
    const sellerGender = "female";
    const sellerContact = "seller@example.com";
    const sellerPassword = "password456";

    // 使用addr2连接并注册卖家
    await marketplace.connect(addr2).registerSeller(sellerUsername, sellerGender, sellerContact, sellerPassword);

    const productName = "鞋架";
    const productDescription = "九九新，很棒的鞋架";
    const productPrice = BigInt(20); // 20 tokens
    const productQuantity = 2;
    const productImage = "鞋架.png";
    const category = "家居";

    // 添加商品到市场
    await marketplace.connect(addr2).addProduct(productName, productDescription, productPrice, productQuantity, productImage, category);

    //买家收藏商品
    await marketplace.connect(owner).addFavoriteProduct(0);
    const favoriteProducts = await marketplace.connect(owner).viewFavoriteProducts();
    console.log("收藏的商品: ", favoriteProducts); 
    expect(favoriteProducts.length).to.equal(1);
    expect(favoriteProducts[0]).to.equal(0);

    // 买家交换ETH为token
    const swapEthAmount = BigInt(1) * BigInt(10 ** 18); // 1 ETH
    await marketplace.connect(owner).swapTokensForEth({ value: swapEthAmount }); // 买家交换1 ETH为token

    // 检查交换后所有者的余额
    const ownerBalance = await marketplace.balanceOf(owner.address);
    const expectedTokens = (swapEthAmount / BigInt(10 ** 18)) * BigInt(100); // 1 ETH = 100 tokens
    expect(ownerBalance.toString()).to.equal(expectedTokens.toString());

    // 买家购买商品
    await marketplace.connect(owner).buyProduct(0, 1);

    // 使用getProduct方法验证购买后的商品数量
    const productAfterPurchase = await marketplace.getProduct(0);
    console.log("购买后的商品: ", productAfterPurchase); // 调试信息

    // 确保购买后商品数量减少
    expect(productAfterPurchase.quantity).to.equal(1); // 剩余数量应为1

    const buyerTransactions = await marketplace.getUserTransactionHistory();
    console.log("买家交易历史: ", buyerTransactions); // 调试信息
    expect(buyerTransactions.length).to.equal(1);
    expect(buyerTransactions[0].amount.toString()).to.equal(productPrice.toString());

    // 检查购买后所有者的余额
    const ownerBalanceAfterPurchase = await marketplace.balanceOf(owner.address);
    console.log("购买后的所有者余额: ", ownerBalanceAfterPurchase.toString()); // 调试信息
    const addr2Balance = await marketplace.balanceOf(addr2.address);
    console.log("addr2的余额: ", addr2Balance.toString());
    expect(ownerBalanceAfterPurchase.toString()).to.equal((expectedTokens - productPrice).toString());
  });

  it("允许已注册的买家提交评价并查看所有评价", async function () {
    const buyerUsername = "buyer";
    const buyerGender = "male";
    const buyerContact = "buyer@example.com";
    const buyerPassword = "password123";

    // 注册买家
    await marketplace.registerBuyer(buyerUsername, buyerGender, buyerContact, buyerPassword);

    const sellerUsername = "seller";
    const sellerGender = "female";
    const sellerContact = "seller@example.com";
    const sellerPassword = "password456";

    // 使用addr2连接并注册卖家
    await marketplace.connect(addr2).registerSeller(sellerUsername, sellerGender, sellerContact, sellerPassword);

    const productName = "鞋架";
    const productDescription = "九九新，很棒的鞋架";
    const productPrice = BigInt(30); // 30 tokens
    const productQuantity = 2;
    const productImage = "鞋架.png";
    const category = "家居";

    // 添加商品到市场
    await marketplace.connect(addr2).addProduct(productName, productDescription, productPrice, productQuantity, productImage, category);

    // 买家交换ETH为tokens（买家地址是owner）
    const swapEthAmount = BigInt(1) * BigInt(10 ** 18); // 1 ETH
    await marketplace.connect(owner).swapTokensForEth({ value: swapEthAmount }); // 买家交换1 ETH为tokens

    // 买家购买商品
    await marketplace.connect(owner).buyProduct(0, 1);

    // 买家添加评价
    const reviewComment = "商品非常棒，物超所值!";
    await marketplace.connect(owner).addReview(0, reviewComment);

    // 验证评价是否添加
    const reviews = await marketplace.getReviews(0);
    console.log("评价: ", reviews); // 调试信息

    // 确保评价数量为1
    expect(reviews.length).to.equal(1);
    // 确保评价内容与添加的评价相符
    expect(reviews[0].comment).to.equal(reviewComment);
    // 确保评价者是owner地址
    expect(reviews[0].reviewer).to.equal(owner.address);
  });

});
