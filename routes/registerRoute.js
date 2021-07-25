const express = require('express');
const app = express();
const router = express.Router()
const User = require('./../schemas/UserSchema')
const bcyrpt = require('bcryptjs')
// 配置 post 接收的数据类型
app.use(express.json()); // 客户端发来的是json数据，就可以正常接受
app.use(express.urlencoded({ extended: false })); // x-www-form-urlencoded


// 指定模板引擎
app.set("view engine", 'pug');
// 指定引擎文件
app.set("views", "views")

/** 
 *  @route get /register
 *  @description 注册页面
 *  @access public
*/

router.get('/', (req, res, next) => {
  res.status(200).render('register')
  // User.find().then(users => res.json(users))
})

/** 
 *  @route POST /register
 *  @description 注册接口
 *  @access public
*/

router.post('/', async (req, res, next) => {
  const { name, username, email, password } = req.body
  const nameT = name.trim();
  const usernameT = username.trim();
  const emailT = email.trim();
  const passwordT = password.trim();
  const payload = req.body;
  if (nameT && usernameT && emailT && passwordT) {
    // 存储
    // 查询 数据库是否存在username 或者 email
    const user = await User.findOne({
      $or: [
        { username },
        { email }
      ]
    })
    // 判断
    if (user === null) {
      // 没查到 正常存储
      const data = req.body
      data.password = await bcyrpt.hash(password, 10);
      User.create(data).then(user => {
        // 配置 session
        req.session.user = user;
        return res.redirect('/');
      })
    } else {
      // 查到了
      if (email === user.email) {
        payload.errorMessage = "Email already in use"
      } else {
        payload.errorMessage = "Username already in use"
      }
      res.status(400).render("register", payload);
    }
  } else {
    payload.errorMessage = "Make sure filed has a valid value."
    res.status(200).render("register", payload)
  }
})


module.exports = router
