package com.bodansky.controller;

/*
 * Created by Adam Bodansky on 2017.03.25..
 */

import com.bodansky.domain.Greeting;
import com.bodansky.domain.HelloMessage;
import com.bodansky.domain.MyMood;
import com.bodansky.service.WebSocketService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/websocket")
public class GreetingController {

    private static final Logger log = LoggerFactory.getLogger(GreetingController.class);

    private final WebSocketService webSocketService;

    @Autowired
    public GreetingController(WebSocketService webSocketService) {
        this.webSocketService = webSocketService;
    }

    @GetMapping("/index")
    public String index() {
        log.info("index() - open index.html");
        return "index";
    }

    /*
    *  In @MessageMapping the "/hello" is "/app/hello" but we need only "/hello" because we have a prefix("/app")
    *  what we configure in websocket configuration.
    *
    *  @SendTo tell to us, where the response will go.
    *
    *  All the clients whose subscribed (in app.js) for this mapping will catch this response.
    *
    */

    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public Greeting greeting(HelloMessage message) throws Exception {
        Thread.sleep(1000); // simulated delay
        log.info("greeting() - greeting message sent {}", message);
        webSocketService.sendWelcomeMessage(message);
        return new Greeting("Hello " + message.getName() + "!");
    }

    @MessageMapping("/mood")
    @SendTo("/topic/mood")
    public Greeting mood(MyMood myMood) throws Exception {
        Thread.sleep(1500); // simulated delay
        log.info("greeting() - greeting message sent {}", myMood);
        return new Greeting("My mood is " + myMood.getMyMood().getName() + "!");
    }

    @GetMapping("/other-page")
    public String otherPage() throws InterruptedException {
        log.info("otherPage() - send message from otherPage");
        webSocketService.sendHelloMessageFromOtherPage();
        webSocketService.sendMyMoodFromOtherPage();
        return "other-page";
    }
}
