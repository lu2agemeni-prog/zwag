import React, { createContext, useContext, useState, useEffect } from "react";
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
  
  // Auth & Profile Actions
  loginUser: (email: string, mobile: string) => Promise<boolean>;
  verifyMobileCode: (code: string) => boolean;
  submitCharterAgreement: () => void;
  saveProfile: (profile: Partial<UserProfile>) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateAvatar: (avatarId: string) => void;
  uploadCustomImage: (base64Data: string) => void;
  logout: () => void;
  
  // Interaction Actions
  expressInterest: (toUserId: string) => void;
  ignoreProfile: (toUserId: string) => void;
  unignoreProfile: (toUserId: string) => void;
  blockProfile: (toUserId: string) => void;
  reportProfile: (toUserId: string, reason: string) => void;
  
  // Messaging
  sendMessage: (toUserId: string, content: string) => void;
  markMessagesAsRead: (senderId: string) => void;
  
  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  
  // Premium Subscriptions
  submitPremiumRequest: (plan: "week" | "month" | "3months" | "6months" | "year", paymentMethod: "google_play" | "credit_card" | "mobile_wallet", phoneNumber?: string) => void;
  
  // Admin Operations
  adminApprovePremium: (requestId: string) => void;
  adminRejectPremium: (requestId: string) => void;
  adminVerifyUser: (userId: string) => void;
  adminDeleteUser: (userId: string) => void;
  adminApproveStory: (storyId: string) => void;
  adminAddStory: (husband: string, wife: string, content: string) => void;
  retryLoadData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Local Seed Backups (Used as initial state and fallbacks)
