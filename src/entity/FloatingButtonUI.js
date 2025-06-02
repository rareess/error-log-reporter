import { chatIcon, dragAndDropIcon, generateButton } from "../feedbackHTML.js";
import { RecordingControlsUI } from "./RecordingControlsUI.js";
import { log } from "./utils.js";

export class FloatingButtonUI {
  constructor(logic, modalUI) {
    this.logic = logic;
    this.modalUI = modalUI;
    this.position = {
      right: 20,
    };

    this.isOnDrag = false;

    this.recordingControlsUI = new RecordingControlsUI(
      this.logic,
      this.modalUI,
      this.position
    );
    this._createFloatingButton();
  }

  _createFloatingButton() {
    const reportIssueDiv = document.createElement("div");

    Object.assign(reportIssueDiv.style, {
      display: "flex",
      position: "fixed",
      bottom: "20px",
      right: `${this.position.right}px`,
      zIndex: "9999",
    });
    reportIssueDiv.innerHTML = `${dragAndDropIcon(
      "report-issue-button-drag-icon"
    )} ${generateButton("report-issue-button", "Report Issue", chatIcon)}`;

    const reportIssueButton = document.body.appendChild(reportIssueDiv);

    const dragAndDrop = document.getElementById(
      "report-issue-button-drag-icon"
    );

    Object.assign(dragAndDrop.style, {
      display: "none",
      cursor: "grab",
    });

    reportIssueButton.addEventListener("mouseover", () => {
      dragAndDrop.style.display = "block";
    });
    reportIssueButton.addEventListener("mouseout", () => {
      if (!this.isOnDrag) {
        dragAndDrop.style.display = "none";
      }
    });

    const button = document.getElementById("report-issue-button");

    this.registerDragAndDrop(dragAndDrop, reportIssueButton);

    button.addEventListener("click", () => {
      log("Feedback button clicked.");
      this.recordingControlsUI.toggle();
    });

    log("Floating button created.");
  }

  registerDragAndDrop(dragAndDrop, container) {
    dragAndDrop.addEventListener("mousedown", (e) => {
      e.preventDefault();
      const offsetX =
        window.innerWidth - e.clientX - parseInt(container.style.right, 10);
      this.isOnDrag = true;
      const onMouseMove = (e) => {
        const right = window.innerWidth - e.clientX - offsetX;
        if (right > 0 && right + offsetX < window.innerWidth) {
          container.style.right = `${right}px`;
          this.recordingControlsUI.updatePosition({ ...this.position, right });
        }
      };

      document.addEventListener("mousemove", onMouseMove);

      document.addEventListener(
        "mouseup",
        () => {
          document.removeEventListener("mousemove", onMouseMove);
          this.isOnDrag = false;
          dragAndDrop.style.display = "none";
        },
        { once: true }
      );
    });
  }
}
