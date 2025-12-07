@ApplicationModule(
    type = ApplicationModule.Type.OPEN,
    allowedDependencies = {"shared", "features.user", "features.notification", "features.featureflags"})
package com.example.demo.features.auth;

import org.springframework.modulith.ApplicationModule;
