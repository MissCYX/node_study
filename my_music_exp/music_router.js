
'use strict'
const express = require('express');
const userController = require('./controllers/musicController');

// 4:处理请求
//配置路由规则 开始
let router = express.Router();
// 登录页
router.get('/login',userController.doTest)



//配置路由规则 结束