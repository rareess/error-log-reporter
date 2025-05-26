import { feedbackModalHTML } from "../feedbackHTML.js";
import { log, generateFilename, ErrorType } from "./utils.js";

export class ModalUI {
  constructor(logic) {
    this.logic = logic;
    this.modal = null;
    this.screenshotPreviewDiv = null;
    this.videoPreviewDiv = null;
    this.submitButton = null;
    this.closeButton = null;
    this.cancelButton = null;
    this.errorDiv = null;
    this._createModal();
  }

  _createModal() {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = feedbackModalHTML;
    this.modal = document.body.appendChild(tempDiv);

    this.closeButton = this.modal.querySelector("#close-feedback-btn");
    this.cancelButton = this.modal.querySelector("#cancel-btn");
    this.submitButton = this.modal.querySelector("#submit-btn");

    [this.closeButton, this.cancelButton].forEach((button) => {
      button.addEventListener("click", () => {
        this.hide();
      });
    });

    this.submitButton.addEventListener("click", () => {
      this.onSubmit();
    });

    Object.assign(this.modal.style, {
      display: "none",
      position: "fixed",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: "10000",
      overflowY: "auto",
      alignItems: "center",
      justifyContent: "center",
    });

    this._initializeInnerDivs(this.modal);

    log("Feedback modal created.");
  }

  _initializeInnerDivs(modal) {
    this.screenshotPreviewDiv = modal.querySelector("#screenshot-preview");
    this.videoPreviewDiv = modal.querySelector("#video-preview");
    this.errorDiv = modal.querySelector("#error-message");
  }

  show(options = { video: false, screenshot: false }) {
    if (options.video) {
      this.showVideoPreview();
    } else if (options.screenshot) {
      this.showScreenshotPreview();
    }
    this.clearForm();
    this.modal.style.display = "flex";
  }

  hide() {
    this.hideScreenshotPreview();
    this.hideVideoPreview();
    this.hideError();
    this.modal.style.display = "none";
  }

  previewVideo(base64Data) {
    this.base64Data = base64Data;
    let videoPreview = this.modal.querySelector("#video-preview-tag");
    videoPreview.controls = true;
    videoPreview.style.width = "100%";
    videoPreview.style.maxWidth = "600px";
    videoPreview.src = base64Data;
    videoPreview.style.display = "block";
  }
  showVideoPreview() {
    this.videoPreviewDiv.style.display = "flex";
  }
  hideVideoPreview() {
    this.videoPreviewDiv.style.display = "none";
    console.log("Video preview hidden.");
  }
  previewScreenshot(base64Data) {
    this.base64Data = base64Data;
    let screenshotImage = this.modal.querySelector("#screenshot-image");
    screenshotImage.src = base64Data;
    screenshotImage.style.display = "block";
  }

  showScreenshotPreview() {
    this.screenshotPreviewDiv.style.display = "flex";
  }
  hideScreenshotPreview() {
    this.screenshotPreviewDiv.style.display = "none";
  }

  enableButtons(enable) {
    if (enable) {
      [this.closeButton, this.cancelButton, this.submitButton].forEach(
        (button) => {
          button.disabled = false;
          button.style.cursor = "pointer";
          button.style.backgroundColor = "#007bff";
          button.style.opacity = "1";
        }
      );
      this.submitButton.innerText = "Submit";
    } else {
      [this.closeButton, this.cancelButton, this.submitButton].forEach(
        (button) => {
          button.disabled = true;
          button.style.cursor = "not-allowed";
          button.style.backgroundColor = "#ccc";
          button.style.opacity = "0.5";
        }
      );
      this.submitButton.innerText = "Submitting...";
    }
  }

  showError(message) {
    this.errorDiv.innerText =
      message || "An error occurred while submitting feedback.";
    this.errorDiv.style.display = "block";
  }

  hideError() {
    this.errorDiv.style.display = "none";
  }

  clearForm() {
    this.modal.querySelector("#feedback-subject").value = "";
    this.modal.querySelector("#feedback-description").value = "";
  }

  onSubmit() {
    const subject = this.modal.querySelector("#feedback-subject").value;
    const description = this.modal.querySelector("#feedback-description").value;

    const systemInfo = this.logic.networkService.getSystemInfo();
    const requestBody = {
      errorMessage: subject,
      errorType: this.base64Data.includes("video")
        ? ErrorType.VIDEO
        : ErrorType.SCREENSHOT,
      detailedExpectedBehavior: description,
      SystemInfo: systemInfo,
      fileName: generateFilename(this.base64Data),
      fileContentBase64: this.base64Data.split("base64,")[1],
    };

    this.enableButtons(false);
    this.logic.networkService
      .sendRequest(requestBody)
      .then((response) => {
        log("Feedback submitted successfully:", response);
        this.hide();
      })
      .catch((error) => {
        log("Error submitting feedback:", error);
        this.showError("Failed to submit feedback. Please try again.");
      })
      .finally(() => {
        this.enableButtons(true);
      });
  }
}
