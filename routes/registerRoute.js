const express = require('express');
const app = express();
const router = express.Router()

// 指定模板引擎
app.set("view engine", 'pug');
// 指定引擎文件
app.set("views", "views")

router.get('/', (req, res, next) => {
  res.status(200).render('register')
})


module.exports = router
