import React, { useState } from 'react';
import { Form, Input, Select, Button, message, Card, Row, Col } from 'antd';
import { web3, campusMarketContract } from '../contract/campusMarket';
import { useNavigate, Link } from 'react-router-dom';
import backgroundImage from '../pages/images/云2.jpg'; // 导入背景图片

const { Option } = Select;
const Login = () => {
  const [loading_zjp, setLoading_zjp] = useState(false);
  const [roleId, setroleId] = useState('1');
  const navigate = useNavigate(); // 获取导航对象
  const handleLogin_zjp = async (values_zjp) => {
    const { username_zjp, password_zjp } = values_zjp;

    setLoading_zjp(true);

    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const accounts_zjp = await web3.eth.getAccounts();
    const account_zjp = accounts_zjp[0];
    var result_zjp = false;
    try {
      result_zjp = await campusMarketContract.methods.login(username_zjp, password_zjp).call({ from: account_zjp });

      if (result_zjp) {
        window.localStorage.setItem('account_zjp', account_zjp);
        window.localStorage.setItem('username_zjp', username_zjp);
        window.localStorage.setItem('roleId', roleId);
        console.log("roleId", roleId);
        if (roleId === '1') {
          if (result_zjp) {
            message.success("登录成功!");
            navigate("/apib"); 
          }
        } else if (roleId === '2') {
          message.success("登录成功!");
          navigate("/apis");
        }
      }
    } catch (error_zjp) {
      message.error('登录失败，请检查您的用户名和密码！');
    } finally {
      setLoading_zjp(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundImage: `url(${backgroundImage})` }}>
      <Row justify="center" align="middle">
        <Col style={{ width: '400px' }}>
          <Card
            bordered={false}
            style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}
          >
            <Form
              layout="vertical"
              onFinish={handleLogin_zjp}
              onFinishFailed={(errorInfo_zjp) => {
                message.error('请正确填写表格！');
              }}
            >
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
              <Form.Item
                label="用户名"
                name="username_zjp"
                rules={[{ required: true, message: '请输入您的用户名!' }]}
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
              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading_zjp}>登录</Button>
              </Form.Item>
              <Form.Item>
                <Link to="/">没有账号？去注册</Link>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
