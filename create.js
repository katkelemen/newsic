window.onload = createContent;

function getTags(url) {

  var request = new XMLHttpRequest();
  request.open("GET", url + "?show-tags=keyword&api-key=test", false);
  request.send(null);
  var data = JSON.parse(request.responseText);
  return data.response.content.tags.map(function(elem) {
    return elem.webTitle;
  }).filter(function(elem) {
    return !(elem === "Music" || elem === "Culture");
  });
}

function createContent() {
  var url = "http://content.guardianapis.com/search?section=music&api-key=test&show-fields=all&show-most-viewed=true";
  var request = new XMLHttpRequest();
  request.open("GET", url);
  request.onload = function(e) {
    if (request.readyState === 4) {
      if (request.status === 200) {
        var data = JSON.parse(request.responseText)
        initCalls(data);
      }
    }
  };
  request.send(null);
}

function initCalls(data) {
  var articleObjs = data.response.results;

  // createArticle(articleObjs[0]);
  articleObjs.forEach(function(elem) {
    getGuardianTags(elem);
  });
}

function getGuardianTags(elem) {
  var url = elem.apiUrl;
  var request = new XMLHttpRequest();
  request.open("GET", url + "?show-tags=keyword&api-key=test");
  request.send(null);
  request.onload = function(e) {
    if (request.readyState === 4) {
      if (request.status === 200) {
        var data = JSON.parse(request.responseText)
        tags = data.response.content.tags.map(function(elem) {
          return elem.webTitle;
        }).filter(function(elem) {
          return !(elem === "Music" || elem === "Culture");
        });
        generateURL(tags, elem);
      }
    }
  };
  request.send(null);
}

function createArticleDiv(songURL, articleData) {
  var contentDiv = document.getElementsByClassName('content-main')[0];
  var newDiv = document.createElement('div');
  newDiv.className = "article";

  var contentLink = document.createElement('a');
  contentLink.href = articleData.webUrl;

  var title = document.createElement('h3');
  title.innerHTML = articleData.webTitle;

  var article_content = document.createElement('p');
  var content = articleData.fields.body;
  if (content.length > 500) {
    article_content.innerHTML = content.substring(0, 500) + "...";
  } else {
    article_content.innerHTML = content;
  }

  var readMore = document.createElement('button');
  readMore.innerHTML = "Read more...";
  contentLink.appendChild(readMore);

  var player = document.createElement('iframe');
  player.className = 'player';
  player.setAttribute('height', '166');
  player.setAttribute('scrolling', 'no');
  player.setAttribute('frameborder', 'no');
  player.setAttribute('src', songURL);
  newDiv.appendChild(title);
  // contentLink.appendChild(title);

  newDiv.appendChild(article_content);
  newDiv.appendChild(contentLink);
  // newDiv.appendChild(readMore);

  // contentLink.appendChild(readMore);
  contentDiv.appendChild(newDiv);
  contentDiv.appendChild(player);
}
