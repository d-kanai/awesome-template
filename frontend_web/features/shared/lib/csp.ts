import { headers } from "next/headers";

/**
 * Get the CSP nonce from request headers
 * The nonce is generated in proxy.ts (middleware) and passed via x-nonce header
 */
export async function getNonce(): Promise<string> {
  const headersList = await headers();
  return headersList.get("x-nonce") ?? "";
}
