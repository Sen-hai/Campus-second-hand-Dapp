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

router.get('/getTraceabilityInfo/:productId', async (req, res) => {
    const productId = req.params.productId;
    try {
        const connection = await pool.getConnection();
        const [results] = await connection.query('SELECT * FROM traceabilityinfo WHERE productId = ?', [productId]);
        console.log("productId:"+ productId);
        console.log("results : "+ results);
        connection.release();
        res.json(results);
    } catch (error) {
        console.error('数据库查询失败：', error);
        res.status(500).send('服务器错误');
    }
});

module.exports = router;
