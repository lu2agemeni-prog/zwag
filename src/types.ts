export enum Gender {
  MALE = "male",
  FEMALE = "female"
}

export enum MaritalStatus {
  SINGLE = "اعزب",
  WIDOWED = "ارمل",
  DIVORCED = "مطلق"
}

export enum HijabType {
  HIJAB = "حجاب",
  NIQAB = "نقاب",
  KHIMAR = "خمار",
  NONE = "غير محجبة"
}

export interface UserProfile {
  id: string; // Unique Member Number e.g., "MEMBER-4829"
  name: string;
  email: string;
  mobile: string;
  isMobileVerified: boolean;
  agreedToCharter: boolean;
  gender: Gender;
  avatar: string; // Predefined avatar ID
  profileImage: string | null; // Custom uploaded image for premium members
  
  // Personal Details
  age: number;
  nationality: string;
  residence: string;
  profession: string;
  education: string;
  income: string;
  maritalStatus: MaritalStatus;
  hasChildren: boolean;
  childrenCount: number;
  isSmoker: boolean;

  // Physical Details
  height: number; // in cm
  weight: number; // in kg
  skinColor: string;
  bodyBuild: string;
  healthStatus: string;
  hasDisability: boolean;
  chronicDiseases: string;
  
  // Religiosity
  religiousCommitment: string;
  prayers: string;
  hasBeard: boolean | null; // For males
  hijabType: HijabType | null; // For females

  // Matrimonial Opinions
  qaImaStance: string; // Stance on Marriage List (القايمة)
  mahrOpinion: string; // Stance on Mahr and Shabka
  marriageTimeframe: string; // Expected time to marry
  shariaVisionStance: string; // Stance on Sharia viewing (الرؤية الشرعية)

  // Personal descriptions (minimum 140 characters)
  aboutMe: string;
  partnerSpecs: string;

  // Hobbies & Interests
  hobbies: string[];

  // Meta info
  isPremium: boolean;
  isVerified: boolean; // Admin approved
  premiumExpiryDate?: string;
  joinDate: string;
  isOnline: boolean;
  lastSeen?: string;
  viewsCount: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: "interest" | "ignore" | "system" | "message" | "premium_request" | "verify_request";
  senderId?: string;
  senderName?: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface SuccessStory {
  id: string;
  husbandName: string;
  wifeName: string;
  story: string;
  date: string;
  isApproved: boolean;
  avatarHusband?: string;
  avatarWife?: string;
}

export interface Interaction {
  id: string;
  fromUserId: string;
  toUserId: string;
  type: "interest" | "ignore" | "block" | "report";
  reason?: string; // For reports
  timestamp: string;
}

export interface PremiumSubscriptionRequest {
  id: string;
  userId: string;
  userName: string;
  userGender: Gender;
  planDuration: "week" | "month" | "3months" | "6months" | "year";
  paymentMethod: "google_play" | "credit_card" | "mobile_wallet";
  phoneNumber?: string; // Wallet number or reference
  status: "pending" | "approved" | "rejected";
  timestamp: string;
}
