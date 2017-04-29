package com.bodansky.domain;

/*
 * Created by Adam Bodansky on 2017.03.25..
 */

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Message {

    private String content;
    private String from;
    private String color;

    public Message(String content) {
        this.content = content;
    }

    public Message(String content, String from) {
        this.content = content;
        this.from = from;
    }
}
