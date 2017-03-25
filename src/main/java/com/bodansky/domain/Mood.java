package com.bodansky.domain;

/*
 * Created by Adam Bodansky on 2017.03.25..
 */

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public enum Mood {

    BAD("Bad"),
    GOOD("Good"),
    SUPER("Super"),
    SAD("Sad");

    private String name;
}
