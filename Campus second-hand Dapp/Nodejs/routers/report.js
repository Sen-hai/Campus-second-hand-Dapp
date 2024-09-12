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

console.log('进入 handleReport');
// 处理 post 请求，将举报信息存入数据库
router.post('/report', async (req, res) => {
    try {
        const { productId, reporter, reportReason } = req.body;
        console.log('拿到前端数据:', req.body);
        
        // 验证接收到的每一个字段
        console.log('productId:', productId);
        console.log('reporter:', reporter);
        console.log('reportReason:', reportReason);
        const connection = await pool.getConnection();

        const query = 'INSERT INTO reports (productId, reporter, reportReason) VALUES (?, ?, ?)';
        const values = [productId, reporter, reportReason];

        const [result] = await connection.execute(query, values);
        console.log('数据库查询已执行:', result);

        connection.release();
        
        res.status(200).json({ message: '举报信息插入成功' });
    } catch (error) {
        console.error('举报信息插入失败:', error);
        res.status(500).json({ message: '举报信息插入失败' });
    }
});

module.exports = router;
