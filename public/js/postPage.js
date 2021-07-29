// 加载数据
$(document).ready(() => {
  $.get('/api/posts/' + postId, result => {
    console.log(result)
    outputPostsWithsReplies(result, $('.postsContainer'))
  })
})