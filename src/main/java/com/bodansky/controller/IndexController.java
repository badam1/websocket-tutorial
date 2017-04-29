package com.bodansky.controller;

/*
 * Created by Adam Bodansky on 2017.03.29..
 */

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {

    private static final Logger log = LoggerFactory.getLogger(MainController.class);

    @GetMapping("/")
    public String index() {
        log.info("IndexController - index() - redirect to index.html");
        return "redirect:/websocket/index";
    }
}
