// خريطة الأفاتارات — يمكن توسيعها لاحقاً
const AVATAR_MAP: Record<string, string> = {
  // ذكور
  male_1: "1534528741775-53994a69daeb",
  male_2: "1507003211169-0a1dd7228f2d",
  male_3: "1472099645785-5658abf4ff4e",
  male_4: "1519345182560-3f2917c472ef",
  male_5: "1500648767791-00dcc994a43e",
  male_6: "1506794778202-cad84cf45f1d",
  // إناث
  female_1: "1494790108377-be9c29b29330",
  female_2: "1438761681033-6461ffad8d80",
  female_3: "1517841905240-472988babdf9",
  female_4: "1544005313-94ddf0286df2",
  female_5: "1531746020798-e6953c6e8e04",
  female_6: "1487412720507-e7ab37603c6f",
};

export function getAvatarUrl(avatar: string, profileImage?: string | null): string {
  if (profileImage) return profileImage;
  const photoId = AVATAR_MAP[avatar] || AVATAR_MAP["male_1"];
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=150&q=80`;
}

export const ALL_AVATARS = Object.keys(AVATAR_MAP);
export const MALE_AVATARS = ALL_AVATARS.filter(k => k.startsWith("male"));
export const FEMALE_AVATARS = ALL_AVATARS.filter(k => k.startsWith("female"));
