const express = require('express');
const app = express();
const router = express.Router()

// 指定模板引擎
app.set("view engine", 'pug');
// 指定引擎文件
app.set("views", "views")

router.get('/:id', (req, res, next) => {
  const payload = {
    pageTitle: '消息预览',
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
    postId: req.params.id
  }
  res.status(200).render('postPage', payload)
})

module.exports = router
