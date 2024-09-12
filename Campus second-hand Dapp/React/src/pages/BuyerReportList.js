import React, { useState, useEffect } from 'react';
import { List, Spin, Row, Col } from 'antd';
import { campusMarketContract } from '../contract/campusMarket';

const BuyerReportList = () => {
  const [data_ZJP, setData_ZJP] = useState([]);
  const [loading_ZJP, setLoading_ZJP] = useState(true);

  const getData_ZJP = async () => {
    try {
      const response_ZJP = await fetch('http://localhost:3001/getReports');
      const reports_ZJP = await response_ZJP.json();
      
      // 获取所有商品数据的Promise数组
      const productPromises_ZJP = reports_ZJP.map(async (report_ZJP) => {
        const product_ZJP = await campusMarketContract.methods.getProduct(report_ZJP.productId - 1).call();
        return {
          ...report_ZJP,
          productName_ZJP: product_ZJP.name,
          productImage_ZJP: `https://gateway.pinata.cloud/ipfs/${product_ZJP.image}`,
        };
      });

      // 等待所有商品数据获取完成
      const combinedData_ZJP = await Promise.all(productPromises_ZJP);

      setData_ZJP(combinedData_ZJP); // 更新组件状态
      setLoading_ZJP(false); // 停止加载状态
      console.log("reportsdata:", combinedData_ZJP);
    } catch (error_ZJP) {
      console.error('Failed to fetch reports data:', error_ZJP);
      setLoading_ZJP(false); // 停止加载状态，即使发生错误
    }
  };

  // 在组件加载时获取数据
  useEffect(() => {
    getData_ZJP();
  }, []); // 空数组表示仅在组件加载时运行一次

  if (loading_ZJP) {
    return <Spin size="large" />;
  }

  return (
    <List
      itemLayout="vertical"
      size="large"
      dataSource={data_ZJP}
      renderItem={(item_ZJP) => (
        <List.Item key={item_ZJP.id}>
          <Row gutter={16}>
            <Col span={5}>
              <div style={{ width: '100%', height: '200px', overflow: 'hidden', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  alt="Product"
                  src={item_ZJP.productImage_ZJP}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>
            </Col>
            <Col span={16}>
              <List.Item.Meta
                title={`商品名称: ${item_ZJP.productName_ZJP}`}
                description={new Date(item_ZJP.reportTime).toLocaleString()}
              />
              举报原因: {item_ZJP.reportReason}
            </Col>
          </Row>
        </List.Item>
      )}
    />
  );
};

export default BuyerReportList;
