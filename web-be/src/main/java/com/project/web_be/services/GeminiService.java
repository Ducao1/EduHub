package com.project.web_be.services;

import com.project.web_be.dtos.requests.ChatRequest;

public interface GeminiService {
    String chat(String message);
}