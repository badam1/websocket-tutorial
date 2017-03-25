package com.bodansky.service;

/*
 * Created by Adam Bodansky on 2017.03.25..
 */

import com.bodansky.domain.Greeting;
import com.bodansky.domain.HelloMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {


    private static final Logger log = LoggerFactory.getLogger(WebSocketService.class);

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public WebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void testMessageFromService() {
        try {
            Thread.sleep(3000); // just to simulate delay 3 sec
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        HelloMessage message = new HelloMessage("Service Class");
        log.info("testMessageFromService() - testing message sending from a service class {}",message);
        messagingTemplate.convertAndSend("/topic/greetings", new Greeting("Hello " + message.getName() + "!"));
    }
}
