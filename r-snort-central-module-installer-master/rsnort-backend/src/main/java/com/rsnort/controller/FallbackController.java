package com.rsnort.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FallbackController {

    @RequestMapping(value = "/{[path:[^\\.]*}")
    public String redirect() {
        // Devuelve el index.html de Angular para rutas que no coincidan
        return "forward:/index.html";
    }
}