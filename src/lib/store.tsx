import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { 
  UserProfile, Gender, MaritalStatus, HijabType, 
  Message, Notification, SuccessStory, Interaction, 
  PremiumSubscriptionRequest 
} from "../types";
import { supabase } from "./supabase";

interface AppContextType {
  currentUser: UserProfile | null;
  profiles: UserProfile[];
  messages: Message[];
  notifications: Notification[];
  successStories: SuccessStory[];
  interactions: Interaction[];
  premiumRequests: PremiumSubscriptionRequest[];
  dbError: string | null;
  isSupabaseLoading: boolean;
  
  loginUser: (email: string, mobile: string) => Promise<boolean>;
  verifyMobileCode: (code: string) => boolean;
  submitCharterAgreement: () => void;
  saveProfile: (profile: Partial<UserProfile>) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateAvatar: (avatarId: string) => void;
  uploadCustomImage: (base64Data: string) => void;
  logout: () => void;
  
  expressInterest: (toUserId: string) => void;
  ignoreProfile: (toUserId: string) => void;
  unignoreProfile: (toUserId: string) => void;
  blockProfile: (toUserId: string) => void;
  reportProfile: (toUserId: string, reason: string) => void;
  incrementViewCount: (profileId: string) => void;
  
  sendMessage: (toUserId: string, content: string) => void;
  markMessagesAsRead: (senderId: string) => void;
  
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  
  submitPremiumRequest: (plan: "week" | "month" | "3months" | "6months" | "year", paymentMethod: "google_play" | "credit_card" | "mobile_wallet", phoneNumber?: string) => void;
  
  adminApprovePremium: (requestId: string) => void;
  adminRejectPremium: (requestId: string) => void;
  adminVerifyUser: (userId: string) => void;
  adminDeleteUser: (userId: string) => void;
  adminApproveStory: (storyId: string) => void;
  adminAddStory: (husband: string, wife: string, content: string) => void;
  retryLoadData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// بيانات أولية لقصص النجاح فقط — لا profiles وهمية
const SEED_STORIES: SuccessStory[] = [
  {
    id: "STORY-1",
    husbandName: "عبد الرحمن بن سليمان",
    wifeName: "هدى السعيد",
    story: "الحمد لله الذي بنعمته تتم الصالحات، بفضل هذا التطبيق المبارك وبحثنا الجاد والقائم على الضوابط الشرعية، تواصلنا عبر الرؤية الشرعية الرسمية والتنسيق مع الأهل فوراً. تم عقد قراننا وتيسرت جميع الأمور بفضل البركة والصدق والالتزام بالميثاق الأخلاقي للتطبيق.",
    date: "2026-04-12",
    isApproved: true,
    avatarHusband: "male_4",
    avatarWife: "female_4"
  },
  {
    id: "STORY-2",
    husbandName: "خالد محمود",
    wifeName: "زينب عبد الكريم",
    story: "بعد رحلة من البحث، وجدت شريكة عمري زينب هنا. كان هناك وضوح تام وصراحة كاملة في تفاصيل الملف الشخصي مما جعل الرؤية الشرعية مريحة ومبنية على تفاهم مسبق. نشكر القائمين على هذا العمل الطيب لما يقدمونه من حماية للخصوصية وتركيز على الجدية.",
    date: "2026-05-30",
    isApproved: true,
    avatarHusband: "male_5",
    avatarWife: "female_5"
  }
];

// توليد ID فريد للعضو
function generateMemberId(): string {
  return `MEMBER-${Math.floor(1000 + Math.random() * 9000)}`;
}

// توليد ID فريد عام
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem("zwag_current_user");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [premiumRequests, setPremiumRequests] = useState<PremiumSubscriptionRequest[]>([]);
  const [dbError, setDbError] = useState<string | null>(null);
  const [isSupabaseLoading, setIsSupabaseLoading] = useState<boolean>(true);

