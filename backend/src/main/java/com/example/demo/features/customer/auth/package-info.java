@ApplicationModule(
    displayName = "Customer Auth",
    allowedDependencies = {
      "shared",
      "features.customer.user :: expose",
      "features.customer.shared :: security",
      "features.customer.shared :: api"
    })
package com.example.demo.features.customer.auth;

import org.springframework.modulith.ApplicationModule;
