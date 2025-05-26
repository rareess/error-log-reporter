import { chatIcon, generateButton } from "../feedbackHTML.js";
import { log } from "./utils.js";

export class FloatingButtonUI {
  constructor(logic, modalUI, recordingControlsUI) {
    this.logic = logic;
    this.modalUI = modalUI;
    this.recordingControlsUI = recordingControlsUI;
    this._createFloatingButton();
  }

  _createFloatingButton() {
    const reportIssueDiv = document.createElement("div");

    Object.assign(reportIssueDiv.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: "9999",
    });

    reportIssueDiv.innerHTML = generateButton(
      "report-issue-button",
      "Report Issue",
      chatIcon
    );
    const reportIssueButton = document.body.appendChild(reportIssueDiv);

    reportIssueButton.addEventListener("click", () => {
      log("Feedback button clicked.");
      this.recordingControlsUI.toggle();
    });

    log("Floating button created.");
  }
}
