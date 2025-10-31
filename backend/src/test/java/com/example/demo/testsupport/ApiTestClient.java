package com.example.demo.testsupport;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

/** Utility for sending HTTP requests in MVC tests. */
@Component
public class ApiTestClient {

  private final MockMvc mockMvc;
  private final ObjectMapper objectMapper;

  public ApiTestClient(final MockMvc mockMvc, final ObjectMapper objectMapper) {
    this.mockMvc = mockMvc;
    this.objectMapper = objectMapper;
  }

  public ApiTestResponse post(final String url, final Object body) throws Exception {
    return new ApiTestResponse(
        mockMvc.perform(
            MockMvcRequestBuilders.post(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body))),
        objectMapper);
  }

  public ApiTestResponse get(final String url) throws Exception {
    return new ApiTestResponse(mockMvc.perform(MockMvcRequestBuilders.get(url)), objectMapper);
  }
}
