import type { ProfileResponse } from "../types/profile.types";

export const fetchUserProfile = async (token: string) => {
  const res = await fetch("/api/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Unable to fetch profile");

  return res.json();
};

export const saveUserProfile = async (
  token: string,
  profileData: ProfileResponse
) => {
  await fetch("/api/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });
};
