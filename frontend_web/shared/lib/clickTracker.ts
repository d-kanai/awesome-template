/**
 * Click event tracking using Beacon API
 */

export type ClickEvent = {
  id?: string;
  label?: string;
  pathname: string;
  timestamp: string;
};

/**
 * Send click event to /api/log/click using Beacon API
 *
 * @param event - Click event data
 *
 * @example
 * sendClickEvent({
 *   id: "submit-button",
 *   label: "サインイン",
 *   pathname: "/auth/signin",
 *   timestamp: new Date().toISOString(),
 * });
 */
export function sendClickEvent(event: ClickEvent): void {
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    navigator.sendBeacon("/api/log/click", JSON.stringify(event));
  }
}
