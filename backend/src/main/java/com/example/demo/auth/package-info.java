@ApplicationModule(
    type = ApplicationModule.Type.OPEN,
    allowedDependencies = {"shared", "user"})
package com.example.demo.auth;

import org.springframework.modulith.ApplicationModule;
