// ============================================
// Backend Reset Script for Maestro E2E Tests
// ============================================
// Waits for backend health and resets database
// Uses Maestro's native HTTP API
// ============================================

// Configuration
// BACKEND_URL can be set via environment variable for CI/CD
let backendUrl = "http://localhost:8080";
try {
  // Try to use BACKEND_URL from environment if available
  if (BACKEND_URL) {
    backendUrl = BACKEND_URL;
  }
} catch (e) {
  // BACKEND_URL not defined, use default
}

console.log(`[Config] Backend URL: ${backendUrl}`);

const HEALTH_ENDPOINT = `${backendUrl}/health`;
const RESET_ENDPOINT = `${backendUrl}/test/reset`;
const MAX_HEALTH_ATTEMPTS = 30;
const RETRY_DELAY_MS = 1000;

// ============================================
// Helper: Sleep function
// ============================================
function sleep(ms) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    // Busy wait
  }
}

// ============================================
// Health Check with Retry Logic
// ============================================
let healthReady = false;

for (let attempt = 1; attempt <= MAX_HEALTH_ATTEMPTS; attempt++) {
  try {
    const healthResponse = http.get(HEALTH_ENDPOINT);
    const statusCode = healthResponse.status;

    console.log(`[Health Check] Attempt ${attempt}: HTTP ${statusCode}`);

    if (statusCode === 200 || statusCode === 404) {
      healthReady = true;
      console.log(`[Health Check] Backend is ready (HTTP ${statusCode})`);
      break;
    }
  } catch (e) {
    console.log(`[Health Check] Attempt ${attempt} failed: ${e.message}`);

    if (attempt === MAX_HEALTH_ATTEMPTS) {
      throw new Error(
        `Backend health check failed after ${MAX_HEALTH_ATTEMPTS} attempts: ${e.message}`,
      );
    }
  }

  if (!healthReady && attempt < MAX_HEALTH_ATTEMPTS) {
    sleep(RETRY_DELAY_MS);
  }
}

if (!healthReady) {
  throw new Error("Backend health check failed - backend not responding");
}

// ============================================
// Database Reset
// ============================================
console.log("[Reset] Sending database reset request...");

const resetResponse = http.post(RESET_ENDPOINT, { body: "" });
const resetStatusCode = resetResponse.status;

console.log(`[Reset] Response: HTTP ${resetStatusCode}`);

if (resetStatusCode !== 204) {
  throw new Error(`Database reset failed with HTTP ${resetStatusCode}`);
}

console.log("[Reset] Database reset completed successfully ✓");
