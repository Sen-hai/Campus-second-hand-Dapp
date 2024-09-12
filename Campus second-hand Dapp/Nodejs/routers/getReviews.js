const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise'); // 使用 promise 版本

// 创建 MySQL 连接池
const pool = mysql.createPool({
    host: 'localhost', 
    user: 'root',      
    password: '123456',  
    database: 'compusdapp', 
});

router.get('/getReviews/:productId', async (req, res) => {
    const { productId } = req.params; // 从 URL 参数中获取 productId
    console.log('评论productId:', productId);
    try {
        // 从连接池获取连接
        const connection = await pool.getConnection();

        // 执行 SQL 查询
        const query = `
            SELECT u.username, r.comment, r.reviewsTime 
            FROM reviews r
            JOIN user u ON r.userAddress = u.address
            WHERE r.productId = ?
            ORDER BY r.reviewsTime DESC
        `;
        const [results] = await connection.query(query, [productId]);

        // 返回查询结果
        res.json(results);

    } catch (error) {
        console.error('Error executing MySQL query:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
