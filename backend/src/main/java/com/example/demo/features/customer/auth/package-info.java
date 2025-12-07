@ApplicationModule(
    type = ApplicationModule.Type.OPEN,
    displayName = "Customer Auth",
    allowedDependencies = {"shared", "features.customer.user", "features.notification"})
package com.example.demo.features.customer.auth;

import org.springframework.modulith.ApplicationModule;
