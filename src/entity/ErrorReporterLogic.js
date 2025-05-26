import { ErrorType, log } from "./utils.js";
import { NetworkService } from "./NetworkService.js";

export class ErrorReporterLogic {
  constructor(options = {}) {
    this.options = options;
    this.requestLog = [];
    this.recordedChunks = [];
    this.consoleErrors = [];
    this.isRecording = false;
    this.recordingStartTime = null;
    this.videoData = null;
    this.screenshot = null;
    this.networkService = new NetworkService(this.options.endpoint);
  }

  _addToRequestLog(requestData) {
    this.requestLog.push(requestData);
    log("Request logged:", requestData);
  }
}
