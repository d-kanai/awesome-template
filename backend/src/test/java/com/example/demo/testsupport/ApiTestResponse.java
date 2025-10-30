package com.example.demo.testsupport;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.ResultHandler;
import org.springframework.test.web.servlet.ResultMatcher;

public class ApiTestResponse {

    private final ResultActions resultActions;
    private final ObjectMapper objectMapper;

    ApiTestResponse(final ResultActions resultActions, final ObjectMapper objectMapper) {
        this.resultActions = resultActions;
        this.objectMapper = objectMapper;
    }

    public ApiTestResponse andExpect(final ResultMatcher matcher) throws Exception {
        resultActions.andExpect(matcher);
        return this;
    }

    public ApiTestResponse andDo(final ResultHandler handler) throws Exception {
        resultActions.andDo(handler);
        return this;
    }

    public MvcResult andReturn() throws Exception {
        return resultActions.andReturn();
    }

    public JsonNode andReturnBody() throws Exception {
        return objectMapper.readTree(andReturn().getResponse().getContentAsString());
    }

    public <T> T andReturnBody(final Class<T> responseType) throws Exception {
        return objectMapper.readValue(andReturn().getResponse().getContentAsString(), responseType);
    }

    public <T> T andReturnBody(final TypeReference<T> typeReference) throws Exception {
        return objectMapper.readValue(andReturn().getResponse().getContentAsString(), typeReference);
    }

    public ResultActions actions() {
        return resultActions;
    }
}
