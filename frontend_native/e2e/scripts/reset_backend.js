const http = require("node:http");

// Wait for backend health endpoint
async function waitForBackend() {
  for (let attempt = 1; attempt <= 30; attempt++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get("http://localhost:8080/health", (res) => {
          if (res.statusCode === 200 || res.statusCode === 404) {
            resolve();
          } else {
            reject(new Error(`Unexpected status: ${res.statusCode}`));
          }
        });
        req.on("error", reject);
        req.setTimeout(1000, () => {
          req.destroy();
          reject(new Error("Timeout"));
        });
      });
      return; // Success
    } catch (error) {
      if (attempt === 30) {
        console.error(
          "Backend health endpoint did not respond within 30 seconds",
        );
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

// Reset the backend
async function resetBackend() {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "localhost",
        port: 8080,
        path: "/test/reset",
        method: "POST",
      },
      (res) => {
        if (res.statusCode === 204) {
          resolve();
        } else {
          console.error(`Unexpected reset response status: ${res.statusCode}`);
          process.exit(1);
        }
      },
    );
    req.on("error", reject);
    req.end();
  });
}

// Main execution
(async () => {
  await waitForBackend();
  await resetBackend();
})();
