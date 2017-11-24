
'use strict'
const express = require('express');
const userController = require('./controllers/userController');

// 4:处理请求
//配置路由规则 开始
let router = express.Router();
// 登录页
router.get('/login',userController.doTest)
// 注册页
.post('/register',userController.checkUser)


//配置路由规则 结束