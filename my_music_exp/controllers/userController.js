'use strict'
const db = require('../models/db');
let userController = {};



/**
 * [测试]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */

userController.doTest =(req,res,next)=>{
    db.q('select * from album_dir',[],(err,data)=>{
        if(err)return next(err);
        res.render('test.html',{
            text:data[0].dir
        })
    })
}



/**
 * [检查用户名是否存在]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
userController.checkUser = (req,res,next)=>{
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
}



/**
 * [注册]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
userController.doRegister = (req,res,next)=>{
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
}


/**
 * [登录]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
userController.doLogin = (req,res,next)=>{
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
}

// 向外导出
module.exports = userController;
