package com.irvanudin.uas.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.irvanudin.uas.models.MessageModel;
import com.irvanudin.uas.models.OpenAIRequestModel;

@Service
public class OpenAIService {
    @Value("${openai.api.token}")
    private String openAIToken;

    private final RestTemplate restTemplate;

    public OpenAIService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private final String root = "https://api.openai.com/v1/chat";

    public String getMessage(List<MessageModel> messages) {
        String url = root + "/completions";

        OpenAIRequestModel openAIRequest = new OpenAIRequestModel();
        openAIRequest.setModel("gpt-3.5-turbo");
        openAIRequest.setMessages(messages);
        openAIRequest.setTemperature(0.5);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openAIToken);

        HttpEntity<OpenAIRequestModel> requestEntity = new HttpEntity<>(openAIRequest, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class);

        return response.getBody();
    }
}
