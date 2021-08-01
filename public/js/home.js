$(document).ready(() => {
  // 发起请求
  $.get("/api/posts", results => {
    outputPosts(results, $('.postsContainer'))
  })
})
