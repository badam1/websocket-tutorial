package com.bodansky.controller;

/*
 * Created by Adam Bodansky on 2017.03.25..
 */

import com.bodansky.domain.Greeting;
import com.bodansky.domain.HelloMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/websocket")
public class GreetingController {

    private static final Logger log = LoggerFactory.getLogger(GreetingController.class);

    @GetMapping("/test")
    public String index() {
        log.info("index() - open index.html");
        return "index";
    }

    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public Greeting greeting(HelloMessage message) throws Exception {
        Thread.sleep(3000); // simulated delay
        return new Greeting("HelloMessage, " + message.getName() + "!");
    }
}
