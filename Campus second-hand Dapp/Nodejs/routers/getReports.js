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

router.get('/getReports', async (req, res) => {
    try {
        // 从连接池获取连接
        const connection = await pool.getConnection();

        // 执行 SQL 查询
        const [results] = await connection.query('SELECT * FROM reports');
        // 返回查询结果
        res.json(results);

    } catch (error) {
        console.error('Error executing MySQL query:', error);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router;