### 准备开始
---
#### 学员反馈
这几天下来整体还是挺懵的，感觉每天上课的时候差不多，写东西，又不知道该怎么写。提问题又感觉自己都还行。就是写不出来。碰到一位很负责任的好老师，今天下午整体复习过了之后，感觉舒服了很多。感谢老师。传智我涂哥，人好话也多

  请求地址的参数拼接 再讲一下
        查询字符串:(url)
            www.itcast.cn/web?teacher=tjx
            www.itcast.cn/web?type=price
               req.(query).teacher
               req.(query).type 
        path方式:(url)
            www.itcast.cn/web/tjx
            www.itcast.cn/web/price
               req.(params).teacher
               req.(params).type 


  实际项目中基于node的项目在开发中的流程 就是怎么才能在未来工作中像个老手呢
#### 复习

#### 今日重点

#### MVC编程思想
* 相当于开一家公司，由一个人全部处理
* 变更为，一个前台小姐、一个经理、一个仓库管理员
* V(view) 前台小姐，负责显示功能
* C(controller) 经理 负责调用V和M
* M(model) 仓库管理员(db.js) 负责数据
* 总结一句: controller(C)是
  - 对view(V)(res.render)
  - 和model(M)(db)
  - 的调用
* 项目大了，代码多了。为了好维护，总得有个方式来区分，这些哥们，就整出了MVC的区分思想

#### 邮箱正则(来自互联网)
* /^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/; 

#### 验证用户名是否存在接口
* 如果自己有数据库，不用修改任何代码
  - node_music
* docs文件夹中有脚本
* 编写代码的时候
  - 表名是users
  - /test的编写没有意义
  - 响应结果
  -   {   code:'002'} 
  - npm ./app.js ->  双击start.cmd

