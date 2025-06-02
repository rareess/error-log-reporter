import { ErrorReporterLogic, FloatingButtonUI, ModalUI, RecordingControlsUI } from "./entity/index.js";
import { log } from "./entity/utils.js";

export class ErrorReporterBuilder {
  static initialize(options = {}) {
    if (!window.ErrorReporter) {
      window.ErrorReporter = new ErrorReporter(options);
      log("ErrorReporter initialized with options:", options);
      return window.ErrorReporter;
    }
    return window.ErrorReporter;
  }
}

class ErrorReporter {
  constructor(options = {}) {
    if (ErrorReporter.instance) {
      return ErrorReporter.instance;
    }

    this.options = {
      endpoint: options.endpoint,
      ...options,
    };

    this.logic = new ErrorReporterLogic(this.options);
    this.modalUI = new ModalUI(this.logic);
    this.floatingButtonUI = new FloatingButtonUI(
      this.logic,
      this.modalUI
    );

    ErrorReporter.instance = this;
  }
}
