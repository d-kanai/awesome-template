@ApplicationModule(
    type = ApplicationModule.Type.OPEN,
    displayName = "Admin Auth",
    allowedDependencies = {"shared", "features.featureflags"})
package com.example.demo.features.admin.auth;

import org.springframework.modulith.ApplicationModule;
