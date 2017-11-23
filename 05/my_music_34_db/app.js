'use strict';
// 1:引入express对象
const express = require('express');
// 2:创建服务器
let app = express();
// 3:开启服务器监听端口
app.listen(9999,()=>{
    console.log('34期服务器启动在9999端口');
});
// 引入数据库操作db对象
const db = require('./models/db');



//配置模板引擎
app.engine('html', require('express-art-template') );


// 4:处理请求
//配置路由规则 开始
//分析db抽取功能 开始
// .get('/test',(req,res,next)=>{
//     // pool.getConnection((err, connection)=> {
//     //     if(err) return next(err);
//     //     connection.query('select * from album_dir',(error, results)=>{
//     //         connection.release();
//     //         if(err) return next(err);
//     //         let tmp = results[0].dir; //a
//     //         res.render('test.html',{
//     //             text:tmp
//     //         });
//     //     })
//     // });
//     //判断是否有异常，如果没有异常，才操作results
//     // results
// })
//分析db抽取功能 结束
let router = express.Router();
router.get('/test',(req,res,next)=>{
    db.q('select * from album_dir',[],(err,data)=>{
        if(err)return next(err);
        res.render('test.html',{
            text:data[0].dir
        })
    })
})

//配置路由规则 结束

//中间件配置行为列表
//第一件事: 路由
app.use(router);
// 第二件事: 错误处理
app.use((err,req,res,next)=>{
    console.log(err);
    res.send(`
        <div style="background-color:yellowgreen;">
            您要访问的页面，暂时去医院了..请稍后再试..
            <a href="/">去首页</a>
        </div>
    `)
});