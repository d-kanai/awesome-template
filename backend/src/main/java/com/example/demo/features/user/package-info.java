@org.springframework.modulith.ApplicationModule(
    allowedDependencies = {
      "shared",
      "features.notification::expose",
      "features.featureflag::expose"
    })
package com.example.demo.features.user;
