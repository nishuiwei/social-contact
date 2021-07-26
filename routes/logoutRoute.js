const express = require('express');
const router = express.Router()

/**
 *  @route GET /login
 *  @description 退出登录接口
 *  @access public
*/

router.get('/', (req, res, next) => {
  // res.status(200).render('login')
  if (req.session) {
    req.session.destroy(() => {
      res.redirect('/login')
    })
  }
})


module.exports = router
