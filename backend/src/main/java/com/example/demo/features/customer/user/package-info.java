@ApplicationModule(
    type = ApplicationModule.Type.OPEN,
    allowedDependencies = {
      "shared",
      "features.notification :: expose",
      "features.featureflags",
      "features.customer.shared :: security",
      "features.customer.shared :: api"
    })
package com.example.demo.features.customer.user;

import org.springframework.modulith.ApplicationModule;