  // ==================== تحميل البيانات من Supabase ====================
  const loadInitialData = useCallback(async () => {
    setIsSupabaseLoading(true);
    setDbError(null);
    try {
      // 1. تحميل الملفات الشخصية
      const { data: dbProfiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("joinDate", { ascending: false });

      if (profilesError) {
        if (profilesError.message.includes("does not exist") || profilesError.message.includes("relation")) {
          throw new Error("tables_not_created");
        }
        throw profilesError;
      }
      setProfiles((dbProfiles as UserProfile[]) || []);

      // 2. قصص النجاح
      const { data: dbStories } = await supabase
        .from("success_stories")
        .select("*")
        .order("date", { ascending: false });
      
      if (dbStories && dbStories.length > 0) {
        setSuccessStories(dbStories as SuccessStory[]);
      } else {
        // إدراج قصص البداية مرة واحدة فقط لو الجدول فاضي
        const { error: storyErr } = await supabase.from("success_stories").insert(SEED_STORIES);
        if (!storyErr) setSuccessStories(SEED_STORIES);
      }

      // 3. الرسائل — نجيب بس رسائل المستخدم الحالي لو موجود
      if (currentUser) {
        const { data: dbMessages } = await supabase
          .from("messages")
          .select("*")
          .or(`senderId.eq.${currentUser.id},receiverId.eq.${currentUser.id}`)
          .order("timestamp", { ascending: true });
        if (dbMessages) setMessages(dbMessages as Message[]);

        // 4. الإشعارات الخاصة بالمستخدم
        const { data: dbNotifications } = await supabase
          .from("notifications")
          .select("*")
          .or(`userId.eq.${currentUser.id},userId.eq.ADMIN`)
          .order("timestamp", { ascending: false });
        if (dbNotifications) setNotifications(dbNotifications as Notification[]);

        // 5. التفاعلات
        const { data: dbInteractions } = await supabase
          .from("interactions")
          .select("*")
          .or(`fromUserId.eq.${currentUser.id},toUserId.eq.${currentUser.id}`)
          .order("timestamp", { ascending: false });
        if (dbInteractions) setInteractions(dbInteractions as Interaction[]);
      } else {
        // لو مفيش مستخدم، نحمل الكل للـ admin والعرض العام
        const { data: dbNotifications } = await supabase
          .from("notifications").select("*").order("timestamp", { ascending: false });
        if (dbNotifications) setNotifications(dbNotifications as Notification[]);
        
        const { data: dbInteractions } = await supabase
          .from("interactions").select("*").order("timestamp", { ascending: false });
        if (dbInteractions) setInteractions(dbInteractions as Interaction[]);
      }

      // 6. طلبات الـ premium
      const { data: dbRequests } = await supabase
        .from("premium_requests")
        .select("*")
        .order("timestamp", { ascending: false });
      if (dbRequests) setPremiumRequests(dbRequests as PremiumSubscriptionRequest[]);

    } catch (err: any) {
      console.error("Supabase error:", err);
      if (err.message === "tables_not_created") {
        setDbError("لم يتم إنشاء الجداول في Supabase بعد. افتح لوحة الإدارة وانسخ سكريبت SQL وشغّله في Supabase SQL Editor.");
      } else {
        setDbError(`خطأ في الاتصال بقاعدة البيانات: ${err.message || "تحقق من إعدادات Supabase."}`);
      }
    } finally {
      setIsSupabaseLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    loadInitialData();
  }, []);

  // حفظ المستخدم الحالي في localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("zwag_current_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("zwag_current_user");
    }
  }, [currentUser]);

  // ==================== تحديث المستخدم الحالي لو تغيّر في الـ profiles ====================
  useEffect(() => {
    if (currentUser && profiles.length > 0) {
      const updatedInDb = profiles.find(p => p.id === currentUser.id);
      if (updatedInDb && JSON.stringify(updatedInDb) !== JSON.stringify(currentUser)) {
        setCurrentUser(updatedInDb);
      }
    }
  }, [profiles]);

  // ==================== Auth ====================
  const loginUser = async (email: string, mobile: string): Promise<boolean> => {
    const cleanEmail = email.toLowerCase().trim();
    try {
      const { data: dbUser, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", cleanEmail)
        .single();

      if (!error && dbUser) {
        const loggedUser = dbUser as UserProfile;
        const updated = { ...loggedUser, isOnline: true };
        setCurrentUser(updated);
        setProfiles(prev => {
          const exists = prev.find(p => p.id === loggedUser.id);
          if (exists) return prev.map(p => p.id === loggedUser.id ? updated : p);
          return [updated, ...prev];
        });
        await supabase.from("profiles").update({ isOnline: true }).eq("id", loggedUser.id);
        return true;
      }

      // مستخدم جديد — إنشاء حساب مؤقت
      const newId = generateMemberId();
      const newProfile: UserProfile = {
        id: newId,
        name: "",
        email: cleanEmail,
        mobile,
        isMobileVerified: false,
        agreedToCharter: false,
        gender: Gender.MALE,
        avatar: "male_1",
        profileImage: null,
        age: 25,
        nationality: "مصر",
        residence: "مصر",
        profession: "",
        education: "بكالوريوس / ليسانس",
        income: "من 7,000 إلى 15,000 جنيه أو ما يعادلها",
        maritalStatus: MaritalStatus.SINGLE,
        hasChildren: false,
        childrenCount: 0,
        isSmoker: false,
        height: 170,
        weight: 70,
        skinColor: "قمحي",
        bodyBuild: "متوسط",
        healthStatus: "بصحة جيدة جداً والحمد لله",
        hasDisability: false,
        chronicDiseases: "لا يوجد",
        religiousCommitment: "ملتزم متوسط يسعى للأفضل",
        prayers: "أصلي كل الصلوات في وقتها والحمد لله",
        hasBeard: null,
        hijabType: null,
        qaImaStance: "موضوع خاضع للاتفاق بين العائلتين",
        mahrOpinion: "موضوع خاضع للاتفاق والنقاش المرن",
        marriageTimeframe: "خلال سنة على الأكثر",
        shariaVisionStance: "أؤيد الرؤية الشرعية بوجود محرم في أقرب فرصة",
        aboutMe: "",
        partnerSpecs: "",
        hobbies: [],
        isPremium: false,
        isVerified: false,
        joinDate: new Date().toISOString().split('T')[0],
        isOnline: true,
        viewsCount: 0
      };
      setCurrentUser(newProfile);
      // لا ندرج في Supabase لحد ما يكمل تسجيل الملف
      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const verifyMobileCode = (code: string): boolean => {
    // في الإنتاج: تحقق حقيقي من SMS. حالياً: 4+ أرقام
    if (code.length >= 4) {
      if (currentUser) {
        const updated = { ...currentUser, isMobileVerified: true };
        setCurrentUser(updated);
        if (currentUser.name) {
          supabase.from("profiles").update({ isMobileVerified: true }).eq("id", currentUser.id).then();
        }
        return true;
      }
    }
    return false;
  };

  const submitCharterAgreement = () => {
    if (currentUser) {
      const updated = { ...currentUser, agreedToCharter: true };
      setCurrentUser(updated);
      if (currentUser.name) {
        supabase.from("profiles").update({ agreedToCharter: true }).eq("id", currentUser.id).then();
      }
    }
  };

  const saveProfile = async (updatedData: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedData } as UserProfile;
    setCurrentUser(updated);
    setProfiles(prev => {
      const exists = prev.find(p => p.id === updated.id);
      if (exists) return prev.map(p => p.id === updated.id ? updated : p);
      return [updated, ...prev];
    });

    // حفظ في Supabase — upsert للحالتين (جديد أو تعديل)
    const { error } = await supabase.from("profiles").upsert(updated);
    if (error) console.error("Save profile error:", error);
  };

  const updateProfile = (updatedData: Partial<UserProfile>) => saveProfile(updatedData);

  const updateAvatar = (avatarId: string) => {
    if (currentUser) {
      saveProfile({ avatar: avatarId });
    }
  };

  const uploadCustomImage = (base64Data: string) => {
    if (currentUser && currentUser.isPremium) {
      saveProfile({ profileImage: base64Data });
    }
  };

  const logout = async () => {
    if (currentUser) {
      await supabase.from("profiles")
        .update({ isOnline: false, lastSeen: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }) })
        .eq("id", currentUser.id);
    }
    setCurrentUser(null);
    setMessages([]);
    setNotifications([]);
    setInteractions([]);
    setProfiles([]);
  };

  // ==================== التفاعلات ====================
  const expressInterest = async (toUserId: string) => {
    if (!currentUser) return;
    const exists = interactions.some(i => i.fromUserId === currentUser.id && i.toUserId === toUserId && i.type === "interest");
    if (exists) return;

    const newInteraction: Interaction = {
      id: generateId("INT"),
      fromUserId: currentUser.id,
      toUserId,
      type: "interest",
      timestamp: new Date().toISOString()
    };

    const targetProfile = profiles.find(p => p.id === toUserId);
    const newNotification: Notification = {
      id: generateId("NOT"),
      userId: toUserId,
      type: "interest",
      senderId: currentUser.id,
      senderName: currentUser.name || "عضو جاد",
      content: `أبدى العضو "${currentUser.name || currentUser.id}" اهتمامه بملفك الشخصي. يمكنك الاطلاع على ملفه والرد.`,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setInteractions(prev => [...prev, newInteraction]);
    setNotifications(prev => [newNotification, ...prev]);

    await supabase.from("interactions").insert(newInteraction);
    await supabase.from("notifications").insert(newNotification);
  };

  const ignoreProfile = async (toUserId: string) => {
    if (!currentUser) return;
    const newInteraction: Interaction = {
      id: generateId("INT"),
      fromUserId: currentUser.id,
      toUserId,
      type: "ignore",
      timestamp: new Date().toISOString()
    };
    setInteractions(prev => [...prev, newInteraction]);
    await supabase.from("interactions").insert(newInteraction);
  };

  const unignoreProfile = async (toUserId: string) => {
    if (!currentUser) return;
    setInteractions(prev => prev.filter(i => !(i.fromUserId === currentUser.id && i.toUserId === toUserId && i.type === "ignore")));
    await supabase.from("interactions")
      .delete()
      .eq("fromUserId", currentUser.id)
      .eq("toUserId", toUserId)
      .eq("type", "ignore");
  };

  const blockProfile = async (toUserId: string) => {
    if (!currentUser) return;
    const newInteraction: Interaction = {
      id: generateId("INT"),
      fromUserId: currentUser.id,
      toUserId,
      type: "block",
      timestamp: new Date().toISOString()
    };
    setInteractions(prev => [...prev, newInteraction]);
    await supabase.from("interactions").insert(newInteraction);
  };

  const reportProfile = async (toUserId: string, reason: string) => {
    if (!currentUser) return;
    const newInteraction: Interaction = {
      id: generateId("INT"),
      fromUserId: currentUser.id,
      toUserId,
      type: "report",
      reason,
      timestamp: new Date().toISOString()
    };
    const systemNotif: Notification = {
      id: generateId("NOT"),
      userId: "ADMIN",
      type: "system",
      senderId: currentUser.id,
      senderName: currentUser.name || "مبلّغ",
      content: `بلاغ من العضو "${currentUser.name}" ضد العضو "${toUserId}": ${reason}`,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setInteractions(prev => [...prev, newInteraction]);
    setNotifications(prev => [systemNotif, ...prev]);
    await supabase.from("interactions").insert(newInteraction);
    await supabase.from("notifications").insert(systemNotif);
  };

  // تحديث عداد المشاهدات
  const incrementViewCount = async (profileId: string) => {
    if (!currentUser || profileId === currentUser.id) return;
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return;
    const newCount = (profile.viewsCount || 0) + 1;
    setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, viewsCount: newCount } : p));
    await supabase.from("profiles").update({ viewsCount: newCount }).eq("id", profileId);
  };

  // ==================== الرسائل ====================
  const sendMessage = async (toUserId: string, content: string) => {
    if (!currentUser) return;
    const newMessage: Message = {
      id: generateId("MSG"),
      senderId: currentUser.id,
      receiverId: toUserId,
      content,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    const newNotification: Notification = {
      id: generateId("NOT"),
      userId: toUserId,
      type: "message",
      senderId: currentUser.id,
      senderName: currentUser.name || "مرسل",
      content: `رسالة جديدة من "${currentUser.name || currentUser.id}": "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setMessages(prev => [...prev, newMessage]);
    setNotifications(prev => [newNotification, ...prev]);
    await supabase.from("messages").insert(newMessage);
    await supabase.from("notifications").insert(newNotification);
  };

  const markMessagesAsRead = async (senderId: string) => {
    if (!currentUser) return;
    setMessages(prev => prev.map(m =>
      m.senderId === senderId && m.receiverId === currentUser.id
        ? { ...m, isRead: true } : m
    ));
    await supabase.from("messages").update({ isRead: true })
      .eq("senderId", senderId).eq("receiverId", currentUser.id);
  };

  // ==================== الإشعارات ====================
  const markNotificationAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    await supabase.from("notifications").update({ isRead: true }).eq("id", id);
  };

  const markAllNotificationsAsRead = async () => {
    if (!currentUser) return;
    setNotifications(prev => prev.map(n =>
      n.userId === currentUser.id ? { ...n, isRead: true } : n
    ));
    await supabase.from("notifications").update({ isRead: true }).eq("userId", currentUser.id);
  };

  // ==================== Premium ====================
  const submitPremiumRequest = async (
    plan: "week" | "month" | "3months" | "6months" | "year",
    paymentMethod: "google_play" | "credit_card" | "mobile_wallet",
    phoneNumber?: string
  ) => {
    if (!currentUser) return;
    const newRequest: PremiumSubscriptionRequest = {
      id: generateId("REQ"),
      userId: currentUser.id,
      userName: currentUser.name || "عضو جديد",
      userGender: currentUser.gender,
      planDuration: plan,
      paymentMethod,
      phoneNumber,
      status: "pending",
      timestamp: new Date().toISOString()
    };
    const systemNotif: Notification = {
      id: generateId("NOT"),
      userId: "ADMIN",
      type: "premium_request",
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: `طلب اشتراك مميز من "${currentUser.name}" — الباقة: ${plan} — طريقة الدفع: ${paymentMethod}`,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setPremiumRequests(prev => [newRequest, ...prev]);
    setNotifications(prev => [systemNotif, ...prev]);
    await supabase.from("premium_requests").insert(newRequest);
    await supabase.from("notifications").insert(systemNotif);
  };

  // ==================== Admin ====================
  const adminApprovePremium = async (requestId: string) => {
    const request = premiumRequests.find(r => r.id === requestId);
    if (!request) return;

    // حساب تاريخ انتهاء الاشتراك
    const daysMap: Record<string, number> = { week: 7, month: 30, "3months": 90, "6months": 180, year: 365 };
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + (daysMap[request.planDuration] || 30));

    setPremiumRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: "approved" } : r));
    setProfiles(prev => prev.map(p => p.id === request.userId ? { ...p, isPremium: true, premiumExpiryDate: expiryDate.toISOString().split('T')[0] } : p));
    if (currentUser?.id === request.userId) {
      setCurrentUser(prev => prev ? { ...prev, isPremium: true, premiumExpiryDate: expiryDate.toISOString().split('T')[0] } : null);
    }

    const notif: Notification = {
      id: generateId("NOT"),
      userId: request.userId,
      type: "system",
      content: `تهانينا! تمت الموافقة على اشتراكك المميز حتى تاريخ ${expiryDate.toLocaleDateString("ar-EG")}. يمكنك الآن إرسال رسائل غير محدودة ورفع صورتك الشخصية.`,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [notif, ...prev]);

    await supabase.from("premium_requests").update({ status: "approved" }).eq("id", requestId);
    await supabase.from("profiles").update({ isPremium: true, premiumExpiryDate: expiryDate.toISOString().split('T')[0] }).eq("id", request.userId);
    await supabase.from("notifications").insert(notif);
  };

  const adminRejectPremium = async (requestId: string) => {
    const request = premiumRequests.find(r => r.id === requestId);
    if (!request) return;
    setPremiumRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: "rejected" } : r));
    const notif: Notification = {
      id: generateId("NOT"),
      userId: request.userId,
      type: "system",
      content: "تم رفض طلب الاشتراك المميز. يرجى التأكد من عملية الدفع وإعادة التقديم، أو التواصل مع الدعم الفني.",
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [notif, ...prev]);
    await supabase.from("premium_requests").update({ status: "rejected" }).eq("id", requestId);
    await supabase.from("notifications").insert(notif);
  };

  const adminVerifyUser = async (userId: string) => {
    setProfiles(prev => prev.map(p => p.id === userId ? { ...p, isVerified: true } : p));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, isVerified: true } : null);
    }
    const notif: Notification = {
      id: generateId("NOT"),
      userId,
      type: "system",
      content: "تم التحقق من ملفك الشخصي بواسطة الإدارة. يحمل ملفك الآن شارة الحساب الموثق لمزيد من المصداقية.",
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [notif, ...prev]);
    await supabase.from("profiles").update({ isVerified: true }).eq("id", userId);
    await supabase.from("notifications").insert(notif);
  };

  const adminDeleteUser = async (userId: string) => {
    setProfiles(prev => prev.filter(p => p.id !== userId));
    if (currentUser?.id === userId) setCurrentUser(null);
    await supabase.from("profiles").delete().eq("id", userId);
  };

  const adminApproveStory = async (storyId: string) => {
    setSuccessStories(prev => prev.map(s => s.id === storyId ? { ...s, isApproved: true } : s));
    await supabase.from("success_stories").update({ isApproved: true }).eq("id", storyId);
  };

  const adminAddStory = async (husband: string, wife: string, storyContent: string) => {
    const newStory: SuccessStory = {
      id: generateId("STORY"),
      husbandName: husband,
      wifeName: wife,
      story: storyContent,
      date: new Date().toISOString().split('T')[0],
      isApproved: false,
      avatarHusband: "male_4",
      avatarWife: "female_4"
    };
    setSuccessStories(prev => [newStory, ...prev]);
    await supabase.from("success_stories").insert(newStory);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      profiles,
      messages,
      notifications,
      successStories,
      interactions,
      premiumRequests,
      dbError,
      isSupabaseLoading,
      loginUser,
      verifyMobileCode,
      submitCharterAgreement,
      saveProfile,
      updateProfile,
      updateAvatar,
      uploadCustomImage,
      logout,
      expressInterest,
      ignoreProfile,
      unignoreProfile,
      blockProfile,
      reportProfile,
      incrementViewCount,
      sendMessage,
      markMessagesAsRead,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      submitPremiumRequest,
      adminApprovePremium,
      adminRejectPremium,
      adminVerifyUser,
      adminDeleteUser,
      adminApproveStory,
      adminAddStory,
      retryLoadData: loadInitialData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error("useApp must be used within an AppProvider");
  return context;
};
