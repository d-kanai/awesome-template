// ============================================
// Data Setup Script for Maestro E2E Tests
// ============================================
// Creates test data for specified table
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

// TABLE_NAME must be provided via environment variable
let tableName;
try {
  if (!TABLE_NAME) {
    throw new Error("TABLE_NAME environment variable is required");
  }
  tableName = TABLE_NAME;
} catch (e) {
  throw new Error("TABLE_NAME environment variable is required");
}

console.log(`[Config] Backend URL: ${backendUrl}`);
console.log(`[Config] Table Name: ${tableName}`);

const SETUP_ENDPOINT = `${backendUrl}/test/setup`;

// ============================================
// Data Setup
// ============================================
console.log(`[Setup] Creating test data for table: ${tableName}...`);

const setupResponse = http.post(SETUP_ENDPOINT, {
  body: JSON.stringify({ table: tableName }),
  headers: { "Content-Type": "application/json" },
});
const setupStatusCode = setupResponse.status;

if (setupStatusCode !== 204) {
  throw new Error(`Data setup failed with HTTP ${setupStatusCode}`);
}

console.log(`[Setup] Test data for ${tableName} created successfully ✓`);
