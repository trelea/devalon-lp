import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["ro", "ru", "en", "es", "da", "de", "fr"],

  // Used when no locale matches
  defaultLocale: "en",

  // We handle locale detection ourselves in proxy.ts (browser → device →
  // geo → en), so disable next-intl's built-in detection.
  localeDetection: false,
});
