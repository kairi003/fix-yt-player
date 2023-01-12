// Define constants
const SUFFIX = "_FixYTPlayer";
const PIN_ID = "pin" + SUFFIX;
const FIXED_CLS = "fixed" + SUFFIX;
const ROOT = document.documentElement;

// Set fixed status from localStorage
chrome.storage.local.get(["fixed"], ({ fixed }) =>
  ROOT.classList.toggle(FIXED_CLS, fixed)
);

// Create the pin element
const pin = document.createElement("div");
pin.id = PIN_ID;
pin.innerHTML = `<svg height="100%" width="100%" viewBox="0 0 100 100" version="1.1"><path d="M69.498 0 57.471 12.027l4.0449 4.0469-13.943 13.943c-11.309-2.1215-23.726 1.3709-32.141 9.2508-6.2204 4.3128 3.4082 8.0412 5.8102 11.946 2.8462 3.3845 7.7486 6.663 9.3061 10.151-10.183 12.878-20.365 25.756-30.548 38.634 13.032-10.31 26.075-20.606 39.1-30.924 6.2845 6.2852 12.569 12.57 18.854 18.855 9.1584-9.087 14.625-22.6 12.029-35.504l13.943-13.943 4.0469 4.0449 12.027-12.027c-10.079-10.254-20.24-20.438-30.502-30.502z"></path></svg>`;
pin.addEventListener("click", (event) => {
  const status = ROOT.classList.toggle(FIXED_CLS);
  chrome.storage.local.set({ fixed: status });
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
});

// Define video.style.height Observer
/** @type {MutationCallback} */
const mutationCallback = ([mutation]) => {
  const height = mutation.target?.style?.height;
  ROOT.style.setProperty("--fytp-player-height", height);
};
const heightObserver = new MutationObserver(mutationCallback);

// Define primary-inner.width Observer
/** @type {ResizeObserverCallback} */
const resizeCallback = ([entry]) => {
  const width = entry?.contentBoxSize[0]?.inlineSize ?? 0;
  ROOT.style.setProperty("--fytp-primary-colomn-width", width + "px");
};
const widthObserver = new ResizeObserver(resizeCallback);

// Wait until the video exists
const intervalID = setInterval(() => {
  const video = document.querySelector(
    "#player-container #ytd-player video.html5-main-video"
  );
  const primary = document.getElementById("primary-inner");
  if (video && primary) {
    clearInterval(intervalID);
    heightObserver.observe(video, {
      attributes: true,
      attributeFilter: ["style"],
    });
    mutationCallback([{ target: video }]);
    widthObserver.observe(primary);
    video.parentElement.insertBefore(pin, video);
  }
}, 100);
