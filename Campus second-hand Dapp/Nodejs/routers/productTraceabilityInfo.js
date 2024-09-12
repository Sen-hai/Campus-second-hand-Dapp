const express = require('express');
const router = express.Router();

const mysql = require('mysql2/promise'); // 使用 promise 版本

// 创建 MySQL 连接池
const pool = mysql.createPool({
    host: 'localhost', // MySQL 主机名
    user: 'root',      // MySQL 用户名
    password: '123456',  // MySQL 密码
    database: 'compusdapp', // 数据库名称
});


console.log('进入 savetraceabilityInfo');
// 处理 post 请求，将追溯信息存入数据库
router.post('/savetraceabilityInfo', async (req, res) => {
    try {
        const { productId, transactionHash, blocknumber, fromaccount, toaccount, nonce, actionType } = req.body;
        console.log('拿到前端数据:', req.body);
        
        // 验证接收到的每一个字段
        console.log('productId:', productId);
        console.log('transactionHash:', transactionHash);
        console.log('blocknumber:', blocknumber);
        console.log('fromaccount:', fromaccount);
        console.log('toaccount:', toaccount);
        console.log('nonce:', nonce);
        console.log('actionType:', actionType);

        const connection = await pool.getConnection();

        const query = 'INSERT INTO traceabilityinfo (productId, transactionHash, blocknumber, fromaccount, toaccount, nonce, actionType) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [productId, transactionHash, blocknumber, fromaccount, toaccount, nonce, actionType];

        const [result] = await connection.execute(query, values);
        console.log('数据库查询已执行:', result);

        connection.release();
        
        res.status(200).json({ message: '追溯信息插入成功' });
    } catch (error) {
        console.error('追溯信息插入失败:', error);
        res.status(500).json({ message: '追溯信息插入失败' });
    }
});

module.exports = router;