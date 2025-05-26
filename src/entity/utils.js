export const log = (...args) => {
  console.log(`[ErrorReporter]:`, ...args);
};

export function generateFilename(dataUrl) {
  if (!dataUrl.startsWith("data:")) {
    throw new Error("Not a valid data URL");
  }

  const match = dataUrl.match(/^data:(\w+)\/([\w+]+);base64,/);
  if (!match) {
    throw new Error("Invalid data URL format");
  }

  const type = match[1];
  const ext = match[2];

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  if (type === "image") {
    return `Screenshot-${timestamp}.${ext}`;
  } else if (type === "video") {
    return `Video-${timestamp}.${ext}`;
  } else {
    return `File-${timestamp}.${ext}`;
  }
}

export const ErrorType = Object.freeze({
  SCREENSHOT: "SCREENSHOT",
  VIDEO: "VIDEO",
  NETWORK: 'NETWORK',
});
