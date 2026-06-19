"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

const IDLE_TIMEOUT_MS = 60 * 60 * 1000;
const ACTIVITY_STORAGE_KEY = "admin:lastActivityAt";
const ACTIVITY_EVENTS = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"] as const;

function now() {
  return Date.now();
}

function readLastActivity() {
  const value = window.localStorage.getItem(ACTIVITY_STORAGE_KEY);
  const timestamp = value ? Number(value) : 0;
  return Number.isFinite(timestamp) && timestamp > 0 ? timestamp : null;
}

function writeLastActivity() {
  window.localStorage.setItem(ACTIVITY_STORAGE_KEY, String(now()));
}

export function AdminSessionTimeout() {
  useEffect(() => {
    let signedOut = false;

    const logout = () => {
      if (signedOut) return;
      signedOut = true;
      void signOut({ callbackUrl: "/admin/login?error=session_timeout" });
    };

    const checkIdle = () => {
      const lastActivity = readLastActivity();
      if (lastActivity && now() - lastActivity >= IDLE_TIMEOUT_MS) {
        logout();
      }
    };

    checkIdle();
    if (!readLastActivity()) {
      writeLastActivity();
    }

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, writeLastActivity, { passive: true });
    });

    const intervalId = window.setInterval(checkIdle, 30 * 1000);
    window.addEventListener("focus", checkIdle);
    document.addEventListener("visibilitychange", checkIdle);

    return () => {
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, writeLastActivity);
      });
      window.clearInterval(intervalId);
      window.removeEventListener("focus", checkIdle);
      document.removeEventListener("visibilitychange", checkIdle);
    };
  }, []);

  return null;
}
