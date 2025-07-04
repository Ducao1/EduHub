package com.project.web_be.controllers;

import com.project.web_be.dtos.requests.ChatRequest;
import com.project.web_be.dtos.responses.ChatResponse;
import com.project.web_be.services.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}")
@RequiredArgsConstructor
public class GeminiController {
    private final GeminiService geminiService;

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chatbot(@RequestBody ChatRequest request) {
        try {
            String result = geminiService.chat(request.getMessage());
            System.out.println("Generated result: " + result);
            return ResponseEntity.ok(new ChatResponse(result));
        } catch (Exception e) {
           return ResponseEntity.badRequest().body(new ChatResponse("Đã xảy ra lỗi khi xử lý yêu cầu."+e.getMessage()));
        }
    }
}
