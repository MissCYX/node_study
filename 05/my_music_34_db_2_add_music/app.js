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
//引入处理post请求体对象
const bodyParser = require('body-parser');
//解析文件上传
const formidable = require('formidable');
//引入path核心对象
const path = require('path');
//引入session
const session = require('express-session');

//配置模板引擎
app.engine('html', require('express-art-template') );


// 4:处理请求
//配置路由规则 开始
let router = express.Router();
router.get('/test',(req,res,next)=>{
    db.q('select * from album_dir',[],(err,data)=>{
        if(err)return next(err);
        res.render('test.html',{
            text:data[0].dir
        })
    })
})
//检查用户名是否存在
.post('/api/check-user',(req,res,next)=>{
    //1:获取请求体中的数据 req.body
    let username = req.body.username;
    //2:查询用户名是否存在于数据库中
    db.q('select * from users where username = ?',[username],(err,data)=>{
        if(err) return next(err);
        // console.log(data);
        //判断是否有数据
        if(data.length == 0){
            //可以注册
            res.json({
                code:'001',
                msg:'可以注册'
            })
        }else{
            res.json({
                code:'002',msg:'用户名已经存在'
            })
        }
    });
})
.post('/api/do-register',(req,res,next)=>{
    //1:接收数据
    let userData = req.body;
    let username = userData.username;//后端名称与前端要一致
    let password = userData.password;
    let v_code = userData.v_code;
    let email = userData.email;
    //2:处理数据(验证)
    //2.1:验证验证码（暂留）
    //2.2:验证邮箱
    let regex = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
    if(!regex.test(email)){
        //不满足邮箱字符串
        res.json({
            code:'004',msg:'邮箱不合法'
        });
        return;
    }
    //2.3:验证用户名或者邮箱是否存在
    db.q('select * from users where username = ? or email = ? ',[username,email],(err,data)=>{
        if(err) return next(err);
        if(data.length != 0){
            //有可能邮箱存在，有可能用户名存在
            let user = data[0]; 
            if(user.email == email){
                return res.json({
                    code:'002',msg:'邮箱已经注册'
                });
            }else if( user.username == username){
                return res.json({
                    code:'002',msg:'用户名已经注册'
                });
            }
        }else{
            //用户名和邮箱都不存在，可以注册
            db.q('insert into users (username,password,email) values (?,?,?)',[username,password,email],(err,result)=>{
                if(err) return next(err);
                console.log(result);
                //响应json对象
                res.json({
                    code:'001',msg:'注册成功'
                })
            })


        }
    })


    //3:响应数据
})
.post('/api/do-login',(req,res,next)=>{
    //1:接受参数
    let username = req.body.username;
    let password = req.body.password;
    let remember_me = req.body.remember_me;
    //2:将用户名作为条件查询数据库
    db.q('select * from users where username = ?',[username],(err,data)=>{
        if(err) return next(err);
        //不好的示例
        // let msg = {};
        // if(data.length == 0){
        //     //没有该用户
        //     msg.code = '002';
        //     msg.msg = '用户名或密码不正确';
        // }else{
        //     let dbUser = data[0];
        //     //判断密码是否一致
        //     if(dbUser.pasword != password){
        //         msg.code = '002';
        //         msg.msg = '用户名或密码不正确';
        //     }else{
        //         //用户名密码是正确
        //         msg.code = '001';
        //         msg.msg = '登录成功'
        //     }
        // }
        // //统一res.json();
        // res.json(msg)
        
        if(data.length == 0){
            return res.json({
                code:'002',msg:'用户名或密码不正确'
            });
        }
        //找到了用户
        let dbUser = data[0];
        if(dbUser.password != password){
            return res.json({
                code:'002',msg:'用户名或密码不正确'
            })
        }
        
        //给session上存储用户数据
        req.session.user = dbUser;
        // 只要session上有.user就说明登录了
        // websocket 主动向客户端推送

        res.json({
            code:'001',msg:'登录成功'
        })
    })
})
//添加音乐
.post('/api/add-music',(req,res,next)=>{

    console.log(req.session.user);
   

    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname,'public/files');
    // 解析请求对象
    form.parse(req, function(err, fields, files) {
        if(err) return next(err);
        // { title: '告白气球', singer: '周杰伦', time: '03:00' }
        // { file:{}
        // console.log(fields);
        // console.log(files);
        //获取6个字段中的3个
        let datas = [fields.title,fields.singer,fields.time];
        let sql = 'insert into musics (title,singer,time,';
        let params = '(?,?,?';
        //两个路径
        if(files.file){
            //获取文件名
            let filename = path.parse(files.file.path).base;
            //如果上传了文件
            datas.push(`/public/files/${filename}`);
            sql += 'file,';
            params += ',?';
        }
        if(files.filelrc){
            //获取文件名
            let lrcname = path.parse(files.filelrc.path).base;
            //如果上传了文件
            datas.push(`/public/files/${lrcname}`);
            sql += 'filelrc,';
            params += ',?';
        }
        params += ',?)';
        sql += 'uid) values ';
        //用户的id
        datas.push(req.session.user.id);
        // console.log(sql);
        // console.log(params);
        //插入音乐数据
        db.q(sql + params ,datas,(err,data)=>{

        });




    });
})


//配置路由规则 结束

//中间件配置行为列表
//第-1件是:在路由使用session之前，先生产session
app.use(session({
  secret: 'itcast', //唯一标识，必填
  resave: false, 
  //true强制保存,不管有没有改动session中的数据，依然重新覆盖一次
  saveUninitialized: true,//一访问服务器就分配session
  //如果为false,当你用代码显式操作session的时候才分配
  // cookie: { secure: true // 仅仅在https下使用 }
}));
//第0件事:处理post请求体数据
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
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