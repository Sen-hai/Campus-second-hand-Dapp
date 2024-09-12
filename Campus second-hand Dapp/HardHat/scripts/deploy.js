const hre = require("hardhat");
const { ethers } = hre;

async function main() {
    // 编译合约（如果尚未编译）
    await hre.run('compile');

    // 获取合约工厂
    const Marketplace = await hre.ethers.getContractFactory("Marketplace");

    // 部署合约
    const marketplace = await Marketplace.deploy();

    // 等待合约部署完成
    await marketplace.deploymentTransaction().wait(); // 等待交易完成

    console.log("Marketplace deployed to:", marketplace.target); // 获取合约地址

    // 保存合约地址到文件
    const fs = require('fs');
    const addresses = { Marketplace: marketplace.target }; // 更新为正确的属性
    fs.writeFileSync('scripts/Marketplace-address.json', JSON.stringify(addresses, null, 2));
}

// 运行主函数并处理错误
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

//  npx hardhat run scripts/deploy.js --network localhost