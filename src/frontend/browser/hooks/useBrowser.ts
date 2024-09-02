"use client";

import { BrowserType } from "../types";

const useBrowser = () => {
  // Check if running in browser
  if (typeof window === "undefined" || !navigator) return BrowserType.UNKNOWN;

  // Detect Firefox
  if (navigator.userAgent.includes("Firefox")) return BrowserType.FIREFOX;

  // Detect Safari
  if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) return BrowserType.SAFARI;

  // Default to Chrome
  return BrowserType.CHROME;
};

export default useBrowser;
