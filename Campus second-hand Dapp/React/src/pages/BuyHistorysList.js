import React, { useState, useEffect } from 'react';
import { Table, message, Button, Modal, Input } from 'antd';
import { web3, campusMarketContract } from '../contract/campusMarket';

const BuyerHistory_ZJP = () => {
    const [transactions_ZJP, setTransactions_ZJP] = useState([]);
    const [loading_ZJP, setLoading_ZJP] = useState(true);
    const [reviewModalVisible_ZJP, setReviewModalVisible_ZJP] = useState(false);
    const [selectedTransactionIndex_ZJP, setSelectedTransactionIndex_ZJP] = useState(null);
    const [reviewComment_ZJP, setReviewComment_ZJP] = useState('');

    const fetchTransactionHistory_ZJP = async () => {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts_ZJP = await web3.eth.getAccounts();
        const account_ZJP = accounts_ZJP[0];

        try {
            console.log("正在获取交易历史...");
            const historyList_ZJP = await campusMarketContract.methods.getUserTransactionHistory().call({ from: account_ZJP });
            console.log("已获取交易历史: ", historyList_ZJP);
            const formattedHistoryList_ZJP = historyList_ZJP.map((tx, index) => ({
                key: index,
                buyer: tx[0],
                seller: tx[1],
                productId: parseInt(tx[2]) + 1,
                productName: tx[3],
                amount: parseInt(tx[4]),
                reviewed: tx[5],
            }));
            setTransactions_ZJP(formattedHistoryList_ZJP);
            message.success("交易历史获取成功！");
        } catch (error) {
            console.error("获取交易历史时出错:", error);
            message.error("获取交易历史时出错: " + error.message);
        } finally {
            setLoading_ZJP(false);
        }
    };

    useEffect(() => {
        fetchTransactionHistory_ZJP();
    }, []);

    const handleAddReview_ZJP = async () => {
        if (reviewComment_ZJP.trim() === '') {
            message.error('评论内容不能为空');
            return;
        }

        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts_ZJP = await web3.eth.getAccounts();
        const account_ZJP = accounts_ZJP[0];

        try {
            const response_ZJP = await fetch('http://localhost:3001/addReviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userAddress: account_ZJP,
                    productId: transactions_ZJP[selectedTransactionIndex_ZJP].productId,
                    comment: reviewComment_ZJP,
                }),
            });
            if (!response_ZJP.ok) {
                throw new Error('提交评价到后端失败');
            }
        } catch (error) {
            console.error("提交评价时出错:", error);
            message.error("提交评价时出错: " + error.message);
        }

        try {
            await campusMarketContract.methods.addReview(selectedTransactionIndex_ZJP, reviewComment_ZJP).send({ from: account_ZJP });
            message.success('评价提交成功');
            setReviewModalVisible_ZJP(false);
            setReviewComment_ZJP('');
            fetchTransactionHistory_ZJP();
        } catch (error) {
            console.error("提交评价时出错:", error);
            message.error("提交评价时出错: " + error.message);
        }
    };

    const columns_ZJP = [
        {
            title: '买家地址',
            dataIndex: 'buyer',
            key: 'buyer',
        },
        {
            title: '卖家地址',
            dataIndex: 'seller',
            key: 'seller',
        },
        {
            title: '商品ID',
            dataIndex: 'productId',
            key: 'productId',
        },
        {
            title: '商品名称',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: '交易金额',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: '是否已评价',
            dataIndex: 'reviewed',
            key: 'reviewed',
            render: (reviewed, record) => reviewed ? '是' : (
                <Button style={{ marginTop: '5px' }} type="primary" onClick={() => {
                    setSelectedTransactionIndex_ZJP(record.key);
                    setReviewModalVisible_ZJP(true);
                }}>
                    评价
                </Button>
            ),
        },
    ];

    return (
        <div>
            <Table
                dataSource={transactions_ZJP}
                columns={columns_ZJP}
                loading={loading_ZJP}
            />
            <Modal
                style={{ top: 250 }}
                title="提交评价"
                open={reviewModalVisible_ZJP}
                onOk={handleAddReview_ZJP}
                onCancel={() => setReviewModalVisible_ZJP(false)}
                okText="确认"
                cancelText="取消"
            >
                <Input.TextArea
                    value={reviewComment_ZJP}
                    onChange={(e) => setReviewComment_ZJP(e.target.value)}
                    placeholder="请输入评价内容"
                />
            </Modal>
        </div>
    );
};

export default BuyerHistory_ZJP;
