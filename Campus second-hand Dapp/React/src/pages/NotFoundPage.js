import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom'; 

const NotFoundPage = () => {
  return (
    <div style={{ marginTop: '50px', textAlign: 'center' }}>
      <Result
        status="404"
        title="404"
        subTitle="抱歉，您访问的页面不存在。"
        extra={<Button type="primary"><Link to="/api">返回首页</Link></Button>}
      />
    </div>
  );
};

export default NotFoundPage;