const SEED_PROFILES: UserProfile[] = [
  {
    id: "MEMBER-1024",
    name: "أحمد الشناوي",
    email: "ahmad@example.com",
    mobile: "+201012345678",
    isMobileVerified: true,
    agreedToCharter: true,
    gender: Gender.MALE,
    avatar: "male_1",
    profileImage: null,
    age: 30,
    nationality: "مصر",
    residence: "مصر",
    profession: "مهندس ميكانيكا",
    education: "بكالوريوس / ليسانس",
    income: "من 15,000 إلى 30,000 جنيه أو ما يعادلها",
    maritalStatus: MaritalStatus.SINGLE,
    hasChildren: false,
    childrenCount: 0,
    isSmoker: false,
    height: 178,
    weight: 79,
    skinColor: "قمحي فاتح",
    bodyBuild: "رياضي",
    healthStatus: "بصحة جيدة جداً والحمد لله",
    hasDisability: false,
    chronicDiseases: "لا يوجد والحمد لله",
    religiousCommitment: "ملتزم متوسط يسعى للأفضل",
    prayers: "أصلي كل الصلوات في المسجد (للرجال) / في وقتها",
    hasBeard: true,
    hijabType: null,
    qaImaStance: "ضرورية جداً لحفظ حقوق الزوجة",
    mahrOpinion: "مهر وشبكة بحدود المتوسط المقبول بالعرف",
    marriageTimeframe: "خلال سنة على الأكثر",
    shariaVisionStance: "أؤيد الرؤية الشرعية بوجود محرم في أقرب فرصة",
    aboutMe: "أنا شاب مصري أبلغ من العمر ثلاثين عاماً، أعمل مهندساً ميكانيكياً في شركة رائدة بالقاهرة. والحمد لله ملتزم بصلاتي بالمسجد وبأخلاقي الإسلامية، أحب القراءة وممارسة الرياضة بانتظام، وأسعى لبناء أسرة مسلمة هادئة ومستقرة تقوم على المودة والرحمة والاحترام المتبادل، وأتطلع لأن نكون عوناً لبعضنا البعض على طاعة الله ودخول الجنة معاً.",
    partnerSpecs: "أبحث عن زوجة صالحة متدينة، ترتدي الحجاب وتلتزم بصلاتها وتخاف الله في السر والعلن. يفضل أن تكون من عائلة محترمة، متعلمة وتفهم معنى الشراكة الزوجية ومستعدة لبناء بيت دافئ، وتكون حنونة ومخلصة وتشاركني طموحات الحياة بوعي وناضجة فكرياً.",
    hobbies: ["القراءة والاطلاع", "الرياضة واللياقة البدنية", "حفظ القرآن وتجويده"],
    isPremium: false,
    isVerified: true,
    joinDate: "2026-01-15",
    isOnline: true,
    viewsCount: 142
  },
  {
    id: "MEMBER-2035",
    name: "فيصل القحطاني",
    email: "faisal@example.com",
    mobile: "+966501234567",
    isMobileVerified: true,
    agreedToCharter: true,
    gender: Gender.MALE,
    avatar: "male_2",
    profileImage: null,
    age: 34,
    nationality: "المملكة العربية السعودية",
    residence: "المملكة العربية السعودية",
    profession: "صيدلي إكلينيكي",
    education: "ماجستير",
    income: "أكثر من 50,000 جنيه أو ما يعادلها",
    maritalStatus: MaritalStatus.DIVORCED,
    hasChildren: true,
    childrenCount: 1,
    isSmoker: false,
    height: 182,
    weight: 85,
    skinColor: "قمحي",
    bodyBuild: "متوسط",
    healthStatus: "بصحة جيدة جداً والحمد لله",
    hasDisability: false,
    chronicDiseases: "لا يوجد والحمد لله",
    religiousCommitment: "ملتزم جداً والحمد لله",
    prayers: "أصلي كل الصلوات في المسجد (للرجال) / في وقتها",
    hasBeard: true,
    hijabType: null,
    qaImaStance: "لا أؤيد كتابة القايمة وأفضل السكن المجهز بالكامل من الزوج",
    mahrOpinion: "مهر وشبكة بحدود المتوسط المقبول بالعرف",
    marriageTimeframe: "قريب جداً (خلال 6 أشهر)",
    shariaVisionStance: "أفضل الرؤية الشرعية بعد التحدث بجدية وفهم الأفكار أولاً",
    aboutMe: "أعمل صيدلانياً في مدينة الرياض، والحمد لله ميسور الحال ومستقل ببيت خاص. إنسان هادئ ومحب للاستقرار والسكينة، بار بوالدي، أبحث عن شريكة تعينني على طاعة الله ونبني بيتاً سعيداً يملأه الحب والود وتنشئة ابني تنشئة صالحة طيبة، أحب السفر وحضور المحاضرات الدينية والنافعة.",
    partnerSpecs: "أرغب بشريكة حياة متدينة خلوقة، تكون حنونة ومستعدة لتربية طفل معي وتعامله كابنها. يفضل أن تكون هادئة الطباع، متفاهمة وتؤمن بالتعاون وبناء أسرة كريمة، ومستعدة للإقامة بالرياض، ولا يشترط جنسية معينة طالما كانت ذات خلق ودين.",
    hobbies: ["السفر والرحلات", "البودكاست والمحاضرات النافعة", "العمل التطوعي والخيري"],
    isPremium: true,
    isVerified: true,
    joinDate: "2026-03-10",
    isOnline: false,
    lastSeen: "منذ ساعتين",
    viewsCount: 289
  },
  {
    id: "MEMBER-4921",
    name: "عمر الرفاعي",
    email: "omar@example.com",
    mobile: "+962791234567",
    isMobileVerified: true,
    agreedToCharter: true,
    gender: Gender.MALE,
    avatar: "male_3",
    profileImage: null,
    age: 28,
    nationality: "الأردن",
    residence: "الإمارات العربية المتحدة",
    profession: "مطور برمجيات شريك",
    education: "بكالوريوس / ليسانس",
    income: "من 30,000 إلى 50,000 جنيه أو ما يعادلها",
    maritalStatus: MaritalStatus.SINGLE,
    hasChildren: false,
    childrenCount: 0,
    isSmoker: false,
    height: 175,
    weight: 72,
    skinColor: "أبيض",
    bodyBuild: "رياضي",
    healthStatus: "بصحة جيدة جداً والحمد لله",
    hasDisability: false,
    chronicDiseases: "لا يوجد",
    religiousCommitment: "ملتزم متوسط يسعى للأفضل",
    prayers: "أصلي كل الصلوات في وقتها والحمد لله",
    hasBeard: false,
    hijabType: null,
    qaImaStance: "موضوع خاضع للاتفاق بين العائلتين",
    mahrOpinion: "أفضل המהר والشبكة الرمزية للتيسير والبركة",
    marriageTimeframe: "عاجل جداً (خلال 3 أشهر)",
    shariaVisionStance: "أؤيد الرؤية الشرعية بوجود محرم في أقرب فرصة",
    aboutMe: "أنا مهندس برمجيات أردني أقيم وأعمل في دبي، والحمد لله طموح في عملي وأبحث عن النضج والاستقرار. شخص متزن، أحب التطور التكنولوجي، ملتزم بفرائضي وأحافظ على قراءة الورد اليومي والحمد لله، أحب السفر، الرياضة الجري والسباحة، وأهتم جداً ببناء بيت على أسس شرعية متينة وصريحة.",
    partnerSpecs: "أبحث عن فتاة صالحة، ذات مظهر حسن وخلق رفيع، تحافظ على صلواتها وملتزمة دينياً وأخلاقياً. يفضل أن تكون متعلمة، طموحة، تقدر الحياة الأسرية والتربية الإسلامية للأطفال ومستعدة للاستقرار في دبي لبناء مستقبل مشرق سوياً.",
    hobbies: ["البرمجة والتكنولوجيا", "الرياضة واللياقة البدنية", "السفر والرحلات"],
    isPremium: false,
    isVerified: false,
    joinDate: "2026-05-22",
    isOnline: true,
    viewsCount: 54
  },
  {
    id: "MEMBER-7731",
    name: "فاطمة أحمد",
    email: "fatima@example.com",
    mobile: "+201212345678",
    isMobileVerified: true,
    agreedToCharter: true,
    gender: Gender.FEMALE,
    avatar: "female_1",
    profileImage: null,
    age: 26,
    nationality: "مصر",
    residence: "مصر",
    profession: "معلمة لغة عربية وتربية إسلامية",
    education: "بكالوريوس / ليسانس",
    income: "من 3,000 إلى 7,000 جنيه أو ما يعادلها",
    maritalStatus: MaritalStatus.SINGLE,
    hasChildren: false,
    childrenCount: 0,
    isSmoker: false,
    height: 162,
    weight: 58,
    skinColor: "أبيض",
    bodyBuild: "رشيق / نحيف",
    healthStatus: "بصحة جيدة جداً والحمد لله",
    hasDisability: false,
    chronicDiseases: "لا يوجد والحمد لله",
    religiousCommitment: "ملتزمة جداً والحمد لله",
    prayers: "أصلي كل الصلوات في وقتها والحمد لله",
    hasBeard: null,
    hijabType: HijabType.HIJAB,
    qaImaStance: "ضرورية جداً لحفظ حقوق الزوجة",
    mahrOpinion: "مهر وشبكة بحدود المتوسط المقبول بالعرف",
    marriageTimeframe: "قريب جداً (خلال 6 أشهر)",
    shariaVisionStance: "أؤيد الرؤية الشرعية بوجود محرم في أقرب فرصة",
    aboutMe: "فتاة مصرية من عائلة محافظة وملتزمة، والحمد لله أعمل معلمة لغة عربية وقرآن كريم، حافظة لكتاب الله وأسعى لتطبيقه في حياتي اليومية. إنسانة هادئة، صبورة، أحب القراءة والمحاضرات وأعمال التطوع، وأتمنى بناء بيت مسلم صالح يتربى فيه أبناؤنا على حب الله ورسوله.",
    partnerSpecs: "أبحث عن زوج صالح، متدين، يخاف الله ويرعى حقوق زوجته، مصلّي في المسجد وملتزم بالأخلاق الإسلامية الفاضلة. يفضل أن يكون شخصاً مسؤولاً، طموحاً وله وظيفة مستقرة، يعينني على طاعة الله ونرتقي سوياً في الدنيا والآخرة، ولا يدخن مطلقاً.",
    hobbies: ["حفظ القرآن وتجويده", "القراءة والاطلاع", "العمل التطوعي والخيري"],
    isPremium: false,
    isVerified: true,
    joinDate: "2026-02-18",
    isOnline: true,
    viewsCount: 391
  },
  {
    id: "MEMBER-8824",
    name: "سارة العتيبي",
    email: "sarah@example.com",
    mobile: "+966551234567",
    isMobileVerified: true,
    agreedToCharter: true,
    gender: Gender.FEMALE,
    avatar: "female_2",
    profileImage: null,
    age: 29,
    nationality: "المملكة العربية السعودية",
    residence: "المملكة العربية السعودية",
    profession: "مصممة واجهات ومواقع إلكترونية",
    education: "بكالوريوس / ليسانس",
    income: "من 30,000 إلى 50,000 جنيه أو ما يعادلها",
    maritalStatus: MaritalStatus.SINGLE,
    hasChildren: false,
    childrenCount: 0,
    isSmoker: false,
    height: 165,
    weight: 62,
    skinColor: "قمحي فاتح",
    bodyBuild: "متوسط",
    healthStatus: "بصحة جيدة جداً والحمد لله",
    hasDisability: false,
    chronicDiseases: "لا يوجد",
    religiousCommitment: "ملتزمة متوسط يسعى للأفضل",
    prayers: "أصلي كل الصلوات في وقتها والحمد لله",
    hasBeard: null,
    hijabType: HijabType.HIJAB,
    qaImaStance: "لا أؤيد كتابة القايمة وأفضل السكن المجهز بالكامل من الزوج",
    mahrOpinion: "مهر وشبكة بحدود المتوسط المقبول بالعرف",
    marriageTimeframe: "خلال سنة على الأكثر",
    shariaVisionStance: "أفضل الرؤية الشرعية بعد التحدث بجدية وفهم الأفكار أولاً",
    aboutMe: "أنا سارة من جدة، أعمل في مجال التصميم والعمل الحر، والحمد لله إنسانة طموحة ومحبة للتعلم وتطوير الذات. ملتزمة بفرائضي بفضل الله، أحب السفر، الفنون والتصوير الرقمي، والاطلاع على الثقافات، أبحث عن شريك جاد لبناء حياة زوجية متكاملة تسودها التفاهم والصراحة والمشاركة.",
    partnerSpecs: "أريد شريك حياة صالح، مصلّي ومثقف، يحترم المرأة ويقدر الحوار والصداقة الزوجية. يفضل أن يكون مستقراً مادياً وله وظيفة طيبة، يحب السفر والتطور، يشاركنى طموحاتى ويدعمني في عملي وعلمي، ويكون متفهماً وذا شخصية حنونة ومسؤولة.",
    hobbies: ["الرسم والأعمال اليدوية", "البرمجة والتكنولوجيا", "السفر والرحلات"],
    isPremium: true,
    isVerified: true,
    joinDate: "2026-04-05",
    isOnline: false,
    lastSeen: "منذ ساعة",
    viewsCount: 412
  }
];

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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("islamic_matrimony_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem("islamic_matrimony_profiles");
    return saved ? JSON.parse(saved) : SEED_PROFILES;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("islamic_matrimony_messages");
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem("islamic_matrimony_notifications");
    return saved ? JSON.parse(saved) : [];
  });

  const [successStories, setSuccessStories] = useState<SuccessStory[]>(() => {
    const saved = localStorage.getItem("islamic_matrimony_stories");
    return saved ? JSON.parse(saved) : SEED_STORIES;
  });

  const [interactions, setInteractions] = useState<Interaction[]>(() => {
    const saved = localStorage.getItem("islamic_matrimony_interactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [premiumRequests, setPremiumRequests] = useState<PremiumSubscriptionRequest[]>(() => {
    const saved = localStorage.getItem("islamic_matrimony_premium_requests");
    return saved ? JSON.parse(saved) : [];
  });

  const [dbError, setDbError] = useState<string | null>(null);
  const [isSupabaseLoading, setIsSupabaseLoading] = useState<boolean>(true);

  // Load and check tables from Supabase on start
  const loadInitialData = async () => {
    setIsSupabaseLoading(true);
    try {
      // 1. Fetch profiles
      const { data: dbProfiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*");

      if (profilesError) {
        if (profilesError.message.includes("does not exist") || profilesError.message.includes("relation")) {
          throw new Error("tables_not_created");
        }
        throw profilesError;
      }

      if (dbProfiles && dbProfiles.length > 0) {
        setProfiles(dbProfiles as UserProfile[]);
      } else {
        // Automatically pre-populate profiles table in Supabase
        await supabase.from("profiles").insert(SEED_PROFILES);
        setProfiles(SEED_PROFILES);
      }

      // 2. Fetch success stories
      const { data: dbStories } = await supabase.from("success_stories").select("*");
      if (dbStories && dbStories.length > 0) {
        setSuccessStories(dbStories as SuccessStory[]);
      } else {
        await supabase.from("success_stories").insert(SEED_STORIES);
        setSuccessStories(SEED_STORIES);
      }

      // 3. Fetch messages
      const { data: dbMessages } = await supabase.from("messages").select("*");
      if (dbMessages) setMessages(dbMessages as Message[]);

      // 4. Fetch notifications
      const { data: dbNotifications } = await supabase.from("notifications").select("*");
      if (dbNotifications) setNotifications(dbNotifications as Notification[]);

      // 5. Fetch interactions
      const { data: dbInteractions } = await supabase.from("interactions").select("*");
      if (dbInteractions) setInteractions(dbInteractions as Interaction[]);

      // 6. Fetch premium requests
      const { data: dbRequests } = await supabase.from("premium_requests").select("*");
      if (dbRequests) setPremiumRequests(dbRequests as PremiumSubscriptionRequest[]);

      setDbError(null);
    } catch (err: any) {
      console.warn("Supabase database connection details are set up but tables might not exist yet:", err);
      if (err.message === "tables_not_created") {
        setDbError("لم يتم إنشاء الجداول في Supabase حتى الآن. يرجى التوجه للوحة الإدارة (Admin) لنسخ سكريبت SQL وتشغيله بضغطة زر.");
      } else {
        setDbError(err.message || "حدث خطأ أثناء تحميل البيانات من Supabase. تم تفعيل نمط التخزين المحلي.");
      }
    } finally {
      setIsSupabaseLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Sync to local storage as fallback/offline capability
  useEffect(() => {
    localStorage.setItem("islamic_matrimony_user", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("islamic_matrimony_profiles", JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem("islamic_matrimony_messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("islamic_matrimony_notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("islamic_matrimony_stories", JSON.stringify(successStories));
  }, [successStories]);

  useEffect(() => {
    localStorage.setItem("islamic_matrimony_interactions", JSON.stringify(interactions));
  }, [interactions]);

  useEffect(() => {
    localStorage.setItem("islamic_matrimony_premium_requests", JSON.stringify(premiumRequests));
  }, [premiumRequests]);

  // Actions with Supabase integration
  const loginUser = async (email: string, mobile: string): Promise<boolean> => {
    try {
      const { data: dbUser } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email.toLowerCase().trim());

      if (dbUser && dbUser.length > 0) {
        const loggedUser = dbUser[0] as UserProfile;
        const updated = { ...loggedUser, isOnline: true };
        
        setCurrentUser(updated);
        setProfiles(prev => prev.map(p => p.id === loggedUser.id ? updated : p));
        
        await supabase.from("profiles").update({ isOnline: true }).eq("id", loggedUser.id);
        return true;
      }
    } catch (err) {
      console.warn("Supabase check user failure, trying local state:", err);
    }

    const existingProfile = profiles.find(p => p.email.toLowerCase() === email.toLowerCase().trim());
    
    if (existingProfile) {
      const updated = { ...existingProfile, isOnline: true };
      setCurrentUser(updated);
      setProfiles(prev => prev.map(p => p.id === existingProfile.id ? updated : p));
      supabase.from("profiles").update({ isOnline: true }).eq("id", existingProfile.id).then();
    } else {
      const newId = `MEMBER-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTempProfile: UserProfile = {
        id: newId,
        name: "",
        email: email.toLowerCase().trim(),
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
        chronicDiseases: "",
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
      
      setCurrentUser(newTempProfile);
      setProfiles(prev => [...prev, newTempProfile]);
      supabase.from("profiles").insert(newTempProfile).then();
    }
    return true;
  };

  const verifyMobileCode = (code: string): boolean => {
    if (code === "1234" || code === "123456" || code.length >= 4) {
      if (currentUser) {
        const updated = { ...currentUser, isMobileVerified: true };
        setCurrentUser(updated);
        setProfiles(prev => prev.map(p => p.id === currentUser.id ? updated : p));
        supabase.from("profiles").update({ isMobileVerified: true }).eq("id", currentUser.id).then();
        return true;
      }
    }
    return false;
  };

  const submitCharterAgreement = () => {
    if (currentUser) {
      const updated = { ...currentUser, agreedToCharter: true };
      setCurrentUser(updated);
      setProfiles(prev => prev.map(p => p.id === currentUser.id ? updated : p));
      supabase.from("profiles").update({ agreedToCharter: true }).eq("id", currentUser.id).then();
    }
  };

  const saveProfile = (updatedData: Partial<UserProfile>) => {
    if (currentUser) {
      const updated = { ...currentUser, ...updatedData } as UserProfile;
      setCurrentUser(updated);
      setProfiles(prev => prev.map(p => p.id === currentUser.id ? updated : p));
      supabase.from("profiles").update(updatedData).eq("id", currentUser.id).then();
    }
  };

  const updateAvatar = (avatarId: string) => {
    if (currentUser) {
      const updated = { ...currentUser, avatar: avatarId };
      setCurrentUser(updated);
      setProfiles(prev => prev.map(p => p.id === currentUser.id ? updated : p));
      supabase.from("profiles").update({ avatar: avatarId }).eq("id", currentUser.id).then();
    }
  };

  const uploadCustomImage = (base64Data: string) => {
    if (currentUser && currentUser.isPremium) {
      const updated = { ...currentUser, profileImage: base64Data };
      setCurrentUser(updated);
      setProfiles(prev => prev.map(p => p.id === currentUser.id ? updated : p));
      supabase.from("profiles").update({ profileImage: base64Data }).eq("id", currentUser.id).then();
    }
  };

  const logout = () => {
    if (currentUser) {
      supabase.from("profiles").update({ isOnline: false, lastSeen: "الآن" }).eq("id", currentUser.id).then();
    }
    setCurrentUser(null);
  };

  // Interactions
  const expressInterest = (toUserId: string) => {
    if (!currentUser) return;
    
    const exists = interactions.some(i => i.fromUserId === currentUser.id && i.toUserId === toUserId && i.type === "interest");
    if (exists) return;

    const newInteraction: Interaction = {
      id: `INT-${Math.floor(10000 + Math.random() * 90000)}`,
      fromUserId: currentUser.id,
      toUserId,
      type: "interest",
      timestamp: new Date().toISOString()
    };

    const newNotification: Notification = {
      id: `NOT-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: toUserId,
      type: "interest",
      senderId: currentUser.id,
      senderName: currentUser.name || "عضو جاد",
      content: `أبدى العضو رقم ${currentUser.id} اهتمامه بملفك الشخصي ومواصفاتك.`,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setInteractions(prev => [...prev, newInteraction]);
    setNotifications(prev => [newNotification, ...prev]);

    supabase.from("interactions").insert(newInteraction).then();
    supabase.from("notifications").insert(newNotification).then();
  };

  const updateProfile = (updatedData: Partial<UserProfile>) => {
    saveProfile(updatedData);
  };

  const unignoreProfile = (toUserId: string) => {
    if (!currentUser) return;
    setInteractions(prev => prev.filter(i => !(i.fromUserId === currentUser.id && i.toUserId === toUserId && i.type === "ignore")));
    supabase.from("interactions").delete().eq("fromUserId", currentUser.id).eq("toUserId", toUserId).eq("type", "ignore").then();
  };

  const ignoreProfile = (toUserId: string) => {
    if (!currentUser) return;
    
    const newInteraction: Interaction = {
      id: `INT-${Math.floor(10000 + Math.random() * 90000)}`,
      fromUserId: currentUser.id,
      toUserId,
      type: "ignore",
      timestamp: new Date().toISOString()
    };

    const newNotification: Notification = {
      id: `NOT-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: toUserId,
      type: "ignore",
      senderId: currentUser.id,
      senderName: currentUser.name || "عضو جاد",
      content: `قام العضو رقم ${currentUser.id} بتجاهل ملفك الشخصي أو التراجع عن الاهتمام.`,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setInteractions(prev => [...prev, newInteraction]);
    setNotifications(prev => [newNotification, ...prev]);

    supabase.from("interactions").insert(newInteraction).then();
    supabase.from("notifications").insert(newNotification).then();
  };

  const blockProfile = (toUserId: string) => {
    if (!currentUser) return;
    
    const newInteraction: Interaction = {
      id: `INT-${Math.floor(10000 + Math.random() * 90000)}`,
      fromUserId: currentUser.id,
      toUserId,
      type: "block",
      timestamp: new Date().toISOString()
    };

    setInteractions(prev => [...prev, newInteraction]);
    supabase.from("interactions").insert(newInteraction).then();
  };

  const reportProfile = (toUserId: string, reason: string) => {
    if (!currentUser) return;
    
    const newInteraction: Interaction = {
      id: `INT-${Math.floor(10000 + Math.random() * 90000)}`,
      fromUserId: currentUser.id,
      toUserId,
      type: "report",
      reason,
      timestamp: new Date().toISOString()
    };

    const systemNotif: Notification = {
      id: `NOT-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: "ADMIN",
      type: "system",
      senderId: currentUser.id,
      senderName: currentUser.name || "مبلغ",
      content: `إبلاغ عن إساءة استخدام من العضو ${currentUser.id} ضد العضو ${toUserId} بسبب: ${reason}`,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setInteractions(prev => [...prev, newInteraction]);
    setNotifications(prev => [systemNotif, ...prev]);

    supabase.from("interactions").insert(newInteraction).then();
    supabase.from("notifications").insert(systemNotif).then();
  };

  // Messaging
  const sendMessage = (toUserId: string, content: string) => {
    if (!currentUser) return;
    
    const newMessage: Message = {
      id: `MSG-${Math.floor(10000 + Math.random() * 90000)}`,
      senderId: currentUser.id,
      receiverId: toUserId,
      content,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    const newNotification: Notification = {
      id: `NOT-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: toUserId,
      type: "message",
      senderId: currentUser.id,
      senderName: currentUser.name || "مرسل",
      content: `لديك رسالة جديدة من العضو ${currentUser.name || currentUser.id}: "${content.substring(0, 30)}..."`,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setMessages(prev => [...prev, newMessage]);
    setNotifications(prev => [newNotification, ...prev]);

    supabase.from("messages").insert(newMessage).then();
    supabase.from("notifications").insert(newNotification).then();
  };

  const markMessagesAsRead = (senderId: string) => {
    if (!currentUser) return;
    setMessages(prev => prev.map(m => 
      m.senderId === senderId && m.receiverId === currentUser.id 
        ? { ...m, isRead: true } 
        : m
    ));

    supabase.from("messages").update({ isRead: true }).eq("senderId", senderId).eq("receiverId", currentUser.id).then();
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    supabase.from("notifications").update({ isRead: true }).eq("id", id).then();
  };

  const markAllNotificationsAsRead = () => {
    if (!currentUser) return;
    setNotifications(prev => prev.map(n => n.userId === currentUser.id ? { ...n, isRead: true } : n));
    supabase.from("notifications").update({ isRead: true }).eq("userId", currentUser.id).then();
  };

  // Premium
  const submitPremiumRequest = (
    plan: "week" | "month" | "3months" | "6months" | "year", 
    paymentMethod: "google_play" | "credit_card" | "mobile_wallet", 
    phoneNumber?: string
  ) => {
    if (!currentUser) return;

    const newRequest: PremiumSubscriptionRequest = {
      id: `REQ-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: currentUser.id,
      userName: currentUser.name || "مستخدم جديد",
      userGender: currentUser.gender,
      planDuration: plan,
      paymentMethod,
      phoneNumber,
      status: "pending",
      timestamp: new Date().toISOString()
    };

    const systemNotif: Notification = {
      id: `NOT-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: "ADMIN",
      type: "premium_request",
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: `طلب اشتكراك في الباقة المميزة من ${currentUser.name} (${plan}) عبر ${paymentMethod}`,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setPremiumRequests(prev => [newRequest, ...prev]);
    setNotifications(prev => [systemNotif, ...prev]);

    supabase.from("premium_requests").insert(newRequest).then();
    supabase.from("notifications").insert(systemNotif).then();
  };

  // Admin Actions
  const adminApprovePremium = (requestId: string) => {
    const request = premiumRequests.find(r => r.id === requestId);
    if (!request) return;

    setPremiumRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: "approved" } : r));
    setProfiles(prev => prev.map(p => p.id === request.userId ? { ...p, isPremium: true } : p));

    if (currentUser && currentUser.id === request.userId) {
      setCurrentUser(prev => prev ? { ...prev, isPremium: true } : null);
    }

    const targetNotification: Notification = {
      id: `NOT-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: request.userId,
      type: "system",
      content: "تهانينا! تمت الموافقة على اشتراكك في باقة التميز بنجاح. يمكنك الآن التحدث وإرسال رسائل غير محدودة ورفع صورتك الشخصية.",
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setNotifications(prev => [targetNotification, ...prev]);

    supabase.from("premium_requests").update({ status: "approved" }).eq("id", requestId).then();
    supabase.from("profiles").update({ isPremium: true }).eq("id", request.userId).then();
    supabase.from("notifications").insert(targetNotification).then();
  };

  const adminRejectPremium = (requestId: string) => {
    const request = premiumRequests.find(r => r.id === requestId);
    if (!request) return;

    setPremiumRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: "rejected" } : r));

    const targetNotification: Notification = {
      id: `NOT-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: request.userId,
      type: "system",
      content: "تم رفض طلب اشتراكك في الباقة المميزة. يرجى التأكد من عملية التحويل وإعادة تقديم الطلب.",
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setNotifications(prev => [targetNotification, ...prev]);

    supabase.from("premium_requests").update({ status: "rejected" }).eq("id", requestId).then();
    supabase.from("notifications").insert(targetNotification).then();
  };

  const adminVerifyUser = (userId: string) => {
    setProfiles(prev => prev.map(p => p.id === userId ? { ...p, isVerified: true } : p));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, isVerified: true } : null);
    }

    const targetNotification: Notification = {
      id: `NOT-${Math.floor(10000 + Math.random() * 90000)}`,
      userId,
      type: "system",
      content: "لقد تم التحقق من ملفك الشخصي ومراجعته من الإدارة بنجاح. ملفك يحمل الآن الشارة الموثقة لمزيد من الجدية.",
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setNotifications(prev => [targetNotification, ...prev]);

    supabase.from("profiles").update({ isVerified: true }).eq("id", userId).then();
    supabase.from("notifications").insert(targetNotification).then();
  };

  const adminDeleteUser = (userId: string) => {
    setProfiles(prev => prev.filter(p => p.id !== userId));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(null);
    }
    supabase.from("profiles").delete().eq("id", userId).then();
  };

  const adminApproveStory = (storyId: string) => {
    setSuccessStories(prev => prev.map(s => s.id === storyId ? { ...s, isApproved: true } : s));
    supabase.from("success_stories").update({ isApproved: true }).eq("id", storyId).then();
  };

  const adminAddStory = (husband: string, wife: string, storyContent: string) => {
    const newStory: SuccessStory = {
      id: `STORY-${Math.floor(1000 + Math.random() * 9000)}`,
      husbandName: husband,
      wifeName: wife,
      story: storyContent,
      date: new Date().toISOString().split('T')[0],
      isApproved: false,
      avatarHusband: "male_4",
      avatarWife: "female_4"
    };

    const systemNotif: Notification = {
      id: `NOT-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: "ADMIN",
      type: "verify_request",
      content: `قصة نجاح جديدة مضافة للمراجعة: ${husband} و ${wife}`,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setSuccessStories(prev => [newStory, ...prev]);
    setNotifications(prev => [systemNotif, ...prev]);

    supabase.from("success_stories").insert(newStory).then();
    supabase.from("notifications").insert(systemNotif).then();
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
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
