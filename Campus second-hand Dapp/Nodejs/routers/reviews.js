const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise'); // 使用 promise 版本

// 创建 MySQL 连接池
const pool = mysql.createPool({
    host: 'localhost', // MySQL 主机名
    user: 'root',      // MySQL 用户名
    password: '123456',  
    database: 'compusdapp',
});

console.log('进入 handleReviews');
// 处理 post 请求，将评论信息存入数据库
router.post('/addReviews', async (req, res) => {
    try {
        const { userAddress, productId, comment } = req.body;
        console.log('拿到前端数据:', req.body);
        
        // 验证接收到的每一个字段
        console.log('userAddress:', userAddress);
        console.log('productId:', productId);
        console.log('comment:', comment);
        const connection = await pool.getConnection();

        const query = 'INSERT INTO reviews (userAddress, productId, comment) VALUES (?, ?, ?)';
        const values = [userAddress, productId, comment];

        const [result] = await connection.execute(query, values);
        console.log('数据库查询已执行:', result);

        connection.release();
        
        res.status(200).json({ message: '评论信息插入成功' });
    } catch (error) {
        console.error('评论信息插入失败:', error);
        res.status(500).json({ message: '评论信息插入失败' });
    }
});

module.exports = router;
