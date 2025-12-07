@ApplicationModule(
    displayName = "Admin Shared",
    allowedDependencies = {"shared"})
@NamedInterface({"security", "api"})
package com.example.demo.features.admin.shared;

import org.springframework.modulith.ApplicationModule;
import org.springframework.modulith.NamedInterface;
