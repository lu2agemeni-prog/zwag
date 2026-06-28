import React from "react";
import { useApp } from "../lib/store";
import { Gender } from "../types";
import { motion } from "motion/react";
import { 
  Menu, Sparkles, Heart, CheckCircle, Shield, 
  Users, Eye, Award, ExternalLink, HelpCircle, AlertTriangle 
} from "lucide-react";

interface DashboardProps {
  onOpenSidebar: () => void;
  setActiveScreen: (screen: string) => void;
  onSelectProfile: (userId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  onOpenSidebar, 
  setActiveScreen,
  onSelectProfile
}) => {
  const { currentUser, profiles, successStories } = useApp();

  if (!currentUser) return null;

  // Filter candidates of opposite gender
  const oppositeGender = currentUser.gender === Gender.MALE ? Gender.FEMALE : Gender.MALE;
  const oppositeGenderProfiles = profiles.filter(p => p.gender === oppositeGender && p.name !== "");

  // Calculate matching count
  const matchingCount = oppositeGenderProfiles.length;

  const handleQuickMatchClick = () => {
    setActiveScreen("search");
  };

  const activeStories = successStories.filter(s => s.isApproved).slice(0, 2);

  return (
    <div className="pb-24 pt-4 font-sans text-right min-h-screen bg-slate-50" dir="rtl">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenSidebar}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-700 transition duration-150"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-semibold">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>نظام إسلامي جاد</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <img 
            src={`https://images.unsplash.com/photo-${currentUser.avatar === "male_1" ? "1534528741775-53994a69daeb" : currentUser.avatar === "female_1" ? "1494790108377-be9c29b29330" : "1507003211169-0a1dd7228f2d"}?auto=format&fit=crop&w=150&q=80`} 
            alt={currentUser.name} 
            className="w-10 h-10 rounded-full object-cover border border-slate-200"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 mt-6 space-y-6">
        
        {/* Verification Status Warning / Banner */}
        {!currentUser.isVerified && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-amber-900 text-sm">حسابك في مرحلة المراجعة الأمنية</h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                تقوم إدارة مودة ورحمة بالتحقق اليدوي من جدية الحسابات. ملفك الآن متاح للتصفح ولكن يحمل صفة قيد المراجعة.
              </p>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-emerald-800 to-teal-800 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-emerald-800/10">
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 space-y-4">
            <div className="space-y-1">
              <span className="text-emerald-200 text-xs font-semibold">مرحباً بك مجدداً في مودة ورحمة</span>
              <h2 className="text-xl font-bold">{currentUser.name || "عضو جاد"}</h2>
              <p className="text-xs text-emerald-100 font-mono">عضوية رقم: {currentUser.id}</p>
            </div>

            <div className="flex gap-2">
              {currentUser.isVerified && (
                <span className="bg-emerald-500/30 text-emerald-300 text-xs px-2.5 py-1 rounded-full font-semibold border border-emerald-400/30 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  حساب موثق
                </span>
              )}
              {currentUser.isPremium ? (
                <span className="bg-amber-500 text-slate-950 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                  باقة التميز نشطة
                </span>
              ) : (
                <span className="bg-white/10 hover:bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-semibold border border-white/20 flex items-center gap-1 transition cursor-pointer" onClick={() => setActiveScreen("premium")}>
                  باقة مجانية (ترقية الآن)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic High-Quality Stats Dashboard widgets */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2">
            <div className="p-2 bg-pink-50 text-pink-500 w-fit rounded-xl">
              <Heart className="w-5 h-5 fill-pink-500" />
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-400 text-xs font-semibold">متوافقين معك</span>
              <h3 className="text-xl font-extrabold text-slate-800">{matchingCount} ملفاً</h3>
            </div>
            <p className="text-[10px] text-slate-400">ملفات من الجنس الآخر متوافقة للبحث</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 w-fit rounded-xl">
              <Eye className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-400 text-xs font-semibold">زيارات لملفك</span>
              <h3 className="text-xl font-extrabold text-slate-800">{currentUser.viewsCount} زيارة</h3>
            </div>
            <p className="text-[10px] text-slate-400">عدد زيارات الأعضاء لملفك الشخصي</p>
          </div>
        </div>

        {/* Quick action banners */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 flex justify-between items-center bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-800 text-sm">عتبات شرعية مقترحة</h3>
            </div>
            <button 
              onClick={handleQuickMatchClick}
              className="text-emerald-600 text-xs font-bold hover:underline"
            >
              بحث متقدم ←
            </button>
          </div>

          <div className="divide-y divide-slate-50 p-3">
            {oppositeGenderProfiles.slice(0, 3).map(profile => (
              <div 
                key={profile.id}
                onClick={() => onSelectProfile(profile.id)}
                className="p-3 hover:bg-slate-50 rounded-xl transition cursor-pointer flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={profile.profileImage || `https://images.unsplash.com/photo-${profile.avatar === "male_1" ? "1534528741775-53994a69daeb" : profile.avatar === "female_1" ? "1494790108377-be9c29b29330" : "1507003211169-0a1dd7228f2d"}?auto=format&fit=crop&w=150&q=80`} 
                    alt={profile.name} 
                    className="w-11 h-11 rounded-full object-cover border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{profile.name}</h4>
                    <p className="text-xs text-slate-400">{profile.age} سنة • {profile.nationality} • يقيم في {profile.residence}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full">
                  <span>عرض</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Join Premium Banner */}
        {!currentUser.isPremium && (
          <div className="bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-transparent border border-amber-500/20 rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-1 relative z-10">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
                اشترك في باقة التميز الشرعية
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
                تواصل بشكل مباشر، وأرسل رسائل غير محدودة للمهتمين بك، مع إمكانية رفع صورتك الشخصية وتصفح الأعضاء بشكل خفي وآمن تماماً.
              </p>
            </div>
            <button 
              onClick={() => setActiveScreen("premium")}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-md shadow-amber-500/15 relative z-10 whitespace-nowrap"
            >
              انضم للتميز الآن
            </button>
          </div>
        )}

        {/* Success Stories Preview */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-r-4 border-emerald-600 pr-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-sm">قصص نجاح من مودة ورحمة</h3>
          </div>

          <div className="space-y-4">
            {activeStories.map(story => (
              <div key={story.id} className="bg-slate-50 p-4 rounded-xl space-y-2 relative border border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2 space-x-reverse">
                    <img 
                      src={`https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`} 
                      className="w-7 h-7 rounded-full object-cover border border-white z-10"
                      alt=""
                    />
                    <img 
                      src={`https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80`} 
                      className="w-7 h-7 rounded-full object-cover border border-white"
                      alt=""
                    />
                  </div>
                  <h5 className="text-xs font-bold text-emerald-800">{story.husbandName} و {story.wifeName}</h5>
                  <span className="text-[10px] text-slate-400 mr-auto">{story.date}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  "{story.story}"
                </p>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setActiveScreen("success_stories")}
            className="w-full py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-xl transition text-center block"
          >
            تصفح المزيد من قصص النجاح والمباركات
          </button>
        </div>

        {/* Matrimonial Guide lines */}
        <div className="bg-slate-950 text-slate-200 rounded-3xl p-6 space-y-4 border border-slate-800 relative overflow-hidden">
          <div className="absolute left-2 top-2 opacity-10">
            <HelpCircle className="w-24 h-24 text-white" />
          </div>
          <div className="space-y-1 relative z-10">
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              تذكير بآداب البحث والتعارف الشرعي
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              تذكر دائماً أن الغاية من هذا التطبيق هي تيسير السبل المباحة لبناء بيت مسلم طاهر قائم على طاعة الله. اتبع الوصايا التالية لتنال بركة السعي:
            </p>
          </div>

          <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside leading-relaxed relative z-10">
            <li>كن صادقاً وواضحاً في كل التفاصيل التي تعرضها في ملفك.</li>
            <li>تحدث بوعي وناضجة فكرياً وبمنتهى الاحترام والمحافظة.</li>
            <li>لا تسعى خلف العلاقات خارج إطار الجدية وطلب الرؤية الشرعية الرسمية.</li>
            <li>بادر بإدخال الأهل في أقرب مرحلة ممكنة لتبني زواجاً سليماً ومباركاً.</li>
          </ul>
        </div>

      </div>
    </div>
  );
};
