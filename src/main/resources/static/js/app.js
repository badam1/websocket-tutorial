/*
 * Created by Adam Bodansky on 2017.03.25..
 */

var stompClient = null;

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

function connect() {
    var socket = new SockJS('/websocket-test');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/greetings', function (greeting) {
            showGreeting(JSON.parse(greeting.body).content);
        });
        stompClient.subscribe('/topic/mood', function (myMood) {
            showMyMood(JSON.parse(myMood.body).content);
        });
        stompClient.subscribe('/topic/welcome',function (message) {
            showWelcomeMessage(JSON.parse(message.body).content);
        })
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
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

$(function () {

    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $("#connect").on('click', function () {
        connect();
    });
    $("#disconnect").on('click', function () {
        disconnect();
    });
    $("#send").on('click', function () {
        sendName();
        sendMyMood();
    });
});