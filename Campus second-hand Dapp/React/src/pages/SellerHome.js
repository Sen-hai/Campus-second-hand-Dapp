import { Outlet, useNavigate } from "react-router-dom";

import React, { useState, useEffect } from 'react';

import { Layout, Menu, theme, Button } from 'antd';

import { web3, campusMarketContract } from '../contract/campusMarket';





const { Header, Content, Sider } = Layout;

function getItem(label, key, children, type) {
    return {
        key,
        children,
        label,
        type,
    };
}
const items2 = [
    getItem('我的商品', 'sub1', [
        getItem('商品信息浏览', '/apis/SellerProjectList')
    ]),
    getItem('商品管理', 'sub2', [
        getItem('添加商品', '/apis/sellerProjectAdd'),
    ]),

];


const BuyerHome = () => {
    const {
        token: { borderRadiusLG },
    } = theme.useToken();
    const navigate = useNavigate();

    const [account, setAccount] = useState("");
    const [tokenBalance, setTokenBalance] = useState('');
    const [ethBalance, setEthBalance] = useState('');


    useEffect(() => {

        const fetchData = async () => {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const accounts = await web3.eth.getAccounts();
                const userAccount = accounts[0];
                setAccount(userAccount);


                const ethBalance = await web3.eth.getBalance(userAccount);
                console.log("ethBalance" + ethBalance);
                setEthBalance(web3.utils.fromWei(ethBalance, 'ether')); // 将ETH余额转换为以太坊

                const tokenBalance = await campusMarketContract.methods.balanceOf(userAccount).call();
                const tokenBalanceStr = tokenBalance.toString(); // 转换为字符串
                setTokenBalance(tokenBalanceStr); // 设置代币余额
                console.log("tokenBalance:", tokenBalance);

            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, []);


    return (

        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#3CC2A5' }}>
                <h1 style={{ color: 'white' }}>校园二手交易平台</h1>
                <h5 style={{ color: 'white' }}>用户姓名：{localStorage.getItem('username_zjp')}</h5>
                <h5 style={{ color: 'white' }}>登录账号：{account}</h5>


                <h5 style={{ color: 'white' }}>代币余额: {tokenBalance} EJK</h5>
                <h5 style={{ color: 'white' }}>ETH余额: {Number(ethBalance).toFixed(2)} ETH</h5>

                {/* 登出 */}
                <Button
                    type="primary"
                    style={{ marginTop: '5px' }}
                    onClick={() => {
                        navigate('/login');
                    }}>
                    退出登录
                </Button>

            </Header>
            {/* 第一层 */}
            <Content
                style={{
                    padding: '0 4px',
                    background: '#E3EEEC',
                    height: '100vh',
                }}
            >

                <Layout
                    style={{
                        padding: '24px 0',
                        background: '#E3EEEC',
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Sider
                        style={{
                            background: '#E3EEEC',
                        }}
                        width={200}
                    >
                        <Menu
                            mode="inline"

                            style={{
                                height: '100%',
                                background: '#E3EEEC',
                            }}
                            items={items2}
                            onClick={(e) => {
                                navigate(e.key, { replace: true })
                            }}
                        >

                        </Menu>
                    </Sider>
                    {/* 第二层 */}
                    <Content
                        style={{
                            padding: '0 24px',
                            minHeight: 280,
                        }}
                    >

                        <Outlet></Outlet>
                    </Content>
                </Layout>
            </Content >
        </Layout >
    );
};




export default BuyerHome;