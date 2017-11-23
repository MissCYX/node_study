// 引入数据库对象
const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'album'
});

//思考过程
// let q = function(sql,props,callback){
//     pool.getConnection((err, connection)=> {
//         if(err)return callback(err,null);
//         connection.query(sql,props,(error, results)=>{
//             connection.release();
//             //将这两段合二为一
//             if(error) return callback(error,null);
//             callback(null,results);

//             //不管有没有error,让外部判断
//             callback(error,results);
//         })
//     });
// }
// q('select * from users',[],function(err,data){
//     if(err) 有异常
//         否则操作data
// })


//正常代码
let q = function(sql,props,callback){
    pool.getConnection((err, connection)=> {
        if(err)return callback(err,null);
        connection.query(sql,props,(error, results)=>{
            connection.release();
            //不管有没有error,让外部判断
            callback(error,results);
        })
    });
}

// ===============================================================
// own exp db_function
// 即error和响应的两种处理情况留给callback传入处理
// let q = function(sql,props,callback){
//     pool.getConnection((err,connection)=>{
//         // 发上错误的时候，可以传入callback处理
//         if(err) return callback(err,null);
//         connection.query(sql,props,(error,result)=>{
//             connection.release();
//             // 有发生错误和没有错误两种情况
//             // 即传入next（err）和响应的两种情况
//             // 因此传入error和results两种参数
//             callback(error,results);
//         })
//     })
// }
// =====================================================================













//将q向外暴露
module.exports = {
    q:q
};
//let db = require('./db.js');
//  db('select * ')
//  现在的写法就是
//  db.q('select * ')
//  总结： 封装更为灵活，api使用的时候更加语义化