const express = require('express');
const router = express.Router()
const User = require('./../schemas/UserSchema')

router.get('/', (req, res, next) => {
  const payload = {
    pageTitle: req.session.user.username,
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
    profileUser: req.session.user
  }
  res.status(200).render('profilePage', payload)
})

router.get('/:username', async (req, res, next) => {
  const payload = await getPayload(req.params.username, req.session.user)

  res.status(200).render('profilePage', payload)
})

async function getPayload(username, userLoggedIn) {
  const user = await User.findOne({ username })
  if (user === null) {
    return {
      pageTitle: 'User not found',
      userLoggedIn: userLoggedIn,
      userLoggedInJs: JSON.stringify(userLoggedIn),
    }
  }
  return {
    pageTitle: user.username,
    userLoggedIn: userLoggedIn,
    userLoggedInJs: JSON.stringify(userLoggedIn),
    profileUser: user
  }
}

module.exports = router
