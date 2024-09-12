import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { Button, message, Form, Input, InputNumber, Upload } from 'antd';
import axios from 'axios';
import { web3, campusMarketContract } from '../contract/campusMarket';

const { TextArea } = Input;
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhMTk5YjZjZi0yN2NkLTQ4ZTktYTVmYS05MGJkYTFkMTExNGUiLCJlbWFpbCI6IjEwMTUzMjM0NzlAcXEuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjY5NWE1NzExODFiZmNkODQ2N2EwIiwic2NvcGVkS2V5U2VjcmV0IjoiOTMxYjNmMGMxNWFiMDExNzc5MjhiNjY0NTFiZDQ2YmVkMTYyNDg2YzEwMzgyZDYzYjlmZjQ1Y2RhYWVmNzVmNSIsImlhdCI6MTcxODAzMTk0N30.7TkZWCKMka4j2s48m5ZM1Y6Tu-F-thPrUjHuvMuNvJY";  // 请确保这是有效的JWT  

const SellerProjectAdd = () => {
  const navigate = useNavigate();
  const [ipfs, setIpfs] = useState("");

  const handleUpload = async (options) => {
    const { onSuccess, onError, file } = options;
    const formData = new FormData();
    formData.append("file", file);

    const pinataMetadata = JSON.stringify({
      name: file.name, // 使用文件原始名称或自定义名称  
    });
    formData.append("pinataMetadata", pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 1,
    });
    formData.append("pinataOptions", pinataOptions);

    try {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${JWT}`,
          },
        }
      );

      const ipfsHash = response.data.IpfsHash; 
      onSuccess(ipfsHash);
      setIpfs(ipfsHash);
    } catch (error) {
      onError(error);
    }
  };

  const customRequest = async (options) => {
    handleUpload(options);
  };

  const onFinish = async (values) => {
    console.log(values);
    console.log(ipfs);

    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const accounts_zjp = await web3.eth.getAccounts();
    const account_zjp = accounts_zjp[0];
    console.log("添加商品账户：" + account_zjp);

    console.log("商品价格1: " + values.price);
    try {
      await campusMarketContract.methods.addProduct(
        values.productName,
        values.dec,
        values.price,
        values.number,
        ipfs,
        values.category
      ).send({ from: account_zjp })
        .on('receipt', async function (receipt) {
          console.log("receipt.status:" + receipt.status);
          if (receipt.status == 1) {
            const productId = receipt.events.ProductAdded.returnValues.productId;
            console.log("productId:" + productId);
            const transactionHash = receipt.transactionHash;
            console.log("transactionHash:" + transactionHash);
            const blockNumber = receipt.blockNumber;
            console.log("blockNumber:" + blockNumber);
            const toAccount = receipt.to;
            console.log("toAccount:" + toAccount);

            // 获取交易详细信息
            const tx = await web3.eth.getTransaction(transactionHash);
            console.log("tx:" + tx);
            const nonce = parseInt(tx.nonce);
            console.log("nonce:" + nonce);
            const actionType = "添加商品";
            console.log("actionType:" + actionType);

            const data = {
              productId: Number(productId),
              transactionHash: transactionHash,
              blocknumber: Number(blockNumber),
              fromaccount: account_zjp,
              toaccount: toAccount,
              nonce: Number(nonce),  
              actionType: actionType,
            };

            console.log("data前:" + data);
            const response = await axios.post(
              "http://localhost:3001/savetraceabilityInfo",
              data,
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );
            if (response.status === 200) {
              message.success("商品已成功发布！");
              navigate('/apis/sellerProjectList'); // 发布成功后跳转到商品列表页面
            } else {
              message.error("发布商品失败，请重试。");
            }
          }
        });
    } catch (error) {
      console.error("发布商品失败:", error);
      message.error("发布商品失败，请重试。");
    }
  };

  return (
    <>
      <Form
        style={{ maxWidth: 600, margin: '10', padding: '20px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}
        onFinish={onFinish}
      >
        <Form.Item
          label="商品名称"
          name="productName"
          style={{ marginBottom: '15px' }}
          rules={[{ required: true, message: '请输入商品名称!' }]}
        >
          <Input style={{ width: '100%' }} />
        </Form.Item>
  
        <Form.Item
          label="商品价格"
          name="price"
          style={{ marginBottom: '15px' }}
          rules={[{ required: true, message: '请输入商品价格!' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
  
        <Form.Item
          label="商品数量"
          name="number"
          style={{ marginBottom: '15px' }}
          rules={[{ required: true, message: '请输入商品数量!' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
  
        <Form.Item
          label="商品描述"
          name="dec"
          style={{ marginBottom: '15px' }}
          rules={[{ required: true, message: '请输入商品描述!' }]}
        >
          <TextArea rows={2} style={{ width: '100%' }} />
        </Form.Item>
  
        <Form.Item
          label="商品类型"
          name="category"
          style={{ marginBottom: '15px' }}
          rules={[{ required: true, message: '请输入商品类型!' }]}
        >
          <TextArea rows={1} style={{ width: '100%' }} />
        </Form.Item>
  
        <Form.Item
          label="上传商品图片"
          name="hashImage"
          style={{ marginBottom: '15px' }}
          rules={[{ required: true, message: '请上传商品图片!' }]}
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            customRequest={customRequest}
            listType="picture-card"
            style={{ width: '100%' }}
          >
            <button
              type="button"
              style={{
                border: '1px dashed #d9d9d9',
                width: '100%',
                height: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                cursor: 'pointer',
              }}
            >
              <PlusOutlined style={{ color: '#1890ff' }} />
              <div style={{ marginTop: 8, color: 'rgba(0,0,0,.45)' }}>上传</div>
            </button>
          </Upload>
        </Form.Item>
  
        <Form.Item style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: '100px', height: '32px', margin: '20px 0' }}
          >
            提交商品
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default SellerProjectAdd;
