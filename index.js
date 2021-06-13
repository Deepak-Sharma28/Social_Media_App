const cors = require('cors');
const express = require('express');
const ConnectDb = require('./Config/db');
require('dotenv').config();

const app = express();
const router = require('./routers');
const port = process.env.Port || 3000;

ConnectDb();
app.use(express.json());
app.use(cors());
app.use('/', router);
app.listen(port, () => console.log(`server is runnnig on ${port}`));