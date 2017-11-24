'use strict'
const db = require('../models/db');
let musicController = {};


/**
 * 添加音乐
 * 
 * @param {any} req 
 * @param {any} res 
 * @param {any} next 
 */
musicController.add_music = (req,res,next)=>{
    
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

/**
 * 更新音乐
 * 
 * @param {any} req 
 * @param {any} res 
 * @param {any} next 
 * @returns 
 */
musicController.update_music = (req,res,next)=>{
    
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
}


// 向外导出
module.exports = musicController;
