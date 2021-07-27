$('#postTextarea').keyup(event => {
  const textbox = $(event.target);
  const value = textbox.val().trim();
  const submitButton = $('#submitPostButton');
  if (value == "") {
    submitButton.prop("disabled", true)
    return
  }

  submitButton.prop('disabled', false)
})

$("#submitPostButton").click((event) => {
  const button = $(event.target);
  const textbox = $('#postTextarea');
  const data = {
    content: textbox.val()
  }
  // 发起请求

  // /api/posts == http://localhost:3000/api/posts
  $.post("/api/posts", data, (postData, status, xhr) => {
    console.log(postData)
    const html = cretePostHtml(postData);
    $('.postsContainer').prepend(html)
    textbox.val("")
    button.prop('disabled', true)
  })
})

function cretePostHtml(postData) {
  const postedBy = postData.postedBy
  const timestamp = timeDifference(new Date(), new Date(postData.createdAt))
  return (
    `
    <div class="post">
      <div class="mainContentContainer">
        <div class="userImageContainer">
          <img src="${postedBy.profilePic}" alt="">
        </div>
        <div class="postContentContainer">
          <div class="header">
            <a href="/profile/username" class="displayName">${postedBy.name}</a>
            <span class="username">@${postedBy.username}</span>
            <span class="date">${timestamp}</span>
          </div>
          <div class="postBody">
            <span>${postData.content}</span>
          </div>
          <div class="postFooter">
            <div class="postButtonContainer">
              <button>
                <i class="fa fa-comment"></i>
              </button>
            </div>
            <div class="postButtonContainer">
              <button>
                <i class="fa fa-retweet"></i>
              </button>
            </div>
            <div class="postButtonContainer">
              <button>
                <i class="fa fa-heart"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
      `);
}


function timeDifference(current, previous) {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;
  const elapsed = current - previous;
  if (elapsed < msPerMinute) {
    if (elapsed / 1000 < 30) return "Just now";
    return Math.round(elapsed / 1000) + ' seconds ago';
  }
  else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' minutes ago';
  }
  else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' hours ago';
  }
  else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + ' days ago';
  }
  else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + ' months ago';
  }
  else {
    return Math.round(elapsed / msPerYear) + ' years ago';
  }
}