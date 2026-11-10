---
---
(() => {
  const endpoint = {{ site.pageview_tracker_endpoint | default: "" | jsonify }};
  if (!endpoint) {
    return;
  }

  const pixel = new Image();
  pixel.referrerPolicy = "no-referrer";
  pixel.src = `${endpoint}${endpoint.includes("?") ? "&" : "?"}page=${encodeURIComponent(window.location.pathname)}`;
})();
