import { log } from "./utils.js";
import { generateButton } from "../feedbackHTML.js";

export class RecordingControlsUI {
  constructor(logic, modalUI, floatingButtonPosition) {
    this.logic = logic;
    this.modalUI = modalUI;
    this.floatingButtonPosition = floatingButtonPosition;
    this.recordingDiv = null;
    this.startRecordingBtn = null;
    this.issueScreenshotDiv = null;
    this.stopRecordingBtn = null;
    this.issueScreenshotBtn = null;
    this.toggleNetworkBtn = null;
    this.toggleNetworkDiv = null;
    this._createIssueScreenshotButton();
    this._createRecordingControls();
    this._createToggleNetworkButton();
    this.startTimeout = null;
  }

  _createToggleNetworkButton() {
    const tempDiv = document.createElement("div");

    Object.assign(tempDiv.style, {
      position: "fixed",
      bottom: "65px",
      marginBottom: "10px",
      zIndex: "9999",
      right: "20px",
      display: "none",
    });

    const divNetworkLog = document.createElement("div");
    divNetworkLog.innerHTML = generateButton(
      "toggle-network-button",
      "Enable Network"
    ).trim();

    this.toggleNetworkBtn = divNetworkLog.firstElementChild;
    this.toggleNetworkBtn.addEventListener("click", () => {
      this.logic.networkService.toggleNetworkLog();
      if (this.logic.networkService.isNetworkLogEnabled) {
        this.toggleNetworkBtn.innerHTML = "Disable Network";
        log("Network enabled.");
      } else {
        this.toggleNetworkBtn.innerHTML = "Enable Network";
        log("Network disabled.");
      }
    });

    tempDiv.appendChild(divNetworkLog);

    this.toggleNetworkDiv = document.body.appendChild(tempDiv);
  }

  _createRecordingControls() {
    const tempDiv = document.createElement("div");

    Object.assign(tempDiv.style, {
      position: "fixed",
      bottom: "165px",
      marginBottom: "10px",
      right: "20px",
      zIndex: "9999",
      display: "none",
      gap: "10px",
    });

    const divStartRecording = document.createElement("div");
    divStartRecording.innerHTML = generateButton(
      "start-recording-button",
      "Start Recording"
    ).trim();

    const divStopRecording = document.createElement("div");
    divStopRecording.innerHTML = generateButton(
      "stop-recording-button",
      "Stop Recording"
    ).trim();

    this.startRecordingBtn = divStartRecording.firstElementChild;
    this.stopRecordingBtn = divStopRecording.firstElementChild;
    disableButton(this.stopRecordingBtn);

    this.stopRecordingBtn.addEventListener("click", () =>
      this._stopRecording()
    );
    this.startRecordingBtn.addEventListener("click", () =>
      this._startRecording()
    );

    tempDiv.appendChild(divStartRecording);
    tempDiv.appendChild(divStopRecording);

    this.recordingDiv = document.body.appendChild(tempDiv);
  }

  _createIssueScreenshotButton() {
    const tempDiv = document.createElement("div");

    Object.assign(tempDiv.style, {
      position: "fixed",
      bottom: "115px",
      marginBottom: "10px",
      right: "20px",
      zIndex: "9999",
      display: "none",
    });

    const divStartRecording = document.createElement("div");
    divStartRecording.innerHTML = generateButton(
      "issue-screenshot-button",
      "Issue Screenshot"
    ).trim();

    this.issueScreenshotBtn = divStartRecording.firstElementChild;
    this.issueScreenshotBtn.addEventListener("click", () => {
      this._captureScreenshot()
        .then((base64Data) => {
          this.modalUI.previewScreenshot(base64Data);
          this.modalUI.show({ screenshot: true });
        })
        .catch((error) => {
          log("Screenshot error:", error);
        });
    });

    tempDiv.appendChild(divStartRecording);

    this.issueScreenshotDiv = document.body.appendChild(tempDiv);
  }

