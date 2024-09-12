import { Outlet, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme, Button, message } from 'antd';
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
    getItem('商品信息', 'sub1', [
        getItem('商品信息浏览', '/apib/buyerProjectList')
    ]),
    getItem('我的订单', 'sub2', [
        getItem('我的收藏', '/apib/buyerCollectionList'),
        getItem('我的举报', '/apib/buyerReportList'),
        getItem('交易历史', '/apib/buyerHistoryList')
    ]),
];

const BuyerHome = () => {
    const {
        token: { borderRadiusLG },
    } = theme.useToken();
    const navigate = useNavigate();

    const [account, setAccount] = useState("");
    const [ethBalance, setEthBalance] = useState('');
    const [tokenBalance, setTokenBalance] = useState(''); // 初始化为空字符串

    useEffect(() => {
        const fetchData = async () => {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const accounts = await web3.eth.getAccounts();
                const userAccount = accounts[0];
                setAccount(userAccount);

                const ethBalance = await web3.eth.getBalance(userAccount);
                const ethBalanceInEth = web3.utils.fromWei(ethBalance, 'ether');
                setEthBalance(ethBalanceInEth); // 将ETH余额转换为以太坊
                console.log("ethBalance:", ethBalanceInEth);

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

    // 兑换代币
    const exchangeToken = async () => {
        try {
            const weiAmount = web3.utils.toWei('1', 'ether');
            await campusMarketContract.methods.swapTokensForEth()
                .send({ from: account, value: weiAmount, gas: 300000 });
            message.success("代币兑换成功");

            const updatedEthBalance = await web3.eth.getBalance(account);
            const updatedEthBalanceInEth = web3.utils.fromWei(updatedEthBalance, 'ether');
            setEthBalance(updatedEthBalanceInEth); // 更新ETH余额

            const updatedTokenBalance = await campusMarketContract.methods.balanceOf(account).call();
            const updatedTokenBalanceStr = updatedTokenBalance.toString();
            setTokenBalance(updatedTokenBalanceStr); // 更新代币余额

        } catch (error) {
            console.error("代币兑换失败: " + error);
            message.error("代币兑换失败");
        }
    }

    console.log("tokenBalance : " + tokenBalance)
    return (
        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#3CC2A5' }}>
                <h1 style={{ color: 'white' }}>校园二手交易平台</h1>
                <h5 style={{ color: 'white' }}>用户姓名：{localStorage.getItem('username_zjp')}</h5>
                <h5 style={{ color: 'white' }}>登录账号：{account}</h5>

                <Button
                    style={{ marginTop: '5px' }}
                    type="primary"
                    onClick={exchangeToken}
                >
                    兑换代币
                </Button>
                <h5 style={{ color: 'white' }}>代币余额: {tokenBalance !== '' ? tokenBalance : '加载中...'}EJK</h5>
                <h5 style={{ color: 'white' }}>ETH余额: {ethBalance !== '' ? Number(ethBalance).toFixed(2) : '加载中...'} ETH</h5>

                {/* 登出 */}
                <Button
                    style={{ marginTop: '5px' }}
                    type="primary"
                    onClick={() => {
                        navigate('/login');
                    }}>
                    退出登录
                </Button>
            </Header>
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
                                navigate(e.key, { replace: true });
                            }}
                        >
                        </Menu>
                    </Sider>
                    <Content
                        style={{
                            padding: '0 24px',
                            minHeight: 280,
                        }}
                    >
                        <Outlet />
                    </Content>
                </Layout>
            </Content>
        </Layout>
    );
};

export default BuyerHome;
