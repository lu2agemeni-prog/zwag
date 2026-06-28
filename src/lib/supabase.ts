import { createClient } from "@supabase/supabase-js";

// Retrieve configuration keys with direct fallback to ensure seamless operation
const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL || "https://ckuvpjbxperbbbunjsph.supabase.co";
const SUPABASE_ANON_KEY = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrdXZwamJ4cGVyYmJidW5qc3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NTU1MjcsImV4cCI6MjA5ODIzMTUyN30.btpPyFgMK6MvISLELcs5U6fMGDWDNDYLtyILYjHVwPc";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper script to create tables in the Supabase SQL Editor
export const SUPABASE_SQL_SETUP = `-- ====================================================================
-- مودة ورحمة - سكريبت إنشاء الجداول لقاعدة بيانات Supabase
-- قم بنسخ هذا السكريبت ولصقه في قسم SQL Editor في مشروعك على Supabase
-- ====================================================================

-- 1. جدول الملفات الشخصية (profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT UNIQUE NOT NULL,
  "mobile" TEXT NOT NULL,
  "isMobileVerified" BOOLEAN DEFAULT FALSE,
  "agreedToCharter" BOOLEAN DEFAULT FALSE,
  "gender" TEXT NOT NULL,
  "avatar" TEXT NOT NULL,
  "profileImage" TEXT,
  "age" INTEGER NOT NULL,
  "nationality" TEXT NOT NULL,
  "residence" TEXT NOT NULL,
  "profession" TEXT,
  "education" TEXT NOT NULL,
  "income" TEXT NOT NULL,
  "maritalStatus" TEXT NOT NULL,
  "hasChildren" BOOLEAN DEFAULT FALSE,
  "childrenCount" INTEGER DEFAULT 0,
  "isSmoker" BOOLEAN DEFAULT FALSE,
  "height" INTEGER NOT NULL,
  "weight" INTEGER NOT NULL,
  "skinColor" TEXT NOT NULL,
  "bodyBuild" TEXT NOT NULL,
  "healthStatus" TEXT NOT NULL,
  "hasDisability" BOOLEAN DEFAULT FALSE,
  "chronicDiseases" TEXT,
  "religiousCommitment" TEXT NOT NULL,
  "prayers" TEXT NOT NULL,
  "hasBeard" BOOLEAN,
  "hijabType" TEXT,
  "qaImaStance" TEXT NOT NULL,
  "mahrOpinion" TEXT NOT NULL,
  "marriageTimeframe" TEXT NOT NULL,
  "shariaVisionStance" TEXT NOT NULL,
  "aboutMe" TEXT NOT NULL,
  "partnerSpecs" TEXT NOT NULL,
  "hobbies" TEXT[] DEFAULT '{}',
  "isPremium" BOOLEAN DEFAULT FALSE,
  "isVerified" BOOLEAN DEFAULT FALSE,
  "premiumExpiryDate" TEXT,
  "joinDate" TEXT NOT NULL,
  "isOnline" BOOLEAN DEFAULT FALSE,
  "lastSeen" TEXT,
  "viewsCount" INTEGER DEFAULT 0
);
    
    
-- تمكين الوصول العام وقواعد الحماية (RLS) لجدول profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert to profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to profiles" ON public.profiles FOR UPDATE USING (true);

-- 2. جدول الرسائل (messages)
CREATE TABLE IF NOT EXISTS public.messages (
  "id" TEXT PRIMARY KEY,
  "senderId" TEXT REFERENCES public.profiles("id") ON DELETE CASCADE,
  "receiverId" TEXT REFERENCES public.profiles("id") ON DELETE CASCADE,
  "content" TEXT NOT NULL,
  "timestamp" TEXT NOT NULL,
  "isRead" BOOLEAN DEFAULT FALSE
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to messages" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert to messages" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to messages" ON public.messages FOR UPDATE USING (true);

-- 3. جدول الإشعارات (notifications)
CREATE TABLE IF NOT EXISTS public.notifications (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "senderId" TEXT,
  "senderName" TEXT,
  "content" TEXT NOT NULL,
  "timestamp" TEXT NOT NULL,
  "isRead" BOOLEAN DEFAULT FALSE
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Allow public insert to notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to notifications" ON public.notifications FOR UPDATE USING (true);

-- 4. جدول قصص النجاح (success_stories)
CREATE TABLE IF NOT EXISTS public.success_stories (
  "id" TEXT PRIMARY KEY,
  "husbandName" TEXT NOT NULL,
  "wifeName" TEXT NOT NULL,
  "story" TEXT NOT NULL,
  "date" TEXT NOT NULL,
  "isApproved" BOOLEAN DEFAULT FALSE,
  "avatarHusband" TEXT,
  "avatarWife" TEXT
);

ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to success_stories" ON public.success_stories FOR SELECT USING (true);
CREATE POLICY "Allow public insert to success_stories" ON public.success_stories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to success_stories" ON public.success_stories FOR UPDATE USING (true);

-- 5. جدول التفاعلات (interactions)
CREATE TABLE IF NOT EXISTS public.interactions (
  "id" TEXT PRIMARY KEY,
  "fromUserId" TEXT REFERENCES public.profiles("id") ON DELETE CASCADE,
  "toUserId" TEXT REFERENCES public.profiles("id") ON DELETE CASCADE,
  "type" TEXT NOT NULL,
  "reason" TEXT,
  "timestamp" TEXT NOT NULL
);

ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to interactions" ON public.interactions FOR SELECT USING (true);
CREATE POLICY "Allow public insert to interactions" ON public.interactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to interactions" ON public.interactions FOR UPDATE USING (true);

-- 6. جدول طلبات الاشتراك المميز (premium_requests)
CREATE TABLE IF NOT EXISTS public.premium_requests (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "userName" TEXT NOT NULL,
  "userGender" TEXT NOT NULL,
  "planDuration" TEXT NOT NULL,
  "paymentMethod" TEXT NOT NULL,
  "phoneNumber" TEXT,
  "status" TEXT DEFAULT 'pending',
  "timestamp" TEXT NOT NULL
);

ALTER TABLE public.premium_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to premium_requests" ON public.premium_requests FOR SELECT USING (true);
CREATE POLICY "Allow public insert to premium_requests" ON public.premium_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to premium_requests" ON public.premium_requests FOR UPDATE USING (true);
`;
