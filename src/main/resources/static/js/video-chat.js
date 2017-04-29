/*
 * Created by Adam Bodansky on 2017.04.29..
 */

"use strict";

var isConnected = false;

$(function () {

    var $message = $("#message");
    $message.text("Ready to connect!");
    $message.fadeIn("slow");

    bindLocalCameraBtnOnClick();
    bindRemoteCameraBtnOnClick();

    bindLocalMicrophoneOnClick();
    bindRemoteMicrophoneOnClick();

    bindChangeLocalStreamSize();
    bindChangeRemoteVideoSize();
    
    connect();

    var $body = $("body");

    $body.on("click", ".connectBtn", function () {
        $("#local-mic").fadeIn("fast");
        $("#local-vid").fadeIn("fast");
        $("#remote-mic").fadeIn("fast");
        $("#remote-vid").fadeIn("fast");
        $(".header").fadeOut("fast");
        if (!isConnected) {
            $message.fadeOut("slow");
            isConnected = true;
            createConversation("testRoom");
            $(this).removeClass("btn-info")
                .removeClass("connectBtn")
                .addClass("disconnectBtn")
                .addClass("btn-warning")
                .html("Reconnect");
            stompClient.send("/app/connect", {}, JSON.stringify({'content': 'connected to testRoom'}));
        } else {
            $message.fadeOut("slow");
            joinConversation("testRoom");
            $(this).removeClass("btn-info")
                .removeClass("connectBtn")
                .addClass("disconnectBtn")
                .addClass("btn-warning")
                .html("Reconnect");
        }
    });

    $body.on("click", ".disconnectBtn", function () {
        $("#local-mic").fadeOut("fast");
        $("#local-vid").fadeOut("fast");
        $("#remote-mic").fadeOut("fast");
        $("#remote-vid").fadeOut("fast");
        leaveConversation();
        isConnected = false;
        $(this).fadeOut("fast");
        stompClient.send("/app/leave", {}, JSON.stringify({'content': 'leave room'}));
    });
});

var createConversation = function (roomId) {
    nextRTC.create(roomId);
    console.log('Creating room - roomId : ' + roomId + ' ' + new Date().toLocaleString());
};

var joinConversation = function (roomId) {
    nextRTC.join(roomId);
    console.log('Joining to room - roomId : ' + roomId + ' ' + new Date().toLocaleString());
};

var leaveConversation = function () {
    nextRTC.leave();
};

var nextRTC = new NextRTC({
    wsURL: 'wss://' + location.hostname + (location.port ? ':' + location.port : '') + '/signaling',
    mediaConfig: {
        video: true,
        audio: true,
    },
    peerConfig: {
        iceServers: [
            {urls: "stun:23.21.150.121"},
            {urls: "stun:stun.l.google.com:19302"},
            {urls: "turn:numb.viagenie.ca", credential: "qweqweqwe", username: "mfmtesztuser@gmail.com"}
        ],
        iceTransportPolicy: 'all',
        rtcpMuxPolicy: 'negotiate'
    }
});

nextRTC.on('created', function (nextRTC, event) {
    console.log("room created " + JSON.stringify(event));
});

nextRTC.on('joined', function (nextRTC, event) {
    console.log("joined to room " + JSON.stringify(event));
});

nextRTC.on('newJoined', function (nextRTC, event) {
    console.log("new joined to room " + JSON.stringify(event));
});

nextRTC.on('ready', function (nextRTC, event) {
    console.log("ready " + JSON.stringify(event));
});

nextRTC.on('localStream', function (member, stream) {
    var localStream = $("#localStream");
    var dest = localStream.clone().prop({id: 'local'});
    localStream.replaceWith(dest);
    dest[0].srcObject = stream.stream;
    dest[0].muted = true;
    console.log('Local stream ready.');
});

nextRTC.on('remoteStream', function (member, stream) {
    var remoteStream = $("#remoteStream");
    var dest = remoteStream.clone().prop({id: stream.member});
    remoteStream.replaceWith(dest);
    dest[0].srcObject = stream.stream;
    console.log('Remote stream ready.');
});

nextRTC.on('left', function (nextRTC, event) {
    nextRTC.release(event.from);
    console.log(JSON.stringify(event));
    $('#' + event.from).remove();
    left();
});

nextRTC.on('error', function (nextRTC, event) {
    console.log(JSON.stringify(event));
});


var roomCreated = function () {
    isConnected = true;
};

var left = function () {
    isConnected = false;
    var $message = $("#message");
    $message.text("Disconnected, reloading...")
        .fadeIn("slow");
        setTimeout(function () {
        window.location.reload();
    }, 1500);
};

var localVidFlag = false;
var localMicFlag = false;


