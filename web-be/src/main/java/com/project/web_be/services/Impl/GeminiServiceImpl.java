package com.project.web_be.services.Impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.web_be.services.GeminiService;
import com.project.web_be.dtos.enums.constant;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class GeminiServiceImpl implements GeminiService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.url}")
    private String apiUrl;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.timeout}")
    private int timeout;

    @Value("${gemini.max-retries}")
    private int maxRetries;

    @Override
    public String chat(String message) {
        String prompt = constant.PROMPT + "\n" + message;
        int attempts = 0;
        while (attempts < maxRetries) {
            try {
                String requestBody = "{" +
                        "\"contents\":[{" +
                        "\"parts\":[{" +
                        "\"text\":\"" + prompt.replace("\"", "\\\"") + "\"}]}]}";
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                String urlWithKey = apiUrl + "?key=" + apiKey;
                HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
                ResponseEntity<String> response = restTemplate.postForEntity(urlWithKey, entity, String.class);
                if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                    return extractTextResponse(response.getBody());
                }
                return "Không nhận được phản hồi từ AI.";
            } catch (Exception e) {
                attempts++;
                if (attempts >= maxRetries) {
                    return "Lỗi khi gọi Gemini: " + e.getMessage();
                }
                try { Thread.sleep(500); } catch (InterruptedException ignored) {}
            }
        }
        return "Không thể kết nối tới AI sau nhiều lần thử.";
    }

    private String extractTextResponse(String response) {
        try {
            var root = objectMapper.readTree(response);
            var candidates = root.path("candidates");
            if (candidates.isArray() && candidates.size() > 0) {
                var parts = candidates.get(0).path("content").path("parts");
                if (parts.isArray() && parts.size() > 0) {
                    var text = parts.get(0).path("text").asText();
                    if (text != null && !text.isEmpty()) return text;
                }
            }
            return "Không nhận được phản hồi hợp lệ từ AI.";
        } catch (Exception e) {
            return "Không nhận được phản hồi từ AI.";
        }
    }
} 