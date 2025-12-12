// Easily change this value for different environments
export const QR_DOMAIN = typeof window !== "undefined" && window.location.hostname === "localhost"
  ? "http://localhost:3000"
  : "https://domain.com";
