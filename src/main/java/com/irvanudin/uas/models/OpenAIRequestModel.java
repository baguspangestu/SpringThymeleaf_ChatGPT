package com.irvanudin.uas.models;

import java.util.List;

public class OpenAIRequestModel {
    private String model;
    private List<MessageModel> messages;
    private double temperature;

    public String getModel() {
      return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public List<MessageModel> getMessages() {
        return messages;
    }

    public void setMessages(List<MessageModel> messages) {
        this.messages = messages;
    }

    public double getTemperature() {
      return temperature;
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }
}