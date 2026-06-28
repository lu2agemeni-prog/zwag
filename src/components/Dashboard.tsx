import React from "react";
import { useApp } from "../lib/store";
import { Gender } from "../types";
import { getAvatarUrl } from "../lib/avatarUtils";
import { motion } from "motion/react";
import { 
  Menu, Sparkles, Heart, CheckCircle, Shield, 
  Users, Eye, Award, ExternalLink, HelpCircle, AlertTriangle, Loader2
} from "lucide-react";

interface DashboardProps {
  onOpenSidebar: () => void;
  setActiveScreen: (screen: string) => void;
  onSelectProfile: (userId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onOpenSidebar, setActiveScreen, onSelectProfile }) => {
  const { currentUser, profiles, successStories, interactions, isSupabaseLoading } = useApp();

  if (!currentUser) return null;

  const oppositeGender = currentUser.gender === Gender.MALE ? Gender.FEMALE : Gender.MALE;
  const oppositeGenderProfiles = profiles.filter(p => p.gender === oppositeGender && p.name !== "");

  // من أبدى اهتمام حقيقي من DB
  const whoInterestedIds = interactions
    .filter(i => i.toUserId === currentUser.id && i.type === "interest")
    .map(i => i.fromUserId);

  const whoInterestedProfiles = oppositeGenderProfiles.filter(p => whoInterestedIds.includes(p.id));
  const activeStories = successStories.filter(s => s.isApproved).slice(0, 2);

  return (
    <div className="pb-24 pt-4 font-sans text-right min-h-screen bg-slate-50" dir="rtl">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onOpenSidebar} className="p-2 hover:bg-slate-100 rounded-xl text-slate-700 transition">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-semibold">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>نظام إسلامي جاد</span>
          </div>
        </div>
        <img 
          src={getAvatarUrl(currentUser.avatar, currentUser.profileImage)}
          alt={currentUser.name}
          className="w-10 h-10 rounded-full object-cover border border-slate-200"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="max-w-xl mx-auto px-4 mt-6 space-y-6">
        
        {/* Loading Indicator */}
        {isSupabaseLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-white p-3 rounded-xl border border-slate-100">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
            <span>جاري تحميل البيانات من قاعدة البيانات...</span>
          </div>
        )}

        {/* Verification Warning */}
        {!currentUser.isVerified && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-amber-900 text-sm">حسابك في مرحلة المراجعة الأمنية</h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                تقوم إدارة مودة ورحمة بالتحقق اليدوي من جدية الحسابات. ملفك الآن متاح للتصفح ولكن قيد المراجعة.
              </p>
            </div>
          </div>
        )}

        {/* Welcome Card */}
        <div className="bg-gradient-to-br from-emerald-800 to-teal-800 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-emerald-800/10">
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 space-y-4">
            <div className="space-y-1">
              <span className="text-emerald-200 text-xs font-semibold">مرحباً بك في مودة ورحمة</span>
              <h2 className="text-xl font-bold">{currentUser.name || "عضو جاد"}</h2>
              <p className="text-xs text-emerald-100 font-mono">عضوية رقم: {currentUser.id}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {currentUser.isVerified && (
                <span className="bg-emerald-500/30 text-emerald-300 text-xs px-2.5 py-1 rounded-full font-semibold border border-emerald-400/30 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  حساب موثق
                </span>
              )}
              {currentUser.isPremium ? (
                <span className="bg-amber-500 text-slate-950 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                  {currentUser.premiumExpiryDate ? `متميز حتى ${currentUser.premiumExpiryDate}` : "باقة التميز نشطة"}
                </span>
              ) : (
                <span onClick={() => setActiveScreen("premium")} className="bg-white/10 hover:bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-semibold border border-white/20 flex items-center gap-1 transition cursor-pointer">
                  باقة مجانية — ترقية الآن
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2">
            <div className="p-2 bg-pink-50 text-pink-500 w-fit rounded-xl">
              <Heart className="w-5 h-5 fill-pink-500" />
            </div>
            <div>
              <span className="text-slate-400 text-xs font-semibold">متوافقون معك</span>
              <h3 className="text-xl font-extrabold text-slate-800">{oppositeGenderProfiles.length} ملفاً</h3>
            </div>
            <p className="text-[10px] text-slate-400">أعضاء من الجنس الآخر مكتملو الملف</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 w-fit rounded-xl">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <span className="text-slate-400 text-xs font-semibold">زيارات ملفك</span>
              <h3 className="text-xl font-extrabold text-slate-800">{currentUser.viewsCount || 0} زيارة</h3>
            </div>
            <p className="text-[10px] text-slate-400">عدد المشاهدات الفعلية من قاعدة البيانات</p>
          </div>
        </div>

        {/* من يهتم بي — بيانات حقيقية */}
        {whoInterestedProfiles.length > 0 && (
          <div className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
            <div className="p-4 flex justify-between items-center bg-pink-50/50 border-b border-pink-100">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                <h3 className="font-bold text-slate-800 text-sm">أبدى اهتمامه بك ({whoInterestedProfiles.length})</h3>
              </div>
              <button onClick={() => setActiveScreen("who_interested")} className="text-pink-600 text-xs font-bold hover:underline">
                عرض الكل ←
              </button>
            </div>
            <div className="p-3 space-y-1">
              {whoInterestedProfiles.slice(0, 2).map(p => (
                <div key={p.id} onClick={() => onSelectProfile(p.id)} className="p-3 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center gap-3">
                  <img src={getAvatarUrl(p.avatar, p.profileImage)} alt={p.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" referrerPolicy="no-referrer" />
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-xs">{p.name}</h4>
                    <p className="text-[10px] text-slate-400">{p.age} سنة • {p.nationality}</p>
                  </div>
                  <span className="text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-1 rounded-full animate-pulse">مهتم</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Profiles */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 flex justify-between items-center bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-800 text-sm">مقترحات شرعية لك</h3>
            </div>
            <button onClick={() => setActiveScreen("search")} className="text-emerald-600 text-xs font-bold hover:underline">
              بحث متقدم ←
            </button>
          </div>
          <div className="divide-y divide-slate-50 p-3">
            {oppositeGenderProfiles.length === 0 && !isSupabaseLoading ? (
              <p className="text-center text-xs text-slate-400 p-4">لا توجد ملفات بعد. سجّل أعضاء جدد أو تحقق من اتصال Supabase.</p>
            ) : (
              oppositeGenderProfiles.slice(0, 3).map(p => (
                <div key={p.id} onClick={() => onSelectProfile(p.id)} className="p-3 hover:bg-slate-50 rounded-xl transition cursor-pointer flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img src={getAvatarUrl(p.avatar, p.profileImage)} alt={p.name} className="w-11 h-11 rounded-full object-cover border border-slate-200" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{p.name}</h4>
                      <p className="text-xs text-slate-400">{p.age} سنة • {p.nationality} • {p.residence}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full">
                    <span>عرض</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Premium Banner */}
        {!currentUser.isPremium && (
          <div className="bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-transparent border border-amber-500/20 rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-1 relative z-10">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
                اشترك في باقة التميز الشرعية
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
                تواصل مباشر، رسائل غير محدودة، صورة شخصية، وتصفح خفي وآمن.
              </p>
            </div>
            <button onClick={() => setActiveScreen("premium")} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-md relative z-10 whitespace-nowrap">
              انضم للتميز الآن
            </button>
          </div>
        )}

        {/* Success Stories */}
        {activeStories.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-r-4 border-emerald-600 pr-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-800 text-sm">قصص نجاح من مودة ورحمة</h3>
            </div>
            <div className="space-y-3">
              {activeStories.map(story => (
                <div key={story.id} className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2 space-x-reverse">
                      <img src={getAvatarUrl(story.avatarHusband || "male_4")} className="w-7 h-7 rounded-full object-cover border border-white z-10" alt="" />
                      <img src={getAvatarUrl(story.avatarWife || "female_4")} className="w-7 h-7 rounded-full object-cover border border-white" alt="" />
                    </div>
                    <h5 className="text-xs font-bold text-emerald-800">{story.husbandName} و {story.wifeName}</h5>
                    <span className="text-[10px] text-slate-400 mr-auto">{story.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">"{story.story}"</p>
                </div>
              ))}
            </div>
            <button onClick={() => setActiveScreen("success_stories")} className="w-full py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-xl transition">
              تصفح المزيد من قصص النجاح
            </button>
          </div>
        )}

        {/* Islamic Reminder */}
        <div className="bg-slate-950 text-slate-200 rounded-3xl p-6 space-y-4 border border-slate-800 relative overflow-hidden">
          <div className="absolute left-2 top-2 opacity-10">
            <HelpCircle className="w-24 h-24 text-white" />
          </div>
          <div className="space-y-1 relative z-10">
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              تذكير بآداب البحث والتعارف الشرعي
            </h4>
          </div>
          <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside leading-relaxed relative z-10">
            <li>كن صادقاً وواضحاً في كل تفاصيل ملفك الشخصي.</li>
            <li>تحدث باحترام وعفة تامة في جميع مراحل التواصل.</li>
            <li>لا تسعَ خلف العلاقات خارج إطار الجدية وطلب الرؤية الشرعية.</li>
            <li>بادر بإدخال الأهل في أقرب وقت لتبني زواجاً سليماً ومباركاً.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
