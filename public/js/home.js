$(document).ready(() => {
  // 发起请求
  $.get("/api/posts", results => {
    console.log(results)
    outputPosts(results, $('.postsContainer'))
  })
})

function outputPosts(results, container) {
  container.html("");
  results.forEach(result => {
    const html = cretePostHtml(result);
    container.append(html);
  })
  if (results.length == 0) {
    container.append("<span class='noResults'>Nothing to show. </span>")
  }
}