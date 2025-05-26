export const generateButton = (id, title, preIcon = "") => ` 
  <button id="${id}"
    style="
      border: none;
      border-radius: 50px;
      padding: 8px 12px;
      font-size: 14px;
      font-weight: 600;
      height: 45px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    "
    onmouseover="if(!this.disabled){this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(0, 0, 0, 0.12)'}"
    onmouseout="if(!this.disabled){this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(0, 0, 0, 0.1)'}"
  
  >
    ${preIcon}
    ${title}
  </button>
`;

export const chatIcon = `<svg xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         stroke-width="2"
         stroke-linecap="round"
         stroke-linejoin="round"
         style="width: 16px; height: 16px;"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8
               8.5 8.5 0 0 1-7.6 4.7
               8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7
               a8.38 8.38 0 0 1-.9-3.8
               8.5 8.5 0 0 1 4.7-7.6
               8.38 8.38 0 0 1 3.8-.9h.5
               a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>`;

export const feedbackModalHTML = `<div style="background-color: #ffffff; border-radius: 12px; width: 100%; max-width: 600px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); margin: 20px; overflow: hidden; position: relative;">
    <div style="padding: 20px 24px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
        <h3 style="font-size: 18px; font-weight: 600; margin: 0;">Send Feedback</h3>
        <button style="background: transparent; border: none; cursor: pointer; color: #6b7280; padding: 8px; border-radius: 6px; display: flex; align-items: center; justify-content: center;" id="close-feedback-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    </div>
    <div style="padding: 24px;">
        <form style="display: flex; flex-direction: column; gap: 20px;" id="feedback-form">
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <label for="feedback-subject" style="font-weight: 500; font-size: 14px;">Subject</label>
              <input id="feedback-subject" placeholder="Please provide a subject" required style="padding: 10px 12px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;"></input>
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <label for="feedback-description" style="font-weight: 500; font-size: 14px;">Description</label>
              <textarea id="feedback-description" placeholder="Please provide details of what happened or what you'd like to see" required style="padding: 10px 12px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px; min-height: 100px; resize: vertical;"></textarea>
            </div>
            <!--
            <div style="display: flex; flex-direction: column; gap: 6px;">
                <div class="capture-options">
                    <div class="capture-option">
                        <input type="checkbox" id="include-screenshot" checked>
                        <label for="include-screenshot">Include Screenshot</label>
                    </div>
                </div>
            </div>
            -->
            <div
              id="screenshot-preview"
              style="
                margin-top: 12px;
                display: none;
                flex-direction: column;
                gap: 8px;
              "
            >
              <label>Screenshot Preview</label>
              <img
                id="screenshot-image"
                alt="Screenshot preview"
                style="
                  max-width: 100%;
                  border-radius: 6px;
                  border: 1px solid #e5e7eb;
                "
              />
            </div>
            <div
              id="video-preview"
              style="
                margin-top: 12px;
                display: none;
                flex-direction: column;
                gap: 8px;
              "
            >
              <label>Video Preview</label>
              <video
                id="video-preview-tag"
                alt="Video preview"
              />
            </div>
        </form>
        <div id="error-message" style="color: red; font-size: 14px; margin-top: 10px; display: none;">
          An error occurred while submitting feedback.
        </div>
    <div style="padding: 16px 24px; border-top: 1px solid #e5e7eb; display: flex; justify-content: flex-end; gap: 12px;">
        <button type="button" id="cancel-btn" class="btn btn-secondary">Cancel</button>
        <button type="button" id="submit-btn" class="btn btn-primary">Submit Feedback</button>
    </div>
</div>
`;
