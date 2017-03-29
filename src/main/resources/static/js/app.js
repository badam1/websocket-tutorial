/*
 * Created by Adam Bodansky on 2017.03.25..
 */

var stompClient = null;

// window on load
$(function () {

    preventFormDefault();
    bindConnectBtn();
    bindSendBtn();
    bindDisconnectBtn();

});

function preventFormDefault() {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
}

function bindConnectBtn() {
    $("#connect").on('click', function () {
        connect();
    });
}

function bindDisconnectBtn() {
    $("#disconnect").on('click', function () {
        disconnect();
    });
}

function bindSendBtn() {
    $("#send").on('click', function () {
        sendName();
        sendMyMood();
    });
}

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

// create websocket connection
function connect() {
    var socket = new SockJS('/websocket-test');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        doSubscribes();
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function doSubscribes() {

    stompClient.subscribe('/topic/greetings', function (greeting) {
        // fire this function when message come to this subscribed mapping
        showGreeting(JSON.parse(greeting.body).content);
    });
    stompClient.subscribe('/topic/mood', function (myMood) {
        // fire this function when message come to this subscribed mapping
        showMyMood(JSON.parse(myMood.body).content);
    });
    stompClient.subscribe('/topic/welcome',function (message) {
        // fire this function when message come to this subscribed mapping
        showWelcomeMessage(JSON.parse(message.body).content);
    })
}

function sendName() {
    stompClient.send("/app/hello", {}, JSON.stringify({'name': $("#name").val()}));
}

function sendMyMood() {
    stompClient.send("/app/mood", {}, JSON.stringify({'myMood': $("#mood").val()}));
}

function showGreeting(message) {
    $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

function showMyMood(myMood) {
    $("#greetings").append("<tr><td>" + myMood + "</td></tr>");
}

function showWelcomeMessage(message) {
    $("#welcome").html("<h1>" + message + "</h1>");
}