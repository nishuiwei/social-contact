const express = require('express');
const app = express();
const router = express.Router()
const User = require('./../schemas/UserSchema')
const bcrypt = require('bcryptjs')

// 指定模板引擎
app.set("view engine", 'pug');
// 指定引擎文件
app.set("views", "views")

router.get('/', (req, res, next) => {
  res.status(200).render('login')
})


/** 
 *  @route POST /login
 *  @description 登录接口
 *  @access public
*/

router.post('/', async (req, res, next) => {
  const payload = req.body
  // 判断
  const { loginUsername, loginPassword } = req.body
  if (loginUsername && loginPassword) {
    // 查询数据库
    const user = await User.findOne({
      $or: [
        { username: loginUsername },
        { email: loginPassword }
      ]
    })
    if (user) {
      // 密码匹配
      const result = await bcrypt.compare(loginPassword, user.password);
      // if (result) 
      console.log(result)
      if (result) {
        req.session.user = user;
        return res.redirect('/')
      } else {
        payload.errorMessage = 'password is incorrect'
        return res.status(400).render('login', payload)
      }
    } else {
      payload.errorMessage = 'username or email is incorrect'
      return res.status(400).render('login', payload)
    }
  }
})
module.exports = router
