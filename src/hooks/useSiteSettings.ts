"use client";

import { useEffect, useState } from "react";
import { SITE_SETTINGS_DEFAULT, type SiteSettings } from "@/data/siteSettings";

export function useSiteSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(SITE_SETTINGS_DEFAULT);

  useEffect(() => {
    let ignore = false;
    const lang = new URLSearchParams(window.location.search).get("lang") === "en" ? "en" : "ja";
    fetch(`/api/public/site-settings?lang=${lang}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: SiteSettings | null) => {
        if (!ignore && data) setSettings(data);
      })
      .catch(() => {
        // Defaults keep the UI stable when Firestore is unavailable.
      });

    return () => {
      ignore = true;
    };
  }, []);

  return settings;
}
