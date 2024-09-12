const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const mysql = require('mysql2/promise');

// 创建 MySQL 连接池
const pool = mysql.createPool({
    host: 'localhost', // MySQL 主机名
    user: 'root',      // MySQL 用户名
    password: '123456',  // MySQL 密码
    database: 'compusdapp', // 数据库名称
});

router.post('/register', async (req, res) => {
  const { username, password, address } = req.body;
  console.log('收到注册请求:', req.body);

  try {
    // 对密码进行加密
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('加密后的密码:', hashedPassword);

    // 获取连接
    const connection = await pool.getConnection();
    try {
      // 插入用户数据
      const query = 'INSERT INTO user (username, password, address) VALUES (?, ?, ?)';
      await connection.query(query, [username, hashedPassword, address]);
      res.status(200).send('注册成功');
    } catch (err) {
      console.error('插入数据失败:', err);
      res.status(500).send('服务器内部错误');
    } finally {
      // 确保连接释放
      connection.release();
    }
  } catch (error) {
    console.error('密码加密失败:', error);
    res.status(500).send('服务器内部错误');
  }
});

module.exports = router;
