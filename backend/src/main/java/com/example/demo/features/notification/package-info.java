@ApplicationModule(
    type = ApplicationModule.Type.OPEN,
    allowedDependencies = {"shared", "features.user"})
package com.example.demo.features.notification;

import org.springframework.modulith.ApplicationModule;
