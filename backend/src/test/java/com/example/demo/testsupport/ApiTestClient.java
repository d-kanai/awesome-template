package com.example.demo.testsupport;

import com.example.demo.shared.api.ApiVersion;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import tools.jackson.databind.ObjectMapper;

/** Utility for sending HTTP requests in MVC tests. */
@Component
public class ApiTestClient {

  private final MockMvc mockMvc;
  private final ObjectMapper objectMapper;

  public ApiTestClient(final MockMvc mockMvc, final ObjectMapper objectMapper) {
    this.mockMvc = mockMvc;
    this.objectMapper = objectMapper;
  }

  private String versioned(final String url) {
    return ApiVersion.V1 + url;
  }

  public ApiTestResponse post(final String url, final Object body) throws Exception {
    return new ApiTestResponse(
        mockMvc.perform(
            MockMvcRequestBuilders.post(versioned(url))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body))),
        objectMapper);
  }

  public ApiTestResponse get(final String url) throws Exception {
    return new ApiTestResponse(
        mockMvc.perform(MockMvcRequestBuilders.get(versioned(url))), objectMapper);
  }

  public ApiTestResponse put(final String url, final Object body) throws Exception {
    return new ApiTestResponse(
        mockMvc.perform(
            MockMvcRequestBuilders.put(versioned(url))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body))),
        objectMapper);
  }

  public ApiTestResponse getWithAuth(final String url, final String token) throws Exception {
    return new ApiTestResponse(
        mockMvc.perform(
            MockMvcRequestBuilders.get(versioned(url)).header("Authorization", "Bearer " + token)),
        objectMapper);
  }

  public ApiTestResponse putWithAuth(final String url, final Object body, final String token)
      throws Exception {
    return new ApiTestResponse(
        mockMvc.perform(
            MockMvcRequestBuilders.put(versioned(url))
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body))),
        objectMapper);
  }
}
