const express = require('express');
const router = express.Router()

/**
 *  @route POST /
 *  @description POSTS接口
 *  @access public
*/

router.post('/', (req, res, next) => {
  res.status(200).send("it worked")
})


module.exports = router