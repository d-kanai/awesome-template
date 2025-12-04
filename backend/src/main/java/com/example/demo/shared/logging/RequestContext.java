package com.example.demo.shared.logging;

import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

@Component
@RequestScope
public class RequestContext {

  @Nullable private String traceId;
  @Nullable private String userId;
  @Nullable private String env;

  public @Nullable String getTraceId() {
    return traceId;
  }

  public void setTraceId(final String traceId) {
    this.traceId = traceId;
  }

  public @Nullable String getUserId() {
    return userId;
  }

  public void setUserId(final String userId) {
    this.userId = userId;
  }

  public @Nullable String getEnv() {
    return env;
  }

  public void setEnv(final String env) {
    this.env = env;
  }
}
