# 🚀 去中心化校园二手交易平台

<p>
  <img src="https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white" height="25"/>
  <img src="https://img.shields.io/badge/Hardhat-FFF100?style=for-the-badge&logo=hardhat&logoColor=black" height="25"/>
</p>

## 🛍️ 二手商品交易 DApp 功能蓝图

| 编号 | 功能模块         | 核心功能描述                                                                                     |
|------|------------------|--------------------------------------------------------------------------------------------------|
| 1    | **账户体系**     | 🔐 MetaMask 钱包一键登录/注册<br>📧 可选邮箱二次验证<br>🛡️ AES-256 加密存储用户敏感信息             |
| 2    | **商品发布**     | 📦 多维度商品信息录入（名称/描述/价格等）<br>🌐 IPFS 图片永久存储<br>⏰ 区块链时间戳认证         |
| 3    | **商品下架**     | 🤖 智能合约自动库存检测<br>✅ 交易完成后自动触发下架<br>📊 销售数据可视化归档                     |
| 4    | **商品发现**     | 🔍 多条件复合筛选（价格区间/商品类别）<br>❤️ 用户收藏功能（*选做*）<br>👍 点赞互动系统（*选做*） |
| 5    | **商品溯源**     | 🔗 区块链交易全链路追踪<br>📜 所有权变更历史树<br>🛡️ 防篡改信息存证                             |
| 6    | **链上交易**     | 💰 ERC-20 代币支付系统<br>🤝 智能合约自动托管交易<br>📌 价格锚定机制（USDT/DAI）                |
| 7    | **资产管理**     | 💵 链上钱包余额实时监控<br>📊 交易历史可视化报表<br>🔒 链下资产托管账户                         |
| 8    | **信用体系**     | ⭐ 5 星评分系统（买卖双向）<br>📸 评价图片证据链存储<br>🏆 信用等级勋章体系                     |
| 9    | **合约部署**     | 🛠️ Hardhat 全流程开发环境<br>🧪 自动化测试框架<br>🔗 合约验证插件支持                         |

## 🔧 后端服务
<p>
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" height="25"/>
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" height="25"/>
</p>

## 🚀 快速开始

### 环境准备
```bash
npm install -g hardhat
npm install ethers web3.js @openzeppelin/contracts
```

### 智能合约部署
```bash
# 1. 配置环境变量
cp .env.example .env

# 2. 编译合约
npx hardhat compile

# 3. 启动本地测试网络
npx hardhat node

# 4. 部署合约（新终端执行）
npx hardhat run scripts/deploy.js --network localhost
```

### 前端启动
```bash
cd React
npm install
npm run start
```

## ⚙️ 系统配置

1. **数据库设置**：创建 MySQL 数据库并导入 `schema.sql`
2. **钱包连接**：配置 MetaMask 连接本地测试网络

## 📂 项目结构

```
├── HardHat/           # 智能合约源码
├── React/             # 前端 React 应用
├── Nodejs/            # Express 服务端
```

## 🌐 网络配置

| 网络          | RPC URL                                  | 链 ID  |
|--------------|----------------------------------------|------|
| 本地测试     | http://localhost:8545                 | 31337 |
| Goerli 测试网 | https://goerli.infura.io/v3/YOUR_KEY  | 5    |

## 📜 开源协议

MIT License © 2024 [Senhai]

## 📩 部署问题可联系
**senhai6@qq.com**

---

### 🎨 设计亮点

✅ **动态徽章系统**：使用 Shields.io 实时显示技术状态  
✅ **交互式代码块**：可直接复制的部署指令  
✅ **结构化展示**：通过树形图直观呈现项目架构  
✅ **网络配置表**：清晰标注多链环境参数  
✅ **响应式布局**：完美适配 GitHub Dark/Light 模式

