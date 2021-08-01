const express = require('express');
const router = express.Router()
const User = require('./../../schemas/UserSchema')
/**
 *  @route PUT /:userId/follow
 *  @description 实现关注接口
 *  @access private
 * 
 */
router.put('/:userId/follow', async (req, res, next) => {
  // 被关注者的ID
  const userId = req.params.userId
  // 查询这个ID是否存在
  const user = await User.findById({ _id: userId })
  // user 为 null
  if (user == null) return res.status(404).json('userId is not found')
  // user有内容
  const isFollowing = user.followers && user.followers.includes(req.session.user._id)
  const option = isFollowing ? "$pull" : "$addToSet"
  // 被关注的偶像
  // 加入/减除 关注者 following 容器
  req.session.user = await User.findByIdAndUpdate(req.session.user._id, {
    [option]: {
      following: userId
    }
  }, { new: true })
  // 加入/减除 粉丝中 followers 容器
  await User.findByIdAndUpdate(userId,
    { [option]: { followers: req.session.user._id } },
    { new: true }
  )
  // const users = await User.find();
  res.status(200).send(req.session.user)
})

module.exports = router