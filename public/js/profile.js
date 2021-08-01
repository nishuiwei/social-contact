$(document).ready(() => {
  loadPosts(profileUserId);
  console.log(userLoggedInJs)
})

function loadPosts(profileUserId) {
  // 发起请求
  $.get("/api/posts", { postedBy: profileUserId, isReply: isMessage == 0 }, results => {
    outputPosts(results, $('.postsContainer'))
  })
}