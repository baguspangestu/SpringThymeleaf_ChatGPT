package com.irvanudin.uas.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class APIController {

    @GetMapping("/chat")
    @ResponseBody
    public MyResponse chat() {
        MyResponse response = new MyResponse("Esse fugiat non qui amet fugiat laborum laboris elit sunt et Lorem.");
        return response;
    }
}

class MyResponse {
    private String message;

    public MyResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}