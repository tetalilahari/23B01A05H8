const LOG_API_URL = "http://20.244.56.144/evaluation-service/logs";

let authToken = "";

export function setLoggerToken(token) {
  authToken = token;
}

export async function Log(stack, level, pkg, message) {
  if (!authToken) return;

  const safeMessage = String(message).slice(0, 48);

  try {
    const res = await fetch(LOG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message: safeMessage,
      }),
    });

    if (!res.ok) {
      console.error(`[Logger] Failed: ${res.status}`);
    }
  } catch (err) {
    console.error("[Logger] Network error:", err);
  }
}