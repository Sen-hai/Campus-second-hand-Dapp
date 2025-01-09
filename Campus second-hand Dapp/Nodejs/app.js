const express = require('express');
const bodyParser = require('body-parser');
const registerRouter = require('./routers/register');
const savetraceabilityInfo = require('./routers/productTraceabilityInfo');
const getTraceabilityInfo = require('./routers/getTraceabilityInfo');
const reportRouter = require('./routers/report');
const getReports = require('./routers/getReports');
const addReviews = require('./routers/reviews');
const getReviews = require('./routers/getReviews');
const cors = require('cors');  // 引入 cors

const app = express();
const port = 3001;

// 配置 CORS
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));  // 使用 cors 并设置选项

app.use(bodyParser.json());

// 使用注册路由
app.use('/', registerRouter);
app.use('/', savetraceabilityInfo);
app.use('/', getTraceabilityInfo);
app.use('/', reportRouter);
app.use('/', getReports);
app.use('/', addReviews);
app.use('/', getReviews);

app.listen(port, () => {
  console.log(`服务器正在运行在 http://localhost:${port}`);
});
