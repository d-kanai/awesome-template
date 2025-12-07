package com.example.demo.features.admin.auth.internal.domain.repository;

import com.example.demo.features.admin.auth.internal.domain.model.Admin;
import java.util.Optional;

public interface AdminRepository {

  Optional<Admin> findByEmail(String email);
}
