@ApplicationModule(
    type = ApplicationModule.Type.OPEN,
    allowedDependencies = {"shared", "features.notification", "features.featureflags"})
package com.example.demo.features.customer.user;

import org.springframework.modulith.ApplicationModule;
