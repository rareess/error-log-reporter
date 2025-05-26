import { ErrorType, log } from "./utils.js";

export class NetworkService {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.originalFetch = window.fetch;
    this.isNetworkLogEnabled = false;
    this.fetch = this.originalFetch.bind(window);
  }

  async sendRequest(data) {
    const body = {
      cmd: "RepoNetworkErrorLog",
      data: {
        operation: "ADD",
        entity: data,
      },
    };
    return new Promise((resolve, reject) => {
      log("Sending network error log to server:", this.endpoint, body);
      this.fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + localStorage.token,
        },
        body: JSON.stringify(body),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    });
  }

  toggleNetworkLog() {
    if (this.isNetworkLogEnabled) {
      this._disableNetworkCapture();
    } else {
      this._setupNetworkCapture();
    }
  }

  _disableNetworkCapture() {
    if (this.isNetworkLogEnabled) {
      window.fetch = this.originalFetch;
      this.isNetworkLogEnabled = false;
      log("Network capture disabled.");
    }
  }

  _setupNetworkCapture() {
    const self = this;
    const originalFetch = window.fetch;

    window.fetch = async function (input, init) {
      const requestData = {
        startTime: Date.now(),
        type: "fetch",
      };

      if (typeof input === "string") {
        requestData.url = input;
      } else if (input instanceof Request) {
        requestData.url = input.url;
      }

      requestData.method = init?.method || "GET";

      if (init?.headers) {
        requestData.requestHeaders =
          init.headers instanceof Headers
            ? Object.fromEntries(init.headers.entries())
            : init.headers;
      }

      if (init?.body) {
        requestData.requestBody = self._truncateRequestBody(init.body);
      }

      try {
        const response = await originalFetch.apply(this, arguments);
        requestData.endTime = Date.now();
        requestData.duration = requestData.endTime - requestData.startTime;

        if (!response.ok) {
          requestData.error = `HTTP error! status: ${response.status}`;
          self.sendLog(requestData);
        }
        return response;
      } catch (error) {
        requestData.endTime = Date.now();
        requestData.duration = requestData.endTime - requestData.startTime;
        requestData.error = error.message;
        self.sendLog(requestData);
        throw error;
      }
    };

    this.isNetworkLogEnabled = true;
    log("Network capture set up for Fetch.");
  }

  sendLog(requestData) {
    log("Sending log:", requestData);
    log("Network service is available.");
    const systemInfo = this.getSystemInfo();
    const requestBody = {
      errorMessage: requestData.error,
      errorType: ErrorType.NETWORK,
      createdDate: new Date(requestData.startTime).toISOString(),
      url: requestData.url,
      requestBody: requestData.requestBody,
      requestHeaders: requestData.requestHeaders,
      requestStartTime: new Date(requestData.startTime).toISOString(),
      requestEndDate: new Date(requestData.endTime).toISOString(),
      requestDuration: requestData.duration,
      requestErrorMessage: requestData.error,
      SystemInfo: systemInfo,
    };
    this.sendRequest(requestBody)
      .then((response) => {
        log("Log sent successfully:", response);
      })
      .catch((error) => {
        log("Error sending log:", error);
      });
  }

  _truncateRequestBody(body) {
    if (!body) return null;

    let bodyStr;
    try {
      if (typeof body === "string") {
        bodyStr = body;
      } else if (body instanceof FormData) {
        return "[FormData]";
      } else if (body instanceof Blob) {
        return `[Blob ${body.size} bytes]`;
      } else if (body instanceof ArrayBuffer) {
        return `[ArrayBuffer ${body.byteLength} bytes]`;
      } else if (typeof body === "object") {
        bodyStr = JSON.stringify(body);
      } else {
        bodyStr = String(body);
      }
    } catch (e) {
      return "[Unparseable body]";
    }

    const maxLength = 1000;
    if (bodyStr.length > maxLength) {
      return (
        bodyStr.substring(0, maxLength) +
        `... [truncated, total length: ${bodyStr.length}]`
      );
    }

    return bodyStr;
  }
  getSystemInfo() {
    const info = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookiesEnabled: navigator.cookieEnabled,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      dpr: window.devicePixelRatio || 1,
    };

    // Try to determine browser and version
    const userAgent = navigator.userAgent;
    const browsers = [
      { name: "Edge", regex: /Edg\/([0-9.]+)/ },
      { name: "Chrome", regex: /Chrome\/([0-9.]+)/ },
      { name: "Firefox", regex: /Firefox\/([0-9.]+)/ },
      { name: "Safari", regex: /Version\/([0-9.]+).*Safari/ },
      { name: "IE", regex: /Trident\/.*rv:([0-9.]+)/ },
      { name: "Opera", regex: /OPR\/([0-9.]+)/ },
    ];

    for (const browser of browsers) {
      const match = userAgent.match(browser.regex);
      if (match) {
        info.browser = browser.name;
        info.browserVersion = match[1];
        break;
      }
    }

    return info;
  }
}
