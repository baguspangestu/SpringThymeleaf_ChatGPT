package com.irvanudin.uas.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.irvanudin.uas.models.MessageModel;
import com.irvanudin.uas.models.OpenAIResponseModel;
import com.irvanudin.uas.models.ResponseModel;
import com.irvanudin.uas.services.OpenAIService;

@RestController
@RequestMapping("/api")
public class APIController {

    private final OpenAIService openAIService;

    public APIController(OpenAIService openAIService) {
        this.openAIService = openAIService;
    }

    @PostMapping("/chat")
    @ResponseBody
    public ResponseModel chat(@RequestBody List<MessageModel> messages) {
        String responseString = openAIService.getMessage(messages);
        ResponseModel response;

        ObjectMapper objectMapper = new ObjectMapper();

        try {
            OpenAIResponseModel openAIResponse = objectMapper.readValue(responseString, OpenAIResponseModel.class);

            String message = openAIResponse.getChoices().get(0).getMessage().getContent();

            response = new ResponseModel(message);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            response = new ResponseModel("Terjadi kesalahan, silakan coba lagi");
        }

        return response;
    }
}
