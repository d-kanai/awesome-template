package com.example.demo.features.customer.auth.internal.application.command;

import com.example.demo.features.customer.shared.security.CustomerJwtTokenProvider;
import com.example.demo.features.customer.user.expose.ExposedUser;
import com.example.demo.features.customer.user.expose.FindUserByEmailApi;
import com.example.demo.shared.exception.ApplicationLayerException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class SigninCommand {

  private final FindUserByEmailApi findUserByEmailApi;
  private final CustomerJwtTokenProvider customerJwtTokenProvider;

  public SigninCommand(
      final FindUserByEmailApi findUserByEmailApi,
      final CustomerJwtTokenProvider customerJwtTokenProvider) {
    this.findUserByEmailApi = findUserByEmailApi;
    this.customerJwtTokenProvider = customerJwtTokenProvider;
  }

  public Output execute(final Input input) {
    final ExposedUser user =
        findUserByEmailApi
            .execute(input.email())
            .orElseThrow(() -> new ApplicationLayerException("Invalid email or password"));

    if (!user.password().equals(input.password())) {
      throw new ApplicationLayerException("Invalid email or password");
    }

    final String token = customerJwtTokenProvider.generateToken(user.id().toString(), user.email());

    return new Output(user, token);
  }

  public record Input(String email, String password) {}

  public record Output(ExposedUser user, String accessToken) {}
}
