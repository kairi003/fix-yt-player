// ==UserScript==
// @name         FixYTPlayer
// @namespace    https://github.com/kairi003/
// @version      1.0
// @description  Fix an YouTube player on window.
// @author       kairi003
// @match        https://www.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://github.com/kairi003/fix-ytplayer/raw/master/userscript/fix-yt-player.user.js
// @downloadURL  https://github.com/kairi003/fix-ytplayer/raw/master/userscript/fix-yt-player.user.js
// @run-at       document-end
// ==/UserScript==

{
  // Define constants
  const SUFFIX = '_FixYTPlayer';
  const PIN_ID = 'pin' + SUFFIX;
  const FIXED_CLS = 'fixed' + SUFFIX;

  // Insert the static style tag
  document.head.insertAdjacentHTML(
    "beforeend",
    `<style>
  #${PIN_ID} {
    display: block;
    margin: 10px;
    position: absolute;
    top: 0;
    left: 0;
    width: 30px;
    height: 30px;
    z-index: 1200;
    
    visibility: hidden;
    opacity: 0;
    transition: all 0.3s;
    
    fill: #555;
    fill-opacity: .85;
    stroke: white;
    stroke-opacity: .3;
    stroke-width: 4px;
  }
  #player-container:hover #${PIN_ID} {
    visibility: visible;
    opacity: 1;
  }
  body.${FIXED_CLS} #${PIN_ID} {
    fill: #fff;
    stroke: black;
  }
  #${PIN_ID}:hover {
    fill-opacity: .95;
  }

  body.${FIXED_CLS} #player-theater-container {
    position: fixed !important;
    z-index: 10000;
  }
  body.${FIXED_CLS} #player {
    position: fixed !important;
    width: 100%;
    height: var(--player-height);
    z-index: 10000;
  }
  body.${FIXED_CLS} #below {
    padding-top: var(--player-height);
  }
  </style>`
  );

  // Insert the dynamic style tag
  const dynamicStyle = document.createElement("style");
  document.head.appendChild(dynamicStyle);
  
  // Set fixed status from localStorage
  document.body.classList.toggle(FIXED_CLS, +localStorage[FIXED_CLS]);
  window.addEventListener("storage", (event) => {
    if (event.key == FIXED_CLS)
      document.body.classList.toggle(FIXED_CLS, +event.newValue);
  });

  // Create the pin element
  const pin = document.createElement("div");
  pin.id = PIN_ID;
  pin.innerHTML = `<svg height="100%" width="100%" viewBox="0 0 100 100" version="1.1"><path d="M69.498 0 57.471 12.027l4.0449 4.0469-13.943 13.943c-11.309-2.1215-23.726 1.3709-32.141 9.2508-6.2204 4.3128 3.4082 8.0412 5.8102 11.946 2.8462 3.3845 7.7486 6.663 9.3061 10.151-10.183 12.878-20.365 25.756-30.548 38.634 13.032-10.31 26.075-20.606 39.1-30.924 6.2845 6.2852 12.569 12.57 18.854 18.855 9.1584-9.087 14.625-22.6 12.029-35.504l13.943-13.943 4.0469 4.0449 12.027-12.027c-10.079-10.254-20.24-20.438-30.502-30.502z"></path></svg>`;
  pin.addEventListener("click", (event) => {
    const status = document.body.classList.toggle(FIXED_CLS);
    localStorage[FIXED_CLS] = +status;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  });

  // Define video.style.height Observer
  const callback = ([mutation]) => {
    const height = mutation.target?.style?.height;
    dynamicStyle.textContent = `:root {--player-height: ${height};}`;
  };
  const observer = new MutationObserver(callback);

  // Wait until the video exists
  const intervalID = setInterval(() => {
    const video = document.querySelector(
      "#player-container #ytd-player video.html5-main-video"
    );
    if (video) {
      clearInterval(intervalID);
      observer.observe(video, { attributes: true, attributeFilter: ["style"] });
      callback([{ target: video }]);
      video.parentElement.insertBefore(pin, video);
    }
  }, 100);
}
