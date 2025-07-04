package com.project.web_be.dtos.requests;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GeminiRequest {

    @JsonProperty("contents")
    private List<Content> contents;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Content {
        @JsonProperty("parts")
        private List<Part> parts;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Part {
        private String text;
        @JsonProperty("inlineData")
        private InlineData inlineData;

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class InlineData {
            @JsonProperty("mimeType")
            private String mimeType;
            private String data;
        }
    }
}