package com.project.web_be.dtos.requests;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatRequest {
    String message;
}
