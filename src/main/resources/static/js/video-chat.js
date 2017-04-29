/*
 * Created by Adam Bodansky on 2017.04.29..
 */

"use strict";

var isConnected = false;

$(function () {

    var $message = $("#message");

    showMessage();

    bindLocalCameraBtnOnClick();
    bindRemoteCameraBtnOnClick();

    bindLocalMicrophoneOnClick();
    bindRemoteMicrophoneOnClick();

    bindChangeLocalStreamSize();
    bindChangeRemoteVideoSize();
    
    connect();

    var $body = $("body");

    $body.on("click", ".connectBtn", function () {
        fadeInIconsFadeOutHeader();
        if (!isConnected) {
            $message.fadeOut("slow");
            isConnected = true;
            createConversation("testRoom");
            changeConnectButton(this);
            stompClient.send("/app/connect", {}, JSON.stringify({'content': 'connected to testRoom'}));
        } else {
            $message.fadeOut("slow");
            joinConversation("testRoom");
            changeConnectButton(this);
        }
    });

    $body.on("click", ".disconnectBtn", function () {
        leaveConversation();
        isConnected = false;
        fadeOutIcons(this);
        stompClient.send("/app/leave", {}, JSON.stringify({'content': 'leave room'}));
    });
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

var bindLocalCameraBtnOnClick = function() {
    $('#local-vid').on('click', function () {
        if (localVidFlag === true) {
            enableLocalCamera();
        } else {
            disableLocalCamera();
        }
    });
};

var bindLocalMicrophoneOnClick = function() {
    $('#local-mic').on('click', function () {
        if (localMicFlag === true) {
            enableLocalMicrophone();
        } else {
            disableLocalMicrophone();
        }
    });
};

var bindRemoteCameraBtnOnClick = function() {
    $('#remote-vid').on('click', function () {
        if (remoteVidFlag === true) {
            enableRemoteCamera();
        } else {
            disableRemoteCamera();
        }
    });
};

var bindRemoteMicrophoneOnClick = function() {
    $('#remote-mic').on('click', function () {
        if (remoteMicFlag === true) {
            enableRemoteMicrophone();
        } else {
            disableRemoteMicrophone();
        }
    });
};

var disableLocalCamera = function() {
    localVidFlag = true;
    $('#local-vid').css('color', 'red');
    console.log("camera off");
    $('.localStream').fadeOut("fast");
    nextRTC.localStream.getVideoTracks()[0].enabled = false;
};

var enableLocalCamera = function() {
    $('#local-vid').css('color', '#222222');
    localVidFlag = false;
    console.log("camera on");
    $('.localStream').fadeIn("fast");
    nextRTC.localStream.getVideoTracks()[0].enabled = true;
};

var enableLocalMicrophone = function() {
    $('#local-mic').css('color', '#222222').removeClass("fa-microphone-slash").addClass("fa-microphone");
    localMicFlag = false;
    nextRTC.localStream.getAudioTracks()[0].enabled = true;
};

var disableLocalMicrophone = function() {
    localMicFlag = true;
    $('#local-mic').css('color', 'red').removeClass("fa-microphone").addClass("fa-microphone-slash");
    nextRTC.localStream.getAudioTracks()[0].enabled = false;
};

var disableRemoteCamera = function() {
    remoteVidFlag = true;
    $('#remote-vid').css('color', 'red');
    console.log("camera off");
    $('.remoteStream').fadeOut("fast");
};

var enableRemoteCamera = function() {
    $('#remote-vid').css('color', '#222222');
    remoteVidFlag = false;
    console.log("camera on");
    $('.remoteStream').fadeIn("fast");
};

var enableRemoteMicrophone = function() {
    $('#remote-mic').css('color', '#222222').removeClass("fa-volume-off").addClass("fa-volume-up");
    remoteMicFlag = false;
    $(".remote-vid").prop('muted', false);
};

var disableRemoteMicrophone = function() {
    remoteMicFlag = true;
    $('#remote-mic').css('color', 'red').removeClass("fa-volume-up").addClass("fa-volume-off");
    $(".remote-vid").prop('muted', true);
};

var videoSizeFlagLoc = false;
var videoSizeFlagRem = false;

var bindChangeLocalStreamSize = function() {
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
};
var bindChangeRemoteVideoSize = function() {
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
};

var fadeInIconsFadeOutHeader = function() {
    $("#local-mic").fadeIn("fast");
    $("#local-vid").fadeIn("fast");
    $("#remote-mic").fadeIn("fast");
    $("#remote-vid").fadeIn("fast");
    $(".header").fadeOut("fast");
    $(".title").fadeIn("slow");
};

var showMessage = function() {
    var $message = $("#message");
    $message.text("Ready to connect!");
    $message.fadeIn("slow");
};

var fadeOutIcons = function(button) {
    $("#local-mic").fadeOut("fast");
    $("#local-vid").fadeOut("fast");
    $("#remote-mic").fadeOut("fast");
    $("#remote-vid").fadeOut("fast");
    $(button).fadeOut("fast");
};

var changeConnectButton = function(button) {
    $(button).removeClass("btn-info")
        .removeClass("connectBtn")
        .addClass("disconnectBtn")
        .addClass("btn-warning")
        .html("Reconnect");
};


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
