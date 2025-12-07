@ApplicationModule(
    allowedDependencies = {
      "shared",
      "features.customer.user :: expose",
      "features.customer.shared :: security",
      "features.customer.shared :: api"
    })
package com.example.demo.features.test;

import org.springframework.modulith.ApplicationModule;
