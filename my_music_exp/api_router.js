
'use strict'
const express = require('express');
const userController = require('./controllers/userController');
const musicController = require('./controllers/musicController');

// 4:处理请求
//配置路由规则 开始
let router = express.Router();
router.get('/test',userController.doTest)
.post('/api/check-user',userController.checkUser)

// ==============================================================================================

// 用户注册
.post('/api/do-register',userController.doRegister)
// 3响应数据
// 验证登录信息
.post('/api/do-login',userController.checkUser)

// 添加音乐
.post('./api/add-music',musicController.add_music)

// 更新音乐
.put('/update-music',musicController.update_music)

//配置路由规则 结束