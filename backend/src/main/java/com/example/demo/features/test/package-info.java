@ApplicationModule(
    type = ApplicationModule.Type.OPEN,
    allowedDependencies = {"shared", "features.user"})
package com.example.demo.features.test;

import org.springframework.modulith.ApplicationModule;
