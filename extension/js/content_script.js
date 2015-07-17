(function () {
  "use strict";

  /**
   *
   * @param text
   */
  function copyToClipboard(text) {
    var textArea = document.createElement('textarea');

    textArea.textContent = text;
    textArea.setAttribute('style', 'position: absolute; top: -10000px; left: -10000px');
    document.body.appendChild(textArea);

    textArea.select();
    document.execCommand('copy');
  }

  /**
   *
   * @returns {boolean}
   */
  function isOnEventPage() {
    return window.location.hash.includes("eventpage_6") && retrieveEventId() != 'newEvent'; // we don't care about new events
  }

  /**
   *
   * @returns {string}
   */
  function retrieveEventId() {
    var eventElement = document.querySelector('.ep');
    if (!eventElement) {
      return null;
    }
    return eventElement.dataset.eid;
  }

  /**
   *
   * @returns {string}
   */
  function retrieveEventUrl() {
    return 'https://www.google.com/calendar/render?eid=' + retrieveEventId();
  }

  /**
   * Takes care of inserting copy url button
   * also adds click handler and triggers copy + UI feedback
   */
  function handleUi() {
    var buttonText = 'Copy event URL';
    // create button copy url node
    var button = (function () {
      var buttonTemplate = `<div id=":999.copy_url_top" class="ep-ea-btn-wrapper">&nbsp;<div class="goog-inline-block goog-imageless-button" role="button" tabindex="0" style="-webkit-user-select: none;"><div class="goog-inline-block goog-imageless-button-outer-box"><div class="goog-inline-block goog-imageless-button-inner-box"><div class="goog-imageless-button-pos"><div class="goog-imageless-button-top-shadow">&nbsp;</div><div class="goog-imageless-button-content">${buttonText}</div></div></div></div></div></div>`;
      var button = document.createElement('div');
      button.innerHTML = buttonTemplate;
      return button.childNodes[0];
    })();

    // container where all the action buttons are in like save, discard etc
    var buttonContainer = document.querySelector('.ep-ea');
    var lastButton = buttonContainer.querySelector('.ep-ea-btn-wrapper:last-of-type');

    // insert button after the last button
    buttonContainer.insertBefore(button, lastButton.nextSibling);
    var buttonTextContainer = button.querySelector('.goog-imageless-button-content');

    button.addEventListener('click', function () {
      var eventUrl = retrieveEventUrl();
      var confirmButtonText = buttonText + ' ✔';
      copyToClipboard(eventUrl);
      buttonTextContainer.textContent = confirmButtonText;

      window.setTimeout(function () {
        buttonTextContainer.textContent =  buttonText;
      }, 5000);
    });

  }


  function onload() {
    if (isOnEventPage()) {
      handleUi();
    }
  }

  window.addEventListener('hashchange', function () {
    // delay execution, because DOM might not be ready immediately
    // after event was fired
    window.setTimeout(function () {
      onload();
    }, 250);
  });

  onload();
})();