  toggle() {
    this.recordingDiv.style.display =
      this.recordingDiv.style.display === "none" ? "flex" : "none";
    this.issueScreenshotDiv.style.display =
      this.issueScreenshotDiv.style.display === "none" ? "flex" : "none";
    this.toggleNetworkDiv.style.display =
      this.toggleNetworkDiv.style.display === "none" ? "flex" : "none";
  }

  startCountdown() {
    let countdown = 30;
    this.startCountdown = setInterval(() => {
      this.stopRecordingBtn.innerHTML = `Stop Recording (${Math.floor(
        countdown
      )}s)`;

      countdown -= 1;
      if (countdown < 0) {
        this._stopRecording();
        log("Recording stopped after 30 seconds.");
      }
    }, 1000);
  }

  _startRecording() {
    disableButton(this.startRecordingBtn);
    enableButton(this.stopRecordingBtn);
    log("Start recording clicked.");

    if (!this.logic.isRecording) {
      this.logic.videoData = null;
      this.logic.recordedChunks = [];
      this.logic.recordingStartTime = Date.now();
      navigator.mediaDevices
        .getDisplayMedia({
          video: { displaySurface: "browser" },
          audio: false,
        })
        .then((stream) => {
          this.startCountdown();
          this.logic.mediaRecorder = new MediaRecorder(stream);
          this.logic.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              this.logic.recordedChunks.push(event.data);
            }
          };
          this.logic.mediaRecorder.onstop = () => {
            const blob = new Blob(this.logic.recordedChunks, {
              type: "video/webm",
            });
            console.log("Recording stop:", this.logic.recordedChunks, blob);

            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              this.modalUI.previewVideo(reader.result);
              this.modalUI.show({ video: true });
              log("Recording stopped and video preview available.");
            };
          };
          this.logic.mediaRecorder.start();
          this.logic.isRecording = true;
          log("Recording started.");
        })
        .catch((error) => {
          console.error("Error starting screen recording:", error);
        });
    }
  }

  _stopRecording() {
    disableButton(this.stopRecordingBtn);
    enableButton(this.startRecordingBtn);
    log("Stop recording clicked.");

    if (this.logic.mediaRecorder && this.logic.isRecording) {
      this.logic.mediaRecorder.stop();
      this.logic.mediaRecorder = null;
      this.logic.isRecording = false;
      this.logic.recordingStartTime = null;
      if (this.startCountdown) {
        clearInterval(this.startCountdown);
        this.startCountdown = null;
        this.stopRecordingBtn.innerHTML = "Stop Recording";
      }
      log("Recording stopped.");
    } else {
      log("No recording in progress.");
    }
  }

  async _captureScreenshot() {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { mediaSource: "screen" },
        });

        // Create a video element to capture a frame
        const video = document.createElement("video");
        video.srcObject = stream;

        return new Promise((resolve) => {
          video.onloadedmetadata = () => {
            video.play();

            setTimeout(() => {
              const canvas = document.createElement("canvas");
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;

              const ctx = canvas.getContext("2d");
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

              stream.getTracks().forEach((track) => track.stop());

              resolve(canvas.toDataURL("image/png"));
            }, 1000);
          };
        });
      } else {
        log("Screen capture is not supported in this browser");
      }
    } catch (error) {
      log("Screenshot capture failed:", error);
      throw error;
    }
  }

  updatePosition(position) {
    this.floatingButtonPosition = position;
    this.recordingDiv.style.right = `${position.right}px`;
    this.issueScreenshotDiv.style.right = `${position.right}px`;
    this.toggleNetworkDiv.style.right = `${position.right}px`;
  }
}

function disableButton(btn) {
  btn.disabled = true;
  btn.style.opacity = "0.5";
  btn.style.cursor = "not-allowed";
}

function enableButton(btn) {
  btn.disabled = false;
  btn.style.opacity = "1";
  btn.style.cursor = "pointer";
}
