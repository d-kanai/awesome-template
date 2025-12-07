@ApplicationModule(
    displayName = "Customer Shared",
    allowedDependencies = {"shared"})
@NamedInterface({"security", "api"})
package com.example.demo.features.customer.shared;

import org.springframework.modulith.ApplicationModule;
import org.springframework.modulith.NamedInterface;
