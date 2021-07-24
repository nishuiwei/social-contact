const express = require('express');
const { requireLogin } = require('./middlewares/loginMiddleware');
const app = express();
const port = 3000;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

// 指定模板引擎
app.set("view engine", 'pug');
// 指定引擎文件
app.set("views", "views")

// 关联路由
const loginRoutes = require('./routes/loginRoute')
app.use('/login', loginRoutes)
app.get('/', requireLogin, (req, res, next) => {

  var payload = {
    pageTitle: '卫慧杰'
  }
  res.status(200).render("home", payload)
})

