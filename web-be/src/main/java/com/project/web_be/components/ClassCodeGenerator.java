package com.project.web_be.components;

import com.aventrix.jnanoid.jnanoid.NanoIdUtils;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class ClassCodeGenerator {
    private static final char[] ALLOWED_CHARS =
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".toCharArray();

    private static final int CODE_LENGTH = 8;
    private static final SecureRandom random = new SecureRandom();

    public String generate() {
        return NanoIdUtils.randomNanoId(random, ALLOWED_CHARS, CODE_LENGTH);
    }
}
