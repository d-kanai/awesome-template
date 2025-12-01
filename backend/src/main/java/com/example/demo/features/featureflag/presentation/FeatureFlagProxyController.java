package com.example.demo.features.featureflag.presentation;

import io.getunleash.Unleash;
import io.getunleash.Variant;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** REST controller providing Unleash Proxy compatible endpoints for frontend clients. */
@Tag(name = "フィーチャーフラグ", description = "フィーチャーフラグに関連する操作です")
@RestController
@RequestMapping(value = "/featureflags", produces = MediaType.APPLICATION_JSON_VALUE)
public class FeatureFlagProxyController {

  private final Optional<Unleash> unleash;

  public FeatureFlagProxyController(@Autowired(required = false) final Unleash unleash) {
    this.unleash = Optional.ofNullable(unleash);
  }

  @Operation(
      summary = "フィーチャーフラグ取得 (GET)",
      description = "すべての有効なフィーチャーフラグを取得します。Unleash Proxy互換のエンドポイントです。")
  @ApiResponses({
    @ApiResponse(
        responseCode = "200",
        description = "フィーチャーフラグの取得に成功しました。",
        content =
            @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = ProxyResponse.class)))
  })
  @GetMapping(value = "/proxy")
  public ResponseEntity<ProxyResponse> getFeaturesGet() {
    return getToggles();
  }

  @Operation(
      summary = "フィーチャーフラグ取得 (POST)",
      description = "すべての有効なフィーチャーフラグを取得します。Unleash Proxy互換のエンドポイントです。")
  @ApiResponses({
    @ApiResponse(
        responseCode = "200",
        description = "フィーチャーフラグの取得に成功しました。",
        content =
            @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = ProxyResponse.class)))
  })
  @PostMapping(value = "/proxy", consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<ProxyResponse> getFeaturesPost(
      @RequestBody(required = false) final ProxyRequest request) {
    return getToggles();
  }

  private ResponseEntity<ProxyResponse> getToggles() {
    if (unleash.isEmpty()) {
      // Unleash is disabled, return empty toggles
      return ResponseEntity.ok(new ProxyResponse(Collections.emptyList()));
    }

    final List<FeatureToggle> toggles =
        unleash.get().more().getFeatureToggleNames().stream()
            .map(
                name -> {
                  final boolean enabled = unleash.get().isEnabled(name);
                  final Variant variant = unleash.get().getVariant(name);
                  return new FeatureToggle(name, enabled, variant.getName(), variant.isEnabled());
                })
            .collect(Collectors.toList());

    return ResponseEntity.ok(new ProxyResponse(toggles));
  }

  /** Request body for proxy endpoint. */
  public static class ProxyRequest {
    private String userId;
    private Map<String, String> properties = new HashMap<>();

    public String getUserId() {
      return userId;
    }

    public void setUserId(final String userId) {
      this.userId = userId;
    }

    public Map<String, String> getProperties() {
      return properties;
    }

    public void setProperties(final Map<String, String> properties) {
      this.properties = properties;
    }
  }

  /** Response body for proxy endpoint. */
  public static class ProxyResponse {
    private final List<FeatureToggle> toggles;

    public ProxyResponse(final List<FeatureToggle> toggles) {
      this.toggles = toggles;
    }

    public List<FeatureToggle> getToggles() {
      return toggles;
    }
  }

  /** Feature toggle data transfer object. */
  public static class FeatureToggle {
    private final String name;
    private final boolean enabled;
    private final String variant;
    private final boolean variantEnabled;

    public FeatureToggle(
        final String name,
        final boolean enabled,
        final String variant,
        final boolean variantEnabled) {
      this.name = name;
      this.enabled = enabled;
      this.variant = variant;
      this.variantEnabled = variantEnabled;
    }

    public String getName() {
      return name;
    }

    public boolean isEnabled() {
      return enabled;
    }

    public String getVariant() {
      return variant;
    }

    public boolean isVariantEnabled() {
      return variantEnabled;
    }
  }
}
