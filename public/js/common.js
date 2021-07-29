// 监听 textarea 内容变化
$('#postTextarea, #replyTextarea').keyup(event => {
  const textbox = $(event.target);
  const value = textbox.val().trim();
  const isModal = textbox.parents(".modal").length == 1;
  console.log(isModal)
  const submitButton = !isModal ? $('#submitPostButton') : $('#submitReplyButton');

  if (value == "") {
    submitButton.prop("disabled", true)
    return
  }

  submitButton.prop('disabled', false)
})

// 发布状态按钮
$("#submitPostButton, #submitReplyButton").click((event) => {
  const button = $(event.target);
  const isModal = button.parents(".modal").length == 1;
  console.log(isModal)
  const textbox = !isModal ? $('#postTextarea') : $("#replyTextarea");

  const data = {
    content: textbox.val()
  }

  if (isModal) {
    const id = button.data().id;
    // console.log(id)
    if (id == null) return alert('Button id is null');
    data.replyTo = id;
  }
  // 发起请求
  // /api/posts == http://localhost:3000/api/posts
  $.post("/api/posts", data, (postData) => {
    if (postData.replyTo) {
      location.reload()
    } else {
      const html = createPostHtml(postData);
      $('.postsContainer').prepend(html)
      textbox.val("")
      button.prop('disabled', true)
    }
  })
})

// 点赞按钮
$(document).on('click', '.likeButton', (event) => {
  const button = $(event.target)
  const postId = getPostIdFromElement(button)
  // 发起请求
  $.ajax({
    url: `/api/posts/${postId}/like`,
    type: "PUT",
    success: (postData) => {
      button.find("span").text(postData.likes.length || "")
      if (postData.likes.includes(userLoggedIn._id)) {
        button.addClass('active');
      } else {
        button.removeClass('active')
      }
    },
  })
})

// 转发按钮
$(document).on('click', '.retweetButton', (event) => {
  const button = $(event.target)
  const postId = getPostIdFromElement(button)
  // 发起请求
  $.ajax({
    url: `/api/posts/${postId}/retweet`,
    type: "POST",
    success: (postData) => {
      button.find("span").text(postData.retweetUsers.length || "")
      if (postData.retweetUsers.includes(userLoggedIn._id)) {
        button.addClass('active');
        window.location.reload()
      } else {
        button.removeClass('active')
        window.location.reload()
      }
    },
  })
})

// 点击消息跳转
$(document).on('click', '.post', (event) => {
  const element = $(event.target);
  const postId = getPostIdFromElement(element);
  if (postId !== undefined && !element.is("button")) {
    window.location.href = '/posts/' + postId;
  }
})

$("#replyModal").on('shown.bs.modal', (event) => {
  // relatedTarget 可以获取
  const button = $(event.relatedTarget);
  const postId = getPostIdFromElement(button)
  // console.log(postId)
  $('#submitReplyButton').attr('data-id', postId)
  // 获取当前数据
  $.get('/api/posts/' + postId, result => {
    console.log(result)
    outputPosts(result.postData, $('#originalPostContainer'))
  })
})

$("#replyModal").on('hidden.bs.modal', () => {
  $('#originalPostContainer').html("")
})

function getPostIdFromElement(element) {
  const isRoot = element.hasClass("post");
  const rootElement = isRoot ? element : element.closest(".post")
  const postId = rootElement.data().id;
  if (postId === undefined) return alert("post is undefined")
  return postId
}


function createPostHtml(postData, largeFont = false) {
  if (postData == null) return alert("post object is null");
  // 判断是不是转发的数据
  const isRetweet = postData.retweetData !== undefined;
  postData = isRetweet ? postData.retweetData : postData;

  const postedBy = postData.postedBy
  const timestamp = timeDifference(new Date(), new Date(postData.createdAt))
  const likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? "active" : ""
  const retweetButtonActiveClass = postData.retweetUsers.includes(userLoggedIn._id) ? "active" : ""
  let retweetText = "";
  let replyFlag = "";
  let largeFontClass = !largeFont ? 'largeFont' : ''
  if (isRetweet) {
    retweetText = `
      <span>
        <i class="fa fa-retweet"></i>
        <a href="/profile/${postData.postedBy.username}">@${postData.postedBy.username}已转发</a>
      </span>
    `
  }
  if (postData.replyTo) {
    if (!postData.replyTo._id) {
      return alert('replyTo is not populated')
    } else if (!postData.replyTo.postedBy._id) {
      return alert('postedBy is not populated')
    }
    const replyToUsername = postData.replyTo.postedBy.username;
    replyFlag = `
      <div class="reply">
        <a href="/profile/${replyToUsername}">@${replyToUsername}</a>的评论
      </div>
    `
  }

  return (
    `
    <div class="post ${largeFontClass}" data-id='${postData._id}'>
      <div class="postActionContainer">
        ${retweetText}
      </div>
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
          ${replyFlag}
          <div class="postBody">
            <span>${postData.content}</span>
          </div>
          <div class="postFooter">
            <div class="postButtonContainer">
              <button data-bs-toggle="modal" data-bs-target="#replyModal">
                <i class="fa fa-comment"></i>
              </button>
            </div>
            <div class="postButtonContainer green">
              <button class="retweetButton ${retweetButtonActiveClass}">
                <i class="fa fa-retweet"></i>
                <span>${postData.retweetUsers.length || ""}</span>
              </button>
            </div>
            <div class="postButtonContainer red">
              <button class="likeButton ${likeButtonActiveClass}">
                <i class="fa fa-heart"></i>
                <span>${postData.likes.length || ""}</span>
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

function outputPosts(results, container) {
  container.html("");
  if (!Array.isArray(results)) {
    results = [results]
  }
  results.forEach(result => {
    const html = createPostHtml(result);
    container.append(html);
  })
  if (results.length == 0) {
    container.append("<span class='noResults'>Nothing to show. </span>")
  }
}


function outputPostsWithsReplies(result, container) {
  container.html("");
  // 如果有评论消息，那就展示
  if (result.replyTo !== undefined && result.replyTo._id !== undefined) {
    const html = createPostHtml(result.replyTo);
    container.append(html)
  }

  // 展示消息
  const mianPostHtml = createPostHtml(result.postData, true)
  container.append(mianPostHtml)

  result.replies.forEach(result => {
    const html = createPostHtml(result);
    container.append(html);
  })
}