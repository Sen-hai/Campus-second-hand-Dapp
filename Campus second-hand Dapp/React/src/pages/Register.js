import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message, Card, Row, Col } from 'antd';
import { web3, campusMarketContract } from '../contract/campusMarket';
import axios from 'axios'; // 引入 Axios
import { Link } from 'react-router-dom'; // Import Link from React Router DOM
import backgroundImage from '../pages/images/云2.jpg'; // 导入背景图片



const { Option } = Select;

const Register = () => {
  const [account_zjp, setAccount_zjp] = useState('');
  const [roleId, setroleId] = useState('1');
  const [form_zjp] = Form.useForm();

  useEffect(() => {
    const loadAccount_zjp = async () => {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        setAccount_zjp(accounts[0]);
        console.log("账户:", accounts[0]);
      } catch (error) {
        message.error("请先连接您的钱包!");
      }
    };
    loadAccount_zjp();
  }, []);

  const handleRegister_zjp = async (values_zjp) => {
    const { username_zjp, gender_zjp, contact_zjp, password_zjp } = values_zjp;
    if (!campusMarketContract || !account_zjp) {
      message.error("请先连接您的钱包!");
      return;
    }

    try {
      console.log("开始注册...");
      if (roleId === "1") {
        await campusMarketContract.methods
          .registerBuyer(username_zjp, gender_zjp, contact_zjp, password_zjp)
          .send({ from: account_zjp, gas: "5000000" });
      } else if (roleId === "2") {
        await campusMarketContract.methods
          .registerSeller(username_zjp, gender_zjp, contact_zjp, password_zjp)
          .send({ from: account_zjp, gas: "5000000" });
      }
      console.log("username:", username_zjp);
      // 保存用户信息到数据库
      // 向后端发送注册数据     
      console.log("发送注册请求到后端...");
      const response = await axios.post('http://localhost:3001/register', {
        username: username_zjp,
        password: password_zjp,
        address: account_zjp,        
      });
      console.log("后端响应:", response.data);
      message.success("注册成功!");

      window.location.href = "/login";
      
    } catch (error) {
      console.error("注册失败:", error);
      message.error("注册失败!");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundImage: `url(${backgroundImage})` }}>
      <Row justify="center" align="middle">
        <Col style={{ width: '500px' }}> {/* 将宽度调整为500px */}
          <Card
            bordered={false}
            style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px'}}
          >
            <Form
              form={form_zjp}
              layout="vertical"
              onFinish={handleRegister_zjp}
            >
              <Form.Item
                label="用户名"
                name="username_zjp"
                rules={[{ required: true, message: '请输入您的用户名!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="性别"
                name="gender_zjp"
                rules={[{ required: true, message: '请选择您的性别!' }]}
              >
                <Select>
                  <Option value="male">男</Option>
                  <Option value="female">女</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="联系方式"
                name="contact_zjp"
                rules={[{ required: true, message: '请输入您的联系方式!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="密码"
                name="password_zjp"
                rules={[{ required: true, message: '请输入您的密码!' }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="角色"
                name="roleId"
                rules={[{ required: true, message: '请选择您的角色!' }]}
              >
                <Select value={roleId} onChange={setroleId}>
                  <Option value="1">买家</Option>
                  <Option value="2">卖家</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>注册</Button>
              </Form.Item>
              <Form.Item>
                <Link to="/login">已经有账号？去登录</Link>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
