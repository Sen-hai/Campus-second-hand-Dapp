import React, { useState, useEffect } from 'react';
import { web3, campusMarketContract } from '../contract/campusMarket';
import { Card, Button, message, Spin, Row, Col } from 'antd';
const { Meta } = Card;

const GetBuyerCollectionList = () => {
    const [loading_ZJP, setLoading_ZJP] = useState(true);
    const [products_ZJP, setProducts_ZJP] = useState([]);
    useEffect(() => {
        const fetchData_ZJP = async () => {
            try {
                setLoading_ZJP(true); // 开始加载数据，显示加载中
    
                // 请求用户账户信息
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const accounts_ZJP = await web3.eth.getAccounts();
                const account_ZJP = accounts_ZJP[0];
    
                // 获取收藏列表
                const collectionId_ZJP = await campusMarketContract.methods.viewFavoriteProducts().call({ from: account_ZJP });
                console.log('收藏列表:', collectionId_ZJP);
    
                // 确保 collectionId_ZJP 是数组
                const collectionIds_ZJP = Array.isArray(collectionId_ZJP) ? collectionId_ZJP : [collectionId_ZJP];
                console.log('收藏列表长度:', collectionIds_ZJP.length);
    
                // 根据收藏列表获取商品信息
                let productList_ZJP = [];
                for (let i = 0; i < collectionIds_ZJP.length; i++) {
                    const productId_ZJP = Number(collectionIds_ZJP[i]);
                    console.log('商品ID:', productId_ZJP);
                    try {
                        const product_ZJP = await campusMarketContract.methods.getProduct(productId_ZJP - 1).call();
    
                        productList_ZJP.push({
                            productId: productId_ZJP,
                            name: product_ZJP.name,
                            description: product_ZJP.description,
                            price: parseInt(product_ZJP.price),
                            quantity: parseInt(product_ZJP.quantity),
                            image: product_ZJP.image,
                            timestamp: parseInt(product_ZJP.timestamp),
                            seller: product_ZJP.seller,
                            category: product_ZJP.category,
                        });
                    } catch (error) {
                        console.error(`获取商品ID为 ${productId_ZJP} 的商品信息时出错:`, error);
                    }
                }
                setProducts_ZJP(productList_ZJP);
    
                setLoading_ZJP(false); // 数据加载完成，关闭加载中状态
            } catch (error) {
                console.error('获取收藏列表时出错:', error);
                setLoading_ZJP(false); // 发生错误，关闭加载中状态
                message.error('获取收藏列表时出错'); // 显示错误消息
            }
        };
    
        fetchData_ZJP();
    }, []); // 这里没有依赖项，只在组件挂载时执行一次
    


    if (loading_ZJP) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }
  
    return (
        <div style={{ padding: '20px' }}>
            <Row gutter={[16, 16]} justify="left">
                {products_ZJP.map((product_ZJP, index_ZJP) => (
                    <Col key={index_ZJP} xs={24} sm={12} md={8} lg={6}>
                        <Card
                            hoverable
                            style={{ width: 300, borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }} // 设置卡片的宽度、圆角和阴影
                            cover={
                                <img
                                    alt="example"
                                    style={{ width: '100%', height: '300px', objectFit: 'cover', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
                                    src={`https://gateway.pinata.cloud/ipfs/${product_ZJP.image}`}
                                />
                            }
                            actions={[
                                <Button type="primary">查看详情</Button>,
                                <Button type="danger" >取消收藏</Button>,
                            ]}
                        >
                            <Meta title={`商品名称：${product_ZJP.name}`} description={`商品价格：${product_ZJP.price} EJK`} />
                            <div style={{ marginTop: '10px' }}>
                                <p>库存: {product_ZJP.quantity}</p>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default GetBuyerCollectionList;
