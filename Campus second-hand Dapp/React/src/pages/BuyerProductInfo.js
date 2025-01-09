import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, message, Row, Col, Modal, InputNumber, Space, Divider, Steps, Input, List } from 'antd';
import { web3, campusMarketContract } from '../contract/campusMarket';
import './css/buyerProductInfo.css';

export default function BuyerProductInfo() {
    const [loading_ZJP, setLoading_ZJP] = useState(false);
    const [product_ZJP, setProduct_ZJP] = useState(null);
    const [quantity_ZJP, setQuantity_ZJP] = useState(1);
    const [isModalVisible_ZJP, setIsModalVisible_ZJP] = useState(false);
    const { id } = useParams();
    const [account_ZJP, setAccount_ZJP] = useState('');
    const [items_ZJP, setItems_ZJP] = useState([]);
    const [nonce_ZJP, setNonce_ZJP] = useState(0);
    const [current_ZJP, setCurrent_ZJP] = useState(0);
    const [reportVisible_ZJP, setReportVisible_ZJP] = useState(false);
    const [reportContent_ZJP, setReportContent_ZJP] = useState('');
    const [traceabilityVisible_ZJP, setTraceabilityVisible_ZJP] = useState(false);
    const [reviews_ZJP, setReviews_ZJP] = useState([]);

    useEffect(() => {
        async function fetchData_ZJP() {
            try {
                await fetchProduct_ZJP();
                await fetchReviews_ZJP();
                setLoading_ZJP(false);
            } catch (error) {
                console.error("数据加载失败:", error);
                message.error("数据加载失败");
                setLoading_ZJP(false);
            }
        }
        fetchData_ZJP();
    }, [id]);

    const fetchProduct_ZJP = async () => {
        try {
            const product = await campusMarketContract.methods.getProduct(id - 1).call();
            const fetchedProduct_ZJP = {
                name: product.name,
                description: product.description,
                price: parseInt(product.price),
                quantity: parseInt(product.quantity),
                image: product.image,
                timestamp: parseInt(product.timestamp),
                seller: product.seller,
                active: product.active,
                category: product.category,
            };

            setProduct_ZJP(fetchedProduct_ZJP);
            console.log("商品信息:", fetchedProduct_ZJP);

            const accounts = await web3.eth.getAccounts();
            setAccount_ZJP(accounts[0]);
            message.success("商品信息获取成功");
        } catch (error) {
            console.error("获取商品信息时出错:", error);
            message.error("获取商品信息时出错");
            throw error; // 可以选择向上层抛出错误以进行更高级别的处理
        }
    };

    const handleBuyProduct_ZJP = async () => {
        setLoading_ZJP(true);
        try {
            await campusMarketContract.methods.buyProduct(id - 1, quantity_ZJP).send({ from: account_ZJP });
            message.success("购买成功");
        } catch (error) {
            console.error("购买失败:", error);
            message.error("购买失败");
        }
        setLoading_ZJP(false);
        setIsModalVisible_ZJP(false);
    };

    const showBuyModal_ZJP = () => {
        setIsModalVisible_ZJP(true);
    };

    const handleCancel_ZJP = () => {
        setIsModalVisible_ZJP(false);
    };

    const handleReport_ZJP = async () => {
        setReportVisible_ZJP(true);
    };

    const handleReportSubmit_ZJP = async () => {
        try {
            const response = await fetch('http://localhost:3001/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: id,
                    reporter: account_ZJP,
                    reportReason: reportContent_ZJP,
                    reportTime: new Date().toISOString(),
                }),
            });
            if (response.ok) {
                message.success('举报成功');
            } else {
                message.error('举报失败');
            }
        } catch (error) {
            console.error('举报失败:', error);
            message.error('举报失败');
        }
        setReportVisible_ZJP(false);
        setReportContent_ZJP('');
    };

    const handleFavorite_ZJP = async () => {
        setLoading_ZJP(true);
        try {
            await campusMarketContract.methods.addFavoriteProduct(id).send({ from: account_ZJP });
            message.success('收藏成功');
        } catch (error) {
            console.error('收藏失败:', error);
            message.error('收藏失败');
        }
        setLoading_ZJP(false);
    };

    const showTraceability_ZJP = async () => {
        try {
            const response = await fetch(`http://localhost:3001/getTraceabilityInfo/${id - 1}`);
            const data = await response.json();
            console.log("追溯信息:", data);

            const dataItems_ZJP = data.map((item, index) => ({
                title: `该笔交易nonce: ${item.nonce}`,
                description: (
                    <>
                        商品录入账号：{item.fromaccount}<br />
                        该笔交易Hash: {item.transactionHash}<br />
                        当前交易处理类型：{item.actionType}<br />
                        当前交易处理时间：{new Date(item.created_at).toLocaleString()}
                    </>
                )
            }));

            setItems_ZJP(dataItems_ZJP);
            setNonce_ZJP(data.length);
            setTraceabilityVisible_ZJP(true);
        } catch (error) {
            console.error("获取追溯信息时出错:", error);
            message.error("获取追溯信息时出错");
        }
    };

    const fetchReviews_ZJP = async () => {
        try {
            const response = await fetch(`http://localhost:3001/getReviews/${id}`);
            const data = await response.json();
            setReviews_ZJP(data);
            console.log("评论信息:", data);
        } catch (error) {
            console.error("获取评论信息时出错:", error);
            message.error("获取评论信息时出错");
        }
    };

    const onChange_ZJP = (current_ZJP) => {
        setCurrent_ZJP(current_ZJP);
    };

    if (!product_ZJP) {
        return <div>加载中...</div>;
    }

    return (
        <div className="good-info-container">
            <h1 className="page-title">商品详情</h1>
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <div className="info-section">
                        <img alt="example" style={{ width: '80%', height: '80%' }} src={"https://gateway.pinata.cloud/ipfs/" + product_ZJP.image} />
                    </div>
                </Col>
                <Col span={12}>
                    {product_ZJP && (
                        <div className="info-section">
                            <p>商品名称：{product_ZJP.name}</p>
                            <p>商品在售状态：{product_ZJP.active ? '在售' : '已下架'}</p>
                            <p>价格: {product_ZJP.price} EJK</p>
                            <p>描述: {product_ZJP.description}</p>
                            <p>发布时间：{new Date(product_ZJP.timestamp * 1000).toLocaleString()}</p>
                            <p>类别: {product_ZJP.category}</p>
                            <p>库存: {product_ZJP.quantity}</p>
                        </div>
                    )}
                </Col>
            </Row>

            <Button type="primary" onClick={showBuyModal_ZJP} loading={loading_ZJP} style={{ marginLeft: '280px' }}>
                确认购买
            </Button>
            <Button type="primary" onClick={handleFavorite_ZJP} loading={loading_ZJP} style={{ marginLeft: '20px' }}>
                收藏
            </Button>
            <Button type="primary" onClick={handleReport_ZJP} loading={loading_ZJP} style={{ marginLeft: '20px' }}>
                举报
            </Button>
            <Button type="primary" onClick={showTraceability_ZJP} loading={loading_ZJP} style={{ marginLeft: '20px' }}>
                显示追溯信息
            </Button>

            <Modal
                style={{ top: 250 }}
                title="请选择购买数量"
                open={isModalVisible_ZJP}
                onOk={handleBuyProduct_ZJP}
                onCancel={handleCancel_ZJP}
                okText="购买"
                cancelText="取消"
            >
                <InputNumber min={1} max={product_ZJP.quantity} value={quantity_ZJP} onChange={setQuantity_ZJP} />
            </Modal>

            <Modal
                style={{ top: 250 }}
                title="请输入举报内容"
                open={reportVisible_ZJP}
                onOk={handleReportSubmit_ZJP}
                onCancel={() => setReportVisible_ZJP(false)}
                okText="提交"
                cancelText="取消"
            >
                <Input.TextArea
                    value={reportContent_ZJP}
                    onChange={(e) => setReportContent_ZJP(e.target.value)}
                    rows={4}
                    placeholder="请输入举报内容"
                />
            </Modal>

            <Divider />

            {traceabilityVisible_ZJP && (
                <Space direction="vertical" size="middle" style={{ marginTop: '10px' }}>
                    <div>
                        <Button type="primary">
                            当前总交易笔数：{nonce_ZJP}
                        </Button>
                    </div>
                </Space>
            )}

            {traceabilityVisible_ZJP && (
                <Steps
                    current={current_ZJP}
                    onChange={onChange_ZJP}
                    direction="vertical"
                    items={items_ZJP}
                />
            )}

            {/* 显示评论信息 */}
            <Divider>商品评论</Divider>
            <List
                itemLayout="vertical"
                size="large"
                dataSource={reviews_ZJP}
                renderItem={item => (
                    <List.Item
                        style={{
                            border: '1px solid #e8e8e8',
                            borderRadius: '5px',
                            marginBottom: '10px',
                            padding: '16px',
                            backgroundColor: '#E3EEEC',
                        }}
                    >
                        <div style={{ marginBottom: '10px' }}>
                            <strong>评论用户：</strong>{item.username}
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <strong>评论内容：</strong>{item.comment}
                        </div>
                        <div>
                            <strong>评论时间：</strong>{new Date(item.reviewsTime).toLocaleString()}
                        </div>
                    </List.Item>
                )}
            />

        </div>
    );
}
