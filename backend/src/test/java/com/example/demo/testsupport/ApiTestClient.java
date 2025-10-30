package com.example.demo.testsupport;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.test.web.servlet.MockMvc;

@Component
public class ApiTestClient {

    private final MockMvc mockMvc;
    private final ObjectMapper objectMapper;

    public ApiTestClient(MockMvc mockMvc, ObjectMapper objectMapper) {
        this.mockMvc = mockMvc;
        this.objectMapper = objectMapper;
    }

    public ApiTestResponse post(String url, Object body) throws Exception {
        return new ApiTestResponse(mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post(url)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(body))), objectMapper);
    }

    public ApiTestResponse get(String url) throws Exception {
        return new ApiTestResponse(mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get(url)), objectMapper);
    }
}
