// 目标:通过该案例让所有人都不蒙
'use strict';
// 服务器基本4件套
// 1:引入对象
const express = require('express');
const bodyParser = require('body-parser');
let heros = [
    {   id:1,name:'李白'},
    {   id:2,name:'娜可露露'},
    {   id:3,name:'貂蝉'},
];


const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'itcast'
});

//2:创建服务器
let app = express();
//3:监听端口开启服务器
app.listen(8888,()=>{
    console.log('服务器启动了');
});


//配置模板引擎
app.engine('html',require('express-art-template'));


//创建路由对象
let router = express.Router();
router.get('/',(req,res)=>{
    res.json({
        name:'home'
    })
})
.get('/list',(req,res)=>{
    //获取查询字符串参数
    let dir = req.query.dir;
    res.json({
        name:'list',
        query:dir
    });
})
.post('/add',(req,res)=>{
    //post请求体数据
    let type = req.body.type;
    res.json({
        name:'add',
        body:type
    })
})
.get('/heros',(req,res)=>{
    //返回英雄列表
    res.render('index.html',{
        myHeros:heros
    });
})//  /showHero/{{$value.id}}
.get('/showHero/:heroid',(req,res)=>{
    //获取英雄id
    let id = req.params.heroid;
    // res.json({
    //     name:`你点的是${id}`
    // })
    //向数据库查询数据，并显示json
      pool.getConnection(function(err, connection) {
        connection.query('SELECT * FROM articles where id=?',[id], function(error, results, fields) {
            //查询完毕以后，释放连接
            connection.release();
            if (error) throw error;
            res.json({
                name:`您点的是${id}`,
                data: results[0]
            })
        });
    }); 
})
//重定向
.post('/add-hero',(req,res)=>{
    //模拟业务操作添加完毕
    //固定查看英雄1
    res.redirect('/showHero/1');
})

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
//4：处理请求响应数据
app.use(router);