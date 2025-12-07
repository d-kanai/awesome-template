@ApplicationModule(
    type = ApplicationModule.Type.OPEN,
    allowedDependencies = {"shared", "features.customer.user"})
package com.example.demo.features.test;

import org.springframework.modulith.ApplicationModule;
