package com.example.demo.shared.logging;

import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

@Component
@RequestScope
public class RequestContext {

  private String traceId;
  private String userId;
  private String env;

  public String getTraceId() {
    return traceId;
  }

  public void setTraceId(final String traceId) {
    this.traceId = traceId;
  }

  public String getUserId() {
    return userId;
  }

  public void setUserId(final String userId) {
    this.userId = userId;
  }

  public String getEnv() {
    return env;
  }

  public void setEnv(final String env) {
    this.env = env;
  }
}
