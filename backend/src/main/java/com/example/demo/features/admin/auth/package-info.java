@ApplicationModule(
    displayName = "Admin Auth",
    allowedDependencies = {
      "shared",
      "features.featureflags",
      "features.admin.shared :: security",
      "features.admin.shared :: api"
    })
package com.example.demo.features.admin.auth;

import org.springframework.modulith.ApplicationModule;
