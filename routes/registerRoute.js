const express = require('express');
const app = express();
const router = express.Router()


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
})

/** 
 *  @route POST /register
 *  @description 注册接口
 *  @access public
*/

router.post('/', (req, res, next) => {
  console.log(req.body)
  // var name = req.body.name.trim();
  // var username = req.body.username.trim();
  const { name, username, email, password } = req.body
  const nameT = name.trim();
  const usernameT = username.trim();
  const emailT = email.trim();
  const passwordT = password.trim();
  const payload = {};
  if (nameT && usernameT && emailT && passwordT) {
    // 存储
  } else {
    payload.errorMessage = "Make sure filed has a valid value."
    payload.name = nameT
    payload.email = emailT
    payload.username = usernameT
    res.status(200).render("register", payload)
  }
})


module.exports = router
