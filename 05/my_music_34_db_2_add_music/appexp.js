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

// 引入session
const session = require('express-session')

// 解析文件上传
const formidable = require('formidable');

// 路径path核心对象
const path = require('path');



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
// 验证表单
// .post('/api/check-user',(req,res,next)=>{
//     //1:获取请求体中的数据 req.body
//     let username = req.body.username;
//     //2:查询用户名是否存在于数据库中
//     db.q('select * from users where username = ?',[username],(err,data)=>{
//         if(err) return next(err);
//         // console.log(data);
//         //判断是否有数据
//         if(data.length == 0){
//             //可以注册
//             res.json(长度
//                 code:'001',
//                 msg:'可以注册'
//             })
//         }else{
//             res.json({
//                 code:'002',msg:'用户名已经存在'
//             })
//         }
//     });

// })
// ============================================================================
.post('/api/check-user',(req,res,next)=>{
    let username = req.body.username;
    db.q('select * from users where username = ?',[username],(err,data)=>{
        if(err) return next(err);
        if(data.length == 0){
            res.json({
                code:'001',
                msg:'可以注册'
            })
        }else{
            res.json({
                code:'002',
                msg:'用户名已存在'
            })
        }
        
    })
})
// ==============================================================================================

// 用户注册
.post('/api/do-register',(req,res,next)=>{
    // 接收数据
    let username = req.body.username;//后端名称要与前端一致
    let password = req.body.password;
    let email = req.body.email;
    let V_code = req.body.V_code;
    // 验证表单
    // 1.验证码暂留，使用扩展包
    // 2.验证邮箱
    // 使用判断邮箱的正则字符串
    let regex = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
    if(!regex.test(email)){
        res.json({
            code:'004',
            msg:'邮箱不合法'
        })
        return;
    }
    // 如果没有return，继续向下验证
    // 验证用户名或邮箱知否存在
    db.q('select * from users where username = ? or email = ?',[username,email],(err,data)=>{
        if(err) return next(err);
        if(data.length !== 0){
            // 有可能存在邮箱，有可能存在用户名
            let user = data[0];//只有可能存在一个，长度为1
            if(user.email == email){
                return res.json({
                    code:'002',
                    msg:'邮箱已经注册'
                })
            }else if(user.username == username){
                return res.json({
                    code:'002',
                    msg:'用户名已经被注册'
                })
            }

        }else{
            // 没有找到相同的用户名或邮箱
            // 可以注册，将表单信息添加到数据库
            db.q('insert into users (username,password,email) values (?,?,?)',[username,password,email],(err,result)=>{
                if(err) return next(err);
                res.json({
                    code:'001',
                    msg:'注册成功'
                })
            })
        }
    })
})
// 3响应数据
// 验证登录信息
.post('/api/do-login',(req,res,next)=>{
    // 接收参数
    let username = req.body.username;
    let password = req.body.password;
    let remember_me = req.body.remember_me;
    // 查询数据库，将用户名作为数据库查询条件
    db.q('select * from users where uesrname = ?',[username],(err,data)=>{
        if(err) return next(err);
        // 找不到用户名
        if(data.length == 0){
            return res.json({
                code:'002',
                msg:'用户名或密码不正确'
            })
        }
        // 找到了用户，验证密码
        let dbUser = data[0];
        if(dbUser.password !== password){
            return res.json({
                code:'002',
                msg:'用户名或密码不正确'
            })
        }
        // 登陆成功
        // 将用户数据储存到session上
        req.session.user = dbUser;
        res.json({
            code:'001',
            msg:'登录成功'
        })
    })
})

// 添加音乐
.post('./api/add-music',(req,res,next)=>{
    // 上传列表，表单上传扩展包
    var form = new formidable.IncomingForm();
    // 文件上传，临时文件存放路径
    form.uploadDir = path.join(__dirname,'public/files');
    // 解析请求对象
    form.parse(req,(err,fields,files)=>{
        if(err) return next(err);
        console.log(fields);
        console.log(files);
        // { title: '告白气球', singer: '周杰伦', time: '03:00' }
        // { file:{}
        //将获取的信息存在一个数组中
        let datas = [fields.title,fields.singer,fields.time];
        let sql= 'insert into musics title=?,singer=?,time=?,';
        // 还要将音乐和歌词的路径信息添加到数据库中；
        // 获取路径信息
        // 也有可能没有歌词，因此进行字符串拼接
        // 上传的音乐文件
        if(files.file){
            // 获取文件名
            let filename = path.parse(files.file.path).base;
            // 将上传的文件名添加到数组
            datas.push(`/public/files/${filename}`);
            // 添加sql查询语句
            sql += 'file=?,';
        }
        if(files.filelrc){
            // 获取文件名
            let lrcname = path.parse(files.filelrc.path).base;
            // 将上传的文件名添加到数组
            datas.push(`/public/files/${lrcname}`);
            // 添加sql查询语句
            sql += 'filelrc=?,';
        }
        // 添加session中的用户id
        sql += 'uid=?;';
        datas.push(req.session.user.id);

        // 将信息添加到数据库中
        db.q(sql,datas,(err,data)=>{
            if(err) return next(err)
            return res.json({
                code:'001',
                msg:'添加音乐成功'
            })
        })

    })

})

// 更新音乐
.put('/update-music',(req,res,next)=>{
    // 判断是否存在session上的user
    if(!req.session.user){
        res.send(`请去首页登录
                <a herf="/user/login">点击</a>`);
        return;
    }
    var form = new formidable.IncomingForm();
    // 设置临时上传路径
    form.uploadDir = path.join(__dirname,'public/files');
    form.parse(req,(err,fields,files)=>{
        if(err) return next(err);
        // 解析请求对象
    form.parse(req,(err,fields,files)=>{
        if(err) return next(err);
        let datas = [fields.title,fields.singer,fields.time];
        let sql= 'update musics set title=?,singer=?,time=?,';
        // 还要将音乐和歌词的路径信息添加到数据库中；
        // 获取路径信息
        // 也有可能没有歌词，因此进行字符串拼接
        // 上传的音乐文件
        if(files.file){
            // 获取文件名
            let filename = path.parse(files.file.path).base;
            // 将上传的文件名添加到数组
            datas.push(`/public/files/${filename}`);
            // 添加sql查询语句
            sql += 'file=?,';
        }
        if(files.filelrc){
            // 获取文件名
            let lrcname = path.parse(files.filelrc.path).base;
            // 将上传的文件名添加到数组
            datas.push(`/public/files/${lrcname}`);
            // 添加sql查询语句
            sql += 'filelrc=?,';
        }
        // 去除一个逗号,字符串末尾
        sql = sql.substr(0,sql.length -1);
        sql += 'where id = ?';
        datas.push(fields.id);

        // 将信息添加到数据库中
        db.q(sql,datas,(err,data)=>{
            if(err) return next(err)
            return res.json({
                code:'001',
                msg:'更新音乐成功'
            })
        })

    })

    })


})



//配置路由规则 结束

//中间件配置行为列表
// ===========================
// 注意：在路由使用session之前，先生产session
app.use(session({
    secret:'itcast',//唯一标识，必填
    resave:false,//true是强制保存，不管有没有改动session中的数据，依然重新覆盖一次
    //一访问服务器就分配session
    // 如果为false，当你用代码显示操作session的时候才分配
    saveUninitialized:true,
    // cookie: { secure: true // 仅仅在https下使用 }
    
}));
// ============================
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