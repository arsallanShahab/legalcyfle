// Device ID utility for anonymous user tracking
export const generateDeviceId = (): string => {
  return "device_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
};

export const getDeviceId = (): string => {
  if (typeof window === "undefined") {
    return "";
  }

  let deviceId = localStorage.getItem("legalcyfle_device_id");

  if (!deviceId) {
    deviceId = generateDeviceId();
    localStorage.setItem("legalcyfle_device_id", deviceId);
  }

  return deviceId;
};

export const clearDeviceId = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("legalcyfle_device_id");
  }
};

// Device preferences for articles
export const getDevicePreferences = () => {
  if (typeof window === "undefined") {
    return { likedArticles: [], dislikedArticles: [], heartedArticles: [] };
  }

  const preferences = localStorage.getItem("legalcyfle_device_preferences");
  return preferences
    ? JSON.parse(preferences)
    : { likedArticles: [], dislikedArticles: [], heartedArticles: [] };
};

export const updateDevicePreferences = (
  articleSlug: string,
  action: "like" | "dislike" | "heart",
  isActive: boolean,
) => {
  if (typeof window === "undefined") return;

  const preferences = getDevicePreferences();
  const actionKey =
    action === "like"
      ? "likedArticles"
      : action === "dislike"
        ? "dislikedArticles"
        : "heartedArticles";

  if (isActive) {
    if (!preferences[actionKey].includes(articleSlug)) {
      preferences[actionKey].push(articleSlug);
    }
  } else {
    preferences[actionKey] = preferences[actionKey].filter(
      (slug: string) => slug !== articleSlug,
    );
  }

  // Remove from other actions to prevent conflicts
  if (action === "like" && isActive) {
    preferences.dislikedArticles = preferences.dislikedArticles.filter(
      (slug: string) => slug !== articleSlug,
    );
    preferences.heartedArticles = preferences.heartedArticles.filter(
      (slug: string) => slug !== articleSlug,
    );
  } else if (action === "dislike" && isActive) {
    preferences.likedArticles = preferences.likedArticles.filter(
      (slug: string) => slug !== articleSlug,
    );
    preferences.heartedArticles = preferences.heartedArticles.filter(
      (slug: string) => slug !== articleSlug,
    );
  } else if (action === "heart" && isActive) {
    preferences.likedArticles = preferences.likedArticles.filter(
      (slug: string) => slug !== articleSlug,
    );
    preferences.dislikedArticles = preferences.dislikedArticles.filter(
      (slug: string) => slug !== articleSlug,
    );
  }

  localStorage.setItem(
    "legalcyfle_device_preferences",
    JSON.stringify(preferences),
  );
};

export const checkDevicePreference = (
  articleSlug: string,
  action: "like" | "dislike" | "heart",
): boolean => {
  const preferences = getDevicePreferences();
  const actionKey =
    action === "like"
      ? "likedArticles"
      : action === "dislike"
        ? "dislikedArticles"
        : "heartedArticles";
  return preferences[actionKey].includes(articleSlug);
};
