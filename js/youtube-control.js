var player,
    youtubeTimer,
    globalVideoID = '',
    time_update_interval = 0;



function onYouTubeIframeAPIReady(videoID) {

    if(videoID) {
        globalVideoID = videoID;
    }

    clearTimeout(youtubeTimer);

    if ( typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined' || !YT.loaded) {

        // console.log('YouTube Player API is still loading.  Retrying...');
        youtubeTimer = setTimeout(function(){
            onYouTubeIframeAPIReady(videoID);
        },
        1000);

    } else {
        // console.log('YouTube Player API is loaded.');
        createYoutubePlayer();
    }
};

function createYoutubePlayer(videoID){

    // console.log(globalVideoID);

    player = new YT.Player('youtube-placeholder', {
        width: '100%',
        height: '100%',
        // videoId: videoID,
        videoId: globalVideoID,
        rel: 0,
        showinfo: 0,
        autohide: 1,
        modestbranding: 0,
        playerVars: {
            // videoId: videoID,
            videoId: globalVideoID,
            color: 'white',
            // playlist: [videoID],
            autoplay: 0,
            controls: 1,
            showinfo: 0,
            rel: 0,
            autohide: 1,
            modestbranding: 1,
            loop: 0,
        },
        events: {
            onReady: initialize
        }
    });

}

// function onYouTubeIframeAPIReady(videoID) {
//     console.log('onYouTubeIframeAPIReady');

//     player = new YT.Player('youtube-placeholder', {
//         width: '100%',
//         height: '100%',
//         videoId: videoID,
//         rel: 0,
//         showinfo: 0,
//         autohide: 1,
//         modestbranding: 0,
//         playerVars: {
//             color: 'white',
//             playlist: [videoID],
//             autoplay: 1,
//             controls: 0,
//             showinfo: 0,
//             rel: 0,
//             showinfo: 0,
//             autohide: 1,
//             modestbranding: 1,
//             loop: 1,
//         },
//         events: {
//             onReady: initialize
//         }
//     });
// }

function initialize(event){

    // Update the controls on load
    updateTimerDisplay();
    updateProgressBar();

    // Clear any old interval.
    clearInterval(time_update_interval);

    // Start interval to update elapsed time display and
    // the elapsed part of the progress bar every second.
    time_update_interval = setInterval(function () {
        updateTimerDisplay();
        updateProgressBar();
    }, 1000);


    $('#volume-input').val(Math.round(player.getVolume()));
}


// This function is called by initialize()
function updateTimerDisplay(){
    // Update current time text display.
    $('#current-time').text(formatTime( player.getCurrentTime() ));
    $('#duration').text(formatTime( player.getDuration() ));
}


// This function is called by initialize()
function updateProgressBar(){
    // Update the value of our progress bar accordingly.
    $('#progress-bar').val((player.getCurrentTime() / player.getDuration()) * 100);

    $('#progress-bar').css({
        'backgroundSize': ((player.getCurrentTime() / player.getDuration()) * 100 ) * 100 / 100 + '% 100%'
      });
}


// Progress bar
$('#progress-bar').on('mouseup touchend', function (e) {
    // Calculate the new time for the video.
    // new time in seconds = total duration in seconds * ( value of range input / 100 )
    var newTime = player.getDuration() * (e.target.value / 100);

    // Skip video to new time.
    player.seekTo(newTime);

});
$('#progress-bar').on('input', function(e){
	e.stopPropagation();
  var min = e.target.min,
      max = e.target.max,
      val = e.target.value;

  $(e.target).css({
    'backgroundSize': (val - min) * 100 / (max - min) + '% 100%'
  });
}).trigger('input');

// Playback

$('#play').on('click', function (e){
	e.stopPropagation();
	player.playVideo();
});

$('#pause').on('click', function (e){
	e.stopPropagation();
	player.pauseVideo();
});


// Sound volume


$('#mute-toggle').on('click', function() {
    var mute_toggle = $(this);

    if(player.isMuted()){
        player.unMute();
        mute_toggle.text('volume_up');
    }
    else{
        player.mute();
        mute_toggle.text('volume_off');
    }
});

$('#volume-input').on('change', function () {
    player.setVolume($(this).val());
});


// Other options


$('#speed').on('change', function () {
    player.setPlaybackRate($(this).val());
});

$('#quality').on('change', function () {
    player.setPlaybackQuality($(this).val());
});


// Playlist

$('#next').on('click', function () {
    player.nextVideo()
});

$('#prev').on('click', function () {
    player.previousVideo()
});


// Load video

$('.thumbnail').on('click', function () {

		var url = $(this).children('img').attr('data-video-id');
		var plist = ['uShf7y6e750','W8LK0-T5doo','Oi31TlVoVls'];

		var new_plist = plist.slice(plist.indexOf(url)).concat(plist.slice(0,plist.indexOf(url)));

    player.loadPlaylist({
			playlist: new_plist
		});
		player.setLoop({
			loopPlaylist: true
		})
    player.playVideo();

});


// Helper Functions

function formatTime(time){
    time = Math.round(time);

    var minutes = Math.floor(time / 60),
        seconds = time - minutes * 60;

    seconds = seconds < 10 ? '0' + seconds : seconds;

    return minutes + ":" + seconds;
}


$('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
});