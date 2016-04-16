$(document).ready(function() {
  $("#pausevideo").on("click", function() {
    stopVideo();
  });
  $("#playvideo").on("click", function() {
    playVideo();
  });
  $("#nextvideo").on("click", function() {
    nextVideo();
  });
  $("#prevvideo").on("click", function() {
    prevVideo();
  });
});

function gethot40(callback) {
  var $ret = 0;
  url = 'http://www.billboard.com/rss/charts/hot-100';
  $.ajax({
    type: "GET",
    url: document.location.protocol + 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=1000&callback=?&q=' + encodeURIComponent(url),
    dataType: 'json',
    error: function() {
      console.log('unable to get');
    },
    success: function(results) {
      callback(results);
    }
  });
  return $ret;
};

function getYTinfo (titleOnly, callback) {
  $.ajax({
      type: "GET",
    url: "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q="+encodeURIComponent(titleOnly) +"&type=video&key=AIzaSyBvvK68K8TABraGSlQOE8EqwmJYR7hjn_I",
    dataType: 'json',
    error: function() {
      console.log('unable to get');
    },
    success: function(results) {
      callback(results);
      //console.log(results.items[0].snippet.title);
      //$("#playlist").append(results.items[0].snippet.title+" "+results.items[0].id.videoId+"<br>");
      //$("#playlist").append("<a href=# onclick='changeVideo(\""+results.items[0].id.videoId+"\")'><li class='listitem' id="+i+">"+results.items[0].snippet.title+"</li></a>")
    }
    });
};


gethot40(function(data) {
  lengthList = Object.keys(data.responseData.feed.entries).length;

  //for (var i = 0; i < lengthList; i++) {
  for (var i = 0; i < 50; i++) {
    console.log(i);
    titleFull = data.responseData.feed.entries[i].contentSnippet;
    titleOnly = (titleFull).substr(0,(titleFull).indexOf('rank'));
    getYTinfo(titleOnly, function(YTresults) {
      console.log(YTresults);
      $("#playlist").append("<a href=# class='listitem' id='"+YTresults.items[0].id.videoId+"' onclick='changeVideo(this,\""+YTresults.items[0].id.videoId+"\")'><li>"+YTresults.items[0].snippet.title+"</li></a>")
    });
  };

});

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    //height: '100%',
    width: '100%',
    videoId: 'R03cqGg40GU',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });

}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    //setTimeout(stopVideo, 2000);
    console.log('load rhianna');
    player.loadVideoById($(".listitem")[0].id, 5, "large");
    done = true;
  }
  if (event.data === 0) {
    nextVideo();
  }
}


function stopVideo() {
  player.pauseVideo();
}

function playVideo() {
  player.playVideo();
}
var index = 0;
function changeVideo(obj, vidID) {
  //console.log($(this).attr());
  index = $(obj).index();
  player.loadVideoById(vidID, 5, "large");
}

function nextVideo() {
  //var idnum = $(".listitem").get(index);
  //console.log($(".listitem").length);
  if(index >= $(".listitem").length-1) {
    index = 0;
    player.loadVideoById($(".listitem")[index].id, 5, "large");
  }
  else {
    index++;
    //console.log($(".listitem")[index].id);
    player.loadVideoById($(".listitem")[index].id, 5, "large");
  }
}
function prevVideo() {
  if (index == 0) {
    index = $(".listitem").length-1;
    console.log(index);
    player.loadVideoById($(".listitem")[index].id, 5, "large");
  }
  else {
    index--;
    player.loadVideoById($(".listitem")[index].id, 5, "large");
  }
}