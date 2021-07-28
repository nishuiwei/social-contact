const express = require('express');
const router = express.Router()
const Post = require('./../../schemas/PostsSchema');
const User = require('./../../schemas/UserSchema')

/**
 *  @route GET /
 *  @description 获取信息接口
 *  @access private
*/

router.get('/', async (req, res, next) => {
  await Post.find()
    .populate("postedBy")
    .populate("retweetData")
    .populate("replyTo")
    .sort({ "createdAt": -1 })
    .then(async results => {
      results = await User.populate(results, { path: 'replyTo.postedBy' })
      results = await User.populate(results, { path: 'retweetData.postedBy' })
      res.status(200).send(results)
    })
    .catch(error => {
      console.log(error);
      res.sendStatus(400);
    })
})


/** 
 *  @route GET /:id
 *  @description 获取单个信息接口
 *  @access private
*/

router.get('/:id', async (req, res, next) => {
  const postId = req.params.id
  await Post.findOne({ _id: postId })
    .populate("postedBy")
    .populate("retweetData")
    .populate("replyTo")
    .then(async results => {
      results = await User.populate(results, { path: 'replyTo.postedBy' })
      results = await User.populate(results, { path: 'retweetData.postedBy' })
      res.status(200).send(results)
    })
    .catch(error => {
      console.log(error);
      res.sendStatus(400);
    })
})

/**
 *  @route POST /
 *  @description POSTS接口
 *  @access private
*/

router.post('/', async (req, res, next) => {
  // if (req.body.replyTo) {
  //   console.log(req.body.replyTo)
  //   return;
  // }

  // 判断客户端是否传递参数
  if (!req.body.content) {
    return res.status(400).json({ error: "params is valid" })
  }

  // 参数正确 准备插入的数据
  const postData = {
    content: req.body.content,
    postedBy: req.session.user
  }

  if (req.body.replyTo) {
    postData.replyTo = req.body.replyTo;
  }

  // 插入数据 到 数据库
  Post.create(postData).then(async result => {
    result = await User.populate(result, { path: "postedBy" })
    res.status(201).send(result)
  }).catch(err => {
    return res.status(400).json({ error: "insert the post is failed" + err })
  })
})

/**
 *  @route PUT /:id/like
 *  @description 点赞和取消点赞接口
 *  @access private
*/

router.put('/:id/like', async (req, res, next) => {
  // 第一: 那条消息被点赞 是被谁点的
  const postId = req.params.id;
  const userId = req.session.user._id;
  // 第二: 这个用户有没有对这条消息点过赞
  const isLiked = req.session.user.likes && req.session.user.likes.includes(postId);
  const option = isLiked ? "$pull" : "$addToSet"
  // 第三: 未点赞 被点击后标记为 点赞 否则取反 存储用户列表中
  req.session.user = await User.findByIdAndUpdate(userId, { [option]: { likes: postId } }, { new: true }).catch(err => res.sendStatus(400).json(err))

  // 第四: 未点赞 被点击后标记为 点赞 否则取反 存储信息表中
  const post = await Post.findByIdAndUpdate(postId, { [option]: { likes: userId } }, { new: true }).catch(err => res.sendStatus(400).json(err))
  // 将更新的数据返回
  res.status(200).send(post)
})

/**
 *  @route POST /:id/retweet
 *  @description 转发和取消转发接口
 *  @access private
*/

router.post('/:id/retweet', async (req, res, next) => {
  // 第一: 那条消息被转发 是被谁点的
  const postId = req.params.id;
  const userId = req.session.user._id;

  // 第二: 这个用户有没有对这条消息转发 如果是转发过 那么该条转发消息删除
  const deletePost = await Post.findOneAndDelete({ postedBy: userId, retweetData: postId }).catch(err => res.sendStatus(400).json(err))
  const option = deletePost != null ? "$pull" : "$addToSet"

  // 第三: 未转发 复制 Post 数据
  if (!deletePost) {
    await Post.create({ postedBy: userId, retweetData: postId }).catch(err => res.sendStatus(400).json(err))
  }

  // 第四更新用户是否转发标记
  req.session.user = await User.findByIdAndUpdate(userId, { [option]: { retweets: postId } }, { new: true }).catch(err => res.sendStatus(400).json(err))

  // 第五: 更新信息是否转发的标记 
  const post = await Post.findByIdAndUpdate(postId, { [option]: { retweetUsers: userId } }, { new: true }).catch(err => res.sendStatus(400).json(err))
  // 将更新的数据返回
  res.status(200).send(post)
})



module.exports = router