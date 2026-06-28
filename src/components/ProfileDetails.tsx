import React, { useState, useEffect } from "react";
import { useApp } from "../lib/store";
import { Gender, HijabType } from "../types";
import { getAvatarUrl } from "../lib/avatarUtils";
import { 
  Heart, EyeOff, Ban, AlertTriangle, MessageSquare, 
  Bookmark, ArrowRight, ShieldCheck, Sparkles, 
  CheckCircle, Lock, Eye
} from "lucide-react";

interface ProfileDetailsProps {
  userId: string;
  onBack: () => void;
  onOpenChat: (userId: string) => void;
  setActiveScreen: (screen: string) => void;
}

export const ProfileDetails: React.FC<ProfileDetailsProps> = ({ 
  userId, onBack, onOpenChat, setActiveScreen
}) => {
  const { 
    currentUser, profiles, expressInterest, ignoreProfile, 
    blockProfile, reportProfile, interactions, incrementViewCount
  } = useApp();

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [showPremiumBlocker, setShowPremiumBlocker] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [interestSent, setInterestSent] = useState(false);

  const profile = profiles.find(p => p.id === userId);

  // تسجيل المشاهدة عند فتح الملف
  useEffect(() => {
    if (profile && currentUser && profile.id !== currentUser.id) {
      incrementViewCount(profile.id);
    }
  }, [userId]);

  if (!profile) {
    return (
      <div className="p-8 text-center" dir="rtl">
        <p className="text-slate-600 font-bold">عذراً، لم يتم العثور على هذا العضو.</p>
        <button onClick={onBack} className="mt-4 text-emerald-600 font-bold underline">العودة للبحث</button>
      </div>
    );
  }

  const isInterested = interestSent || interactions.some(i => i.fromUserId === currentUser?.id && i.toUserId === profile.id && i.type === "interest");
  const isBlocked = interactions.some(i => i.fromUserId === currentUser?.id && i.toUserId === profile.id && i.type === "block");

  const handleInterest = () => {
    expressInterest(profile.id);
    setInterestSent(true);
  };

  const handleIgnore = () => {
    ignoreProfile(profile.id);
    onBack();
  };

  const handleBlock = () => {
    if (window.confirm("هل أنت متأكد من حظر هذا العضو؟ لن يتمكن من رؤيتك أو التواصل معك.")) {
      blockProfile(profile.id);
      onBack();
    }
  };

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason) return;
    reportProfile(profile.id, reportReason);
    setShowReportModal(false);
    setReportReason("");
    alert("شكراً لك. تم تقديم البلاغ للإدارة.");
  };

  const handleMessageClick = () => {
    if (!currentUser?.isPremium) {
      setShowPremiumBlocker(true);
    } else {
      onOpenChat(profile.id);
    }
  };

  const avatarUrl = getAvatarUrl(profile.avatar, profile.profileImage);

  return (
    <div className="pb-24 pt-4 font-sans text-right bg-slate-50 min-h-screen relative" dir="rtl">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
        <button onClick={onBack} className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition font-semibold text-sm">
          <ArrowRight className="w-5 h-5" />
          <span>العودة للبحث</span>
        </button>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Eye className="w-3.5 h-3.5" />
          <span>{profile.viewsCount || 0} مشاهدة</span>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 mt-6 space-y-5">
        
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4 relative overflow-hidden">
          {profile.isPremium && (
            <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-bl-2xl flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              عضو متميز
            </div>
          )}

          <div className="flex flex-col items-center text-center space-y-3 pt-2">
            <div className="relative">
              <img 
                src={avatarUrl}
                alt={profile.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 shadow-md"
                referrerPolicy="no-referrer"
              />
              {profile.isVerified && (
                <div className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1 rounded-full border-2 border-white shadow">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-800">{profile.name}</h3>
              <p className="text-xs text-slate-400 font-mono">عضوية: {profile.id} • انضم: {profile.joinDate}</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="bg-emerald-50 text-emerald-800 text-xs px-3 py-1 rounded-full font-semibold">
                {profile.religiousCommitment}
              </span>
              <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full font-semibold">
                {profile.age} سنة • {profile.maritalStatus}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${profile.isOnline ? "bg-green-50 text-green-700" : "bg-slate-50 text-slate-400"}`}>
                {profile.isOnline ? "● متاح الآن" : `آخر ظهور: ${profile.lastSeen || "غير محدد"}`}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex justify-around gap-2">
          <button 
            onClick={handleInterest}
            disabled={isInterested}
            className={`flex flex-col items-center justify-center flex-1 py-3 rounded-xl border transition ${
              isInterested ? "bg-pink-50 border-pink-200 text-pink-600" : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
            }`}
          >
            <Heart className={`w-5 h-5 mb-1 ${isInterested ? "fill-pink-600 text-pink-600" : ""}`} />
            <span className="text-[10px] font-bold">{isInterested ? "تم الإبداء" : "أبدِ اهتمام"}</span>
          </button>

          <button onClick={handleIgnore} className="flex flex-col items-center justify-center flex-1 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 bg-white transition">
            <EyeOff className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold">تجاهل</span>
          </button>

          <button onClick={handleMessageClick} className="flex flex-col items-center justify-center flex-1 py-3 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-700 transition">
            <MessageSquare className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold">رسالة</span>
          </button>

          <button 
            onClick={() => setIsSaved(!isSaved)}
            className={`flex flex-col items-center justify-center flex-1 py-3 rounded-xl border transition ${
              isSaved ? "bg-amber-50 border-amber-200 text-amber-600" : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
            }`}
          >
            <Bookmark className={`w-5 h-5 mb-1 ${isSaved ? "fill-amber-600" : ""}`} />
            <span className="text-[10px] font-bold">{isSaved ? "محفوظ" : "حفظ"}</span>
          </button>
        </div>

        {/* About Me & Partner Specs */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-5">
          <div className="space-y-2">
            <h4 className="font-extrabold text-emerald-800 text-sm border-r-4 border-emerald-600 pr-2">تحدث عن نفسه</h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-emerald-50/30 p-4 rounded-2xl border border-emerald-100/30 whitespace-pre-wrap">
              "{profile.aboutMe}"
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-extrabold text-emerald-800 text-sm border-r-4 border-emerald-600 pr-2">ما يبحث عنه في شريك الحياة</h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-teal-50/30 p-4 rounded-2xl border border-teal-100/30 whitespace-pre-wrap">
              "{profile.partnerSpecs}"
            </p>
          </div>
        </div>

        {/* Personal Info Grid */}
        <InfoSection title="البيانات الشخصية والاجتماعية">
          <InfoItem label="العمر" value={`${profile.age} سنة`} />
          <InfoItem label="الجنسية" value={profile.nationality} />
          <InfoItem label="الإقامة" value={profile.residence} />
          <InfoItem label="الحالة الاجتماعية" value={profile.maritalStatus} />
          <InfoItem label="الأطفال" value={profile.hasChildren ? `نعم (${profile.childrenCount})` : "لا يوجد"} />
          <InfoItem label="التدخين" value={profile.isSmoker ? "نعم، مدخن" : "لا يدخن"} />
        </InfoSection>

        {/* Physical */}
        <InfoSection title="المواصفات الجسمانية والصحية">
          <InfoItem label="الطول" value={`${profile.height} سم`} />
          <InfoItem label="الوزن" value={`${profile.weight} كجم`} />
          <InfoItem label="لون البشرة" value={profile.skinColor} />
          <InfoItem label="بنية الجسم" value={profile.bodyBuild} />
          <InfoItem label="الحالة الصحية" value={profile.healthStatus} fullWidth />
          {profile.hasDisability && <InfoItem label="أمراض مزمنة" value={profile.chronicDiseases || "—"} fullWidth />}
        </InfoSection>

        {/* Work & Education */}
        <InfoSection title="العمل والتعليم والدخل">
          <InfoItem label="المهنة" value={profile.profession || "—"} />
          <InfoItem label="المؤهل" value={profile.education} />
          <InfoItem label="مستوى الدخل" value={profile.income} fullWidth />
        </InfoSection>

        {/* Religious */}
        <InfoSection title="التدين والصلاة والزي">
          <InfoItem label="الالتزام الديني" value={profile.religiousCommitment} />
          <InfoItem label="المحافظة على الصلاة" value={profile.prayers} />
          {profile.gender === Gender.MALE 
            ? <InfoItem label="اللحية" value={profile.hasBeard ? "ملتحٍ" : "لا يوجد"} />
            : <InfoItem label="نوع الحجاب" value={profile.hijabType || "—"} />
          }
        </InfoSection>

        {/* Marriage Views */}
        <InfoSection title="رأيه في الاتفاقات الزواجية">
          <InfoItem label="القايمة (قائمة المنقولات)" value={profile.qaImaStance} fullWidth />
          <InfoItem label="المهر والشبكة" value={profile.mahrOpinion} fullWidth />
          <InfoItem label="الموعد المتوقع للزواج" value={profile.marriageTimeframe} />
          <InfoItem label="الرؤية الشرعية" value={profile.shariaVisionStance} fullWidth />
        </InfoSection>

        {/* Hobbies */}
        {profile.hobbies && profile.hobbies.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-3">
            <h4 className="font-extrabold text-slate-800 text-sm border-r-4 border-slate-300 pr-2">الهوايات والاهتمامات</h4>
            <div className="flex flex-wrap gap-2">
              {profile.hobbies.map(hobby => (
                <span key={hobby} className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-100">
                  {hobby}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Block / Report */}
        {!isBlocked && (
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex gap-3">
            <button onClick={handleBlock} className="flex items-center justify-center gap-2 flex-1 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-100 text-xs font-bold transition">
              <Ban className="w-4 h-4" />
              <span>حظر العضو</span>
            </button>
            <button onClick={() => setShowReportModal(true)} className="flex items-center justify-center gap-2 flex-1 py-2 rounded-xl text-amber-600 hover:bg-amber-50 border border-amber-100 text-xs font-bold transition">
              <AlertTriangle className="w-4 h-4" />
              <span>إبلاغ عن إساءة</span>
            </button>
          </div>
        )}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4" dir="rtl">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md border border-slate-100 space-y-4">
            <h3 className="font-bold text-slate-800 text-base text-center">إرسال بلاغ عن إساءة</h3>
            <form onSubmit={handleReport} className="space-y-4">
              <textarea
                required
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                rows={3}
                placeholder="وضح سبب البلاغ بالتفصيل..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowReportModal(false)} className="flex-1 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600">إلغاء</button>
                <button type="submit" className="flex-1 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold">إرسال البلاغ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Premium Blocker */}
      {showPremiumBlocker && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4" dir="rtl">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md border border-slate-100 text-center space-y-4">
            <div className="p-3 bg-amber-50 text-amber-500 w-fit rounded-full mx-auto">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 text-base">المحادثات للأعضاء المتميزين فقط</h3>
              <p className="text-xs text-slate-500 leading-relaxed">اشترك في باقة التميز لتتمكن من إرسال الرسائل وقراءتها وطلب الرؤية الشرعية.</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowPremiumBlocker(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600">لاحقاً</button>
              <button onClick={() => { setShowPremiumBlocker(false); setActiveScreen("premium"); }} className="flex-1 py-2.5 bg-amber-500 text-slate-950 rounded-xl text-xs font-extrabold">اشترك الآن</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// مكوّنات مساعدة للعرض
const InfoSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-3">
    <h4 className="font-extrabold text-slate-800 text-sm border-r-4 border-slate-300 pr-2">{title}</h4>
    <div className="grid grid-cols-2 gap-3 text-xs">{children}</div>
  </div>
);

const InfoItem: React.FC<{ label: string; value: string; fullWidth?: boolean }> = ({ label, value, fullWidth }) => (
  <div className={`bg-slate-50 p-3 rounded-xl border border-slate-100 ${fullWidth ? "col-span-2" : ""}`}>
    <span className="text-[10px] text-slate-400 block font-semibold">{label}</span>
    <span className="font-bold text-slate-800">{value}</span>
  </div>
);
