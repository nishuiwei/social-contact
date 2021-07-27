const express = require('express');
const router = express.Router()
const Post = require('./../../schemas/PostsSchema');
const User = require('./../../schemas/UserSchema')

/**
 *  @route GET /
 *  @description 获取信息接口
 *  @access public
*/

router.get('/', async (req, res, next) => {
  await Post.find()
    .populate("postedBy")
    .sort({ "createdAt": -1 })
    .then(results => res.status(200).send(results))
    .catch(error => {
      console.log(error);
      res.sendStatus(400);
    })
})

/**
 *  @route POST /
 *  @description POSTS接口
 *  @access public
*/

router.post('/', async (req, res, next) => {
  // 判断客户端是否传递参数
  if (!req.body.content) {
    return res.status(400).json({ error: "params is valid" })
  }

  // 参数正确 准备插入的数据
  const postData = {
    content: req.body.content,
    postedBy: req.session.user
  }

  // 插入数据 到 数据库
  await Post.create(postData).then(async result => {
    result = await User.populate(result, { path: "postedBy" })
    res.status(201).send(result)
  }).catch(err => {
    return res.status(400).json({ error: "insert the post is failed" + err })
  })
})


module.exports = router