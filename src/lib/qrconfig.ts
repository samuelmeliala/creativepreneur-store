// Easily change this value for different environments
export const QR_DOMAIN = (() => {
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "http://localhost:3000";
  }
  if (typeof process !== "undefined" && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // return "https://creativepreneur-store-lake.vercel.app"; // Change this to your actual production domain if needed
})();
