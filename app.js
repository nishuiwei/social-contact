const express = require('express');
const { requireLogin } = require('./middlewares/loginMiddleware');
const app = express();
const port = 3000;
const path = require('path')
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

// 配置 post 接收的数据类型
app.use(express.json()); // 客户端发来的是json数据，就可以正常接受
app.use(express.urlencoded({ extended: false })); // x-www-form-urlencoded

// 指定模板引擎
app.set("view engine", 'pug');
// 指定引擎文件
app.set("views", "views")
// 使用静态文件夹
app.use(express.static(path.join(__dirname, 'public')))
// 关联路由
const loginRoutes = require('./routes/loginRoute')
const registerRoutes = require('./routes/registerRoute')

app.use('/login', loginRoutes)
app.use('/register', registerRoutes)

app.get('/', requireLogin, (req, res, next) => {

  var payload = {
    pageTitle: '卫慧杰'
  }
  res.status(200).render("home", payload)
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
