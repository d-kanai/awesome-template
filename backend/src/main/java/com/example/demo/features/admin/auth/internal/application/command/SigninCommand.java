package com.example.demo.features.admin.auth.internal.application.command;

import com.example.demo.features.admin.auth.internal.domain.model.Admin;
import com.example.demo.features.admin.auth.internal.domain.repository.AdminRepository;
import com.example.demo.shared.exception.ApplicationLayerException;
import com.example.demo.shared.security.admin.AdminJwtTokenProvider;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("adminSigninCommand")
@Transactional(readOnly = true)
public class SigninCommand {

  private final AdminRepository adminRepository;
  private final AdminJwtTokenProvider adminJwtTokenProvider;

  public SigninCommand(
      final AdminRepository adminRepository, final AdminJwtTokenProvider adminJwtTokenProvider) {
    this.adminRepository = adminRepository;
    this.adminJwtTokenProvider = adminJwtTokenProvider;
  }

  public Output execute(final Input input) {
    final Admin admin =
        adminRepository
            .findByEmail(input.email())
            .orElseThrow(() -> new ApplicationLayerException("Invalid email or password"));

    if (!admin.getPassword().equals(input.password())) {
      throw new ApplicationLayerException("Invalid email or password");
    }

    final String token =
        adminJwtTokenProvider.generateToken(admin.getId().value().toString(), admin.getEmail());

    return new Output(admin, token);
  }

  public record Input(String email, String password) {}

  public record Output(Admin admin, String accessToken) {}
}
