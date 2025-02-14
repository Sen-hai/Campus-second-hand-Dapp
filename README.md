
## 部署问题可联系
## senhai6@qq.com

```markdown
# 🛍️ 去中心化二手交易平台

[![Solidity](https://img.shields.io/badge/Solidity-%23363636.svg?style=flat&logo=solidity&logoColor=white)](https://soliditylang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-FFF100?style=flat&logo=hardhat&logoColor=black)](https://hardhat.org/)

基于区块链技术的二手商品交易DApp，实现去中心化交易与可信价值流转

## 🌟 核心功能
| 模块 | 技术实现 | 特性 |
|------|----------|------|
| **区块链交互** | Solidity + Hardhat | 智能合约自动执行交易 |
| **去中心化存储** | IPFS | 商品图片永久存证 |
| **资产结算** | ERC-20代币 | 安全链上支付 |
| **信用体系** | 链上评价系统 | 交易双方互评机制 |
| **隐私保护** | AES-256加密 | 用户数据安全保障 |


# 🛒 二手商品交易DApp功能蓝图

| 编号 | 功能模块         | 核心功能描述                                                                                     
|------|------------------|--------------------------------------------------------------------------------------------------
| 1    | **账户体系**     | 🔐 MetaMask钱包一键登录/注册<br>📧 可选邮箱二次验证<br>🛡️ AES-256加密存储用户敏感信息             
| 2    | **商品发布**     | 📦 多维度商品信息录入（名称/描述/价格等）<br>🌐 IPFS图片永久存储<br>⏰ 区块链时间戳认证            
| 3    | **商品下架**     | 🤖 智能合约自动库存检测<br>✅ 交易完成后自动触发下架<br>📊 销售数据可视化归档                     
| 4    | **商品发现**     | 🔍 多条件复合筛选（价格区间/商品类别）<br>❤️ 用户收藏功能（*选做*）<br>👍 点赞互动系统（*选做*）   
| 5    | **商品溯源**     | 🔗 区块链交易全链路追踪<br>📜 所有权变更历史树<br>🛡️ 防篡改信息存证                              
| 6    | **链上交易**     | 💰 ERC-20代币支付系统<br>🤝 智能合约自动托管交易<br>📌 价格锚定机制（USDT/DAI）                   
| 7    | **资产管理**     | 💵 链上钱包余额实时监控<br>📊 交易历史可视化报表<br>🔒 链下资产托管账户                           
| 8    | **信用体系**     | ⭐ 5星评分系统（买卖双向）<br>📸 评价图片证据链存储<br>🏆 信用等级勋章体系                       
| 9    | **合约部署**     | 🛠️ Hardhat全流程开发环境<br>🧪 自动化测试框架<br>🔗 合约验证插件支持                            

## 🛠 技术栈
### 前端架构
<p>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white" height="25"/>
  <img src="https://img.shields.io/badge/AntDesign-0170FE?style=for-the-badge&logo=ant-design&logoColor=white" height="25"/>
  <img src="https://img.shields.io/badge/Web3.js-F16822?style=for-the-badge&logo=web3.js&logoColor=white" height="25"/>
</p>

### 智能合约
<p>
  <img src="https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white" height="25"/>
  <img src="https://img.shields.io/badge/Hardhat-FFF100?style=for-the-badge&logo=hardhat&logoColor=black" height="25"/>
</p>

### 后端服务
<p>
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" height="25"/>
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" height="25"/>
</p>

## 🚀 快速开始
### 环境准备
```bash
# 安装依赖
npm install -g hardhat
npm install ethers web3.js @openzeppelin/contracts
```

### 智能合约部署
```bash
# 1. 配置环境变量
cp .env.example .env

# 2. 编译合约
npx hardhat compile

# 3. 本地测试网络
npx hardhat node

# 4. 部署合约（新终端）
npx hardhat run scripts/deploy.js --network localhost
```

### 前端启动
```bash
cd React
npm install
npm run start

```

## ⚙️ 系统配置
1. **数据库设置**：创建MySQL数据库并导入`schema.sql`

2. **钱包连接**：配置MetaMask连接本地测试网络

## 📂 项目结构
```
├── HardHat/            # 智能合约源码
├── React/             # 前端React应用
├── Nodejs/              # Express服务端

```

## 🌐 网络配置
| 网络 | RPC URL | 链ID |
|------|---------|------|
| 本地测试 | http://localhost:8545 | 31337 |
| Goerli测试网 | https://goerli.infura.io/v3/YOUR_KEY | 5 |

## 📜 开源协议
MIT License | Copyright © 2024 [Senhai]
```

### 设计亮点：
1. **动态徽章系统**：使用Shields.io实时显示技术状态
2. **交互式代码块**：可直接复制的部署指令
3. **结构化展示**：通过树形图直观呈现项目架构
4. **网络配置表**：清晰标注多链环境参数
5. **响应式布局**：完美适配GitHub Dark/Light模式

