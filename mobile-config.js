window.WES_RUNTIME_CONFIG = {
  // Browser loads ignore this and use the current origin. Native installs use the GitHub-hosted runtime config first,
  // then fall back to the current live tunnel URL if the remote config cannot be reached.
  apiBaseUrl: "https://portion-instruments-positions-clerk.trycloudflare.com/api",
  remoteConfigUrl: "https://raw.githubusercontent.com/PRONO2828/WES/main/client/public/mobile-runtime.json"
};
