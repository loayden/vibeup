"use client";

import { useEffect, useState } from "react";

type DeviceProfile = {
  hasMounted: boolean;
  isMobile: boolean;
  isLowEndDevice: boolean;
  prefersReducedMotion: boolean;
  shouldUseLiteMedia: boolean;
};

function getProfile(): Omit<DeviceProfile, "hasMounted"> {
  if (typeof window === "undefined") {
    return {
      isMobile: false,
      isLowEndDevice: false,
      prefersReducedMotion: false,
      shouldUseLiteMedia: false,
    };
  }

  const width = window.innerWidth;
  const navigatorMemory = navigator as Navigator & { deviceMemory?: number };
  const navigatorConnection = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = width < 768;
  const isSlowConnection =
    navigatorConnection.connection?.saveData === true ||
    navigatorConnection.connection?.effectiveType === "slow-2g" ||
    navigatorConnection.connection?.effectiveType === "2g" ||
    navigatorConnection.connection?.effectiveType === "3g";
  const isLowEndDevice =
    typeof navigatorMemory.deviceMemory === "number" &&
    navigatorMemory.deviceMemory <= 2;

  return {
    isMobile,
    isLowEndDevice,
    prefersReducedMotion: reducedMotion,
    shouldUseLiteMedia: isMobile || isLowEndDevice || reducedMotion || isSlowConnection,
  };
}

export function useDeviceProfile(): DeviceProfile {
  const [profile, setProfile] = useState<DeviceProfile>({
    hasMounted: false,
    isMobile: false,
    isLowEndDevice: false,
    prefersReducedMotion: false,
    shouldUseLiteMedia: true,
  });

  useEffect(() => {
    const updateProfile = () => {
      setProfile({
        hasMounted: true,
        ...getProfile(),
      });
    };

    updateProfile();
    window.addEventListener("resize", updateProfile, { passive: true });

    return () => {
      window.removeEventListener("resize", updateProfile);
    };
  }, []);

  return profile;
}
