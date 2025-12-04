@ApplicationModule(
    type = ApplicationModule.Type.OPEN,
    allowedDependencies = {"shared", "features.user", "features.notification"})
package com.example.demo.features.auth;

import org.springframework.modulith.ApplicationModule;
