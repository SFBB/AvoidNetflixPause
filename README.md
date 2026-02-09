# Netflix Auto-Resume Extension (Manifest V3)

This extension automatically clicks the "Continue Watching" button on Netflix when it appears, preventing the stream from pausing automatically.

## How to Install

1. Open Google Chrome.
2. Navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked**.
5. Select the directory containing this project (`AvoidNetflixPause`).

## How it Works

The extension uses a `MutationObserver` to watch the Netflix DOM for specific buttons that appear when Netflix asks if you are still watching. When found, it automatically triggers a click event.

## Supported Selectors

- `button[aria-label="Continue Watching"]`
- `button[aria-label="Keep Watching"]`
- `.postplay-still-watching-button`
- `[data-uia="interrupt-autocomplete-continue"]`