var remoteMicFlag = false;
var remoteVidFlag = false;

function bindLocalCameraBtnOnClick() {
    $('#local-vid').on('click', function () {

        if (localVidFlag === true) {
            enableLocalCamera();
        } else {
            disableLocalCamera();
        }
    });
}

function bindLocalMicrophoneOnClick() {
    $('#local-mic').on('click', function () {

        if (localMicFlag === true) {
            enableLocalMicrophone();
        } else {
            disableLocalMicrophone();
        }
    });
}

function bindRemoteCameraBtnOnClick() {
    $('#remote-vid').on('click', function () {

        if (remoteVidFlag === true) {
            enableRemoteCamera();
        } else {
            disableRemoteCamera();
        }
    });
}

function bindRemoteMicrophoneOnClick() {
    $('#remote-mic').on('click', function () {

        if (remoteMicFlag === true) {
            enableRemoteMicrophone();
        } else {
            disableRemoteMicrophone();
        }
    });
}

function disableLocalCamera() {
    localVidFlag = true;
    $('#local-vid').css('color', 'red');
    console.log("camera off");
    $('.localStream').fadeOut("fast");
    nextRTC.localStream.getVideoTracks()[0].enabled = false;
}

function enableLocalCamera() {
    $('#local-vid').css('color', '#222222');
    localVidFlag = false;
    console.log("camera on");
    $('.localStream').fadeIn("fast");
    nextRTC.localStream.getVideoTracks()[0].enabled = true;
}

function enableLocalMicrophone() {
    $('#local-mic').css('color', '#222222').removeClass("fa-microphone-slash").addClass("fa-microphone");
    localMicFlag = false;
    nextRTC.localStream.getAudioTracks()[0].enabled = true;
}

function disableLocalMicrophone() {
    localMicFlag = true;
    $('#local-mic').css('color', 'red').removeClass("fa-microphone").addClass("fa-microphone-slash");
    nextRTC.localStream.getAudioTracks()[0].enabled = false;
}

function disableRemoteCamera() {
    remoteVidFlag = true;
    $('#remote-vid').css('color', 'red');
    console.log("camera off");
    $('.remoteStream').fadeOut("fast");
}

function enableRemoteCamera() {
    $('#remote-vid').css('color', '#222222');
    remoteVidFlag = false;
    console.log("camera on");
    $('.remoteStream').fadeIn("fast");
}

function enableRemoteMicrophone() {
    $('#remote-mic').css('color', '#222222').removeClass("fa-volume-off").addClass("fa-volume-up");
    remoteMicFlag = false;
    $(".remote-vid").prop('muted', false);

}

function disableRemoteMicrophone() {
    remoteMicFlag = true;
    $('#remote-mic').css('color', 'red').removeClass("fa-volume-up").addClass("fa-volume-off");
    $(".remote-vid").prop('muted', true);
}

var videoSizeFlagLoc = false;
var videoSizeFlagRem = false;

function bindChangeLocalStreamSize() {
    $("body").on('click','.loc-vid-2', function () {
        if (!videoSizeFlagLoc) {
            videoSizeFlagLoc = true;
            $(".local-vid-wrapper").removeClass("col-xs-5").removeClass("col-xs-offset-1").addClass("col-xs-9");
            $(".remote-vid-wrapper").removeClass("col-xs-5").removeClass("col-xs-offset-1").addClass("col-xs-3");
            $(".remote-vid").removeClass("rem-vid-2");
        } else {
            $(".remote-vid").addClass("rem-vid-2");
            videoSizeFlagLoc = false;
            $(".local-vid-wrapper").removeClass("col-xs-10").addClass("col-xs-offset-1").addClass("col-xs-5");
            $(".remote-vid-wrapper").removeClass("col-xs-3").addClass("col-xs-offset-1").addClass("col-xs-5");
        }
    });
}
function bindChangeRemoteVideoSize() {
    $("body").on('click','.rem-vid-2', function () {
        if (!videoSizeFlagRem) {
            videoSizeFlagRem = true;
            $(".remote-vid-wrapper").removeClass("col-xs-5").removeClass("col-xs-offset-1").addClass("col-xs-9");
            $(".local-vid-wrapper").removeClass("col-xs-5").removeClass("col-xs-offset-1").addClass("col-xs-3");
            $(".local-vid").removeClass("loc-vid-2");
        } else {
            $(".local-vid").addClass("loc-vid-2");
            videoSizeFlagRem = false;
            $(".remote-vid-wrapper").removeClass("col-xs-10").addClass("col-xs-offset-1").addClass("col-xs-5");
            $(".local-vid-wrapper").removeClass("col-xs-3").addClass("col-xs-offset-1").addClass("col-xs-5");
        }
    });
}