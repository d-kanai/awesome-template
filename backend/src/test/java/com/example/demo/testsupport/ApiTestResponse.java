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

    ApiTestResponse(ResultActions resultActions, ObjectMapper objectMapper) {
        this.resultActions = resultActions;
        this.objectMapper = objectMapper;
    }

    public ApiTestResponse andExpect(ResultMatcher matcher) throws Exception {
        resultActions.andExpect(matcher);
        return this;
    }

    public ApiTestResponse andDo(ResultHandler handler) throws Exception {
        resultActions.andDo(handler);
        return this;
    }

    public MvcResult andReturn() throws Exception {
        return resultActions.andReturn();
    }

    public JsonNode andReturnBody() throws Exception {
        return objectMapper.readTree(andReturn().getResponse().getContentAsString());
    }

    public <T> T andReturnBody(Class<T> responseType) throws Exception {
        return objectMapper.readValue(andReturn().getResponse().getContentAsString(), responseType);
    }

    public <T> T andReturnBody(TypeReference<T> typeReference) throws Exception {
        return objectMapper.readValue(andReturn().getResponse().getContentAsString(), typeReference);
    }

    public ResultActions actions() {
        return resultActions;
    }
}
