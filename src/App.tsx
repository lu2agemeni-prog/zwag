import React, { useState } from "react";
import { AppProvider, useApp } from "./lib/store";
import { getAvatarUrl } from "./lib/avatarUtils";
import { AuthFlow } from "./components/AuthFlow";
import { Sidebar } from "./components/Sidebar";
import { BottomBar } from "./components/BottomBar";
import { Dashboard } from "./components/Dashboard";
import { SearchPage } from "./components/SearchPage";
import { ProfileDetails } from "./components/ProfileDetails";
import { InboxPage } from "./components/InboxPage";
import { PremiumPage } from "./components/PremiumPage";
import { AdminPanel } from "./components/AdminPanel";
import { SuccessStories } from "./components/SuccessStories";
import { Gender, MaritalStatus } from "./types";
import { 
  Heart, EyeOff, Users, Mail, Phone, Award, 
  MapPin, User, ShieldCheck, Sparkles, Send, AlertCircle, Edit, Star 
} from "lucide-react";

const AppContent: React.FC = () => {
  const { currentUser, profiles, interactions, updateProfile, unignoreProfile } = useApp();
  const [activeScreen, setActiveScreen] = useState<string>("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [selectedChatUserId, setSelectedChatUserId] = useState<string | null>(null);

  // Edit profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editAboutMe, setEditAboutMe] = useState(currentUser?.aboutMe || "");
  const [editPartnerSpecs, setEditPartnerSpecs] = useState(currentUser?.partnerSpecs || "");

  // Contact Us state
  const [contactSubject, setContactSubject] = useState("");
  const [contactBody, setContactBody] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  if (!currentUser) {
    return <AuthFlow />;
  }

  // Handle opening profile details
  const handleSelectProfile = (userId: string) => {
    setSelectedProfileId(userId);
    setActiveScreen("profile_details");
  };

  // Helper lists
  const oppositeGender = currentUser.gender === Gender.MALE ? Gender.FEMALE : Gender.MALE;
  const matchProfiles = profiles.filter(p => p.gender === oppositeGender && p.name !== "");

  // 1. My Interests
  const interestedUserIds = interactions
    .filter(i => i.fromUserId === currentUser.id && i.type === "interest")
    .map(i => i.toUserId);
  const interestedProfiles = matchProfiles.filter(p => interestedUserIds.includes(p.id));

  // 2. My Ignored
  const ignoredUserIds = interactions
    .filter(i => i.fromUserId === currentUser.id && i.type === "ignore")
    .map(i => i.toUserId);
  const ignoredProfiles = matchProfiles.filter(p => ignoredUserIds.includes(p.id));

  // 3. Who interested in me (In demo state: show 2 random opposite-gender profiles as "interested in you" for realistic testing)
  const whoInterestedIds = interactions
    .filter(i => i.toUserId === currentUser.id && i.type === "interest")
    .map(i => i.fromUserId);
  const whoInterestedProfiles = matchProfiles.filter(p => whoInterestedIds.includes(p.id));

  const handleUpdateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editAboutMe.length < 140 || editPartnerSpecs.length < 140) {
      alert("عذراً، يجب ألا تقل فقرة التحدث عن النفس أو فقرة مواصفات الشريك عن 140 حرفاً لضمان الجدية التامة.");
      return;
    }
    updateProfile({
      aboutMe: editAboutMe,
      partnerSpecs: editPartnerSpecs
    });
    setIsEditingProfile(false);
    alert("تم تحديث الفقرات التعريفية بنجاح!");
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setContactSubject("");
    setContactBody("");
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 pb-20 select-none">
      
      {/* Sidebar Menu */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        activeScreen={activeScreen} 
        setActiveScreen={(screen) => {
          setActiveScreen(screen);
          setSelectedProfileId(null);
          setSelectedChatUserId(null);
        }} 
      />

      {/* Main Screen Switcher */}
      <main className="max-w-md mx-auto">
        {selectedProfileId && activeScreen === "profile_details" ? (
          <ProfileDetails 
            userId={selectedProfileId} 
            onBack={() => {
              setSelectedProfileId(null);
              setActiveScreen("search");
            }} 
            onOpenChat={(id) => {
              setSelectedChatUserId(id);
              setActiveScreen("notifications");
              setSelectedProfileId(null);
            }}
            setActiveScreen={setActiveScreen}
          />
        ) : (
          <>
            {/* Screen: Home */}
            {activeScreen === "home" && (
              <Dashboard 
                onOpenSidebar={() => setIsSidebarOpen(true)} 
                setActiveScreen={setActiveScreen}
                onSelectProfile={handleSelectProfile}
              />
            )}

            {/* Screen: Search */}
            {activeScreen === "search" && (
              <SearchPage onSelectProfile={handleSelectProfile} />
            )}

            {/* Screen: Notifications and Chat */}
            {activeScreen === "notifications" && (
              <InboxPage 
                selectedChatUserId={selectedChatUserId} 
                onCloseChat={() => setSelectedChatUserId(null)} 
                onOpenChat={(id) => setSelectedChatUserId(id)}
              />
            )}

            {/* Screen: Premium Page */}
            {activeScreen === "premium" && (
              <PremiumPage />
            )}

            {/* Screen: Success Stories */}
            {activeScreen === "success_stories" && (
              <SuccessStories />
            )}

            {/* Screen: Admin Panel */}
            {activeScreen === "admin" && (
              <AdminPanel />
            )}

            {/* Screen: My Profile */}
            {activeScreen === "profile" && (
              <div className="p-4 space-y-6 pt-6 text-right" dir="rtl">
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm text-center space-y-4">
                  <div className="relative w-24 h-24 mx-auto">
                    <img 
                      src={getAvatarUrl(currentUser.avatar, currentUser.profileImage)} 
                      alt="" 
                      className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 shadow-md"
                      referrerPolicy="no-referrer"
                    />
                    {currentUser.isVerified && (
                      <div className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1 rounded-full border-2 border-white shadow">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-slate-800">{currentUser.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">رقم الهوية: {currentUser.id} • جوال: {currentUser.mobile}</p>
                  </div>
                </div>

                {!isEditingProfile ? (
                  <div className="space-y-4">
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
                      <h4 className="font-bold text-slate-800 text-xs flex justify-between items-center">
                        <span>الفقرات التعريفية الحالية</span>
                        <button 
                          onClick={() => {
                            setEditAboutMe(currentUser.aboutMe);
                            setEditPartnerSpecs(currentUser.partnerSpecs);
                            setIsEditingProfile(true);
                          }}
                          className="text-emerald-600 text-xs font-bold flex items-center gap-1 hover:underline"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          تعديل الفقرات
                        </button>
                      </h4>

                      <div className="space-y-3 pt-2">
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold">عن نفسي:</span>
                          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                            "{currentUser.aboutMe}"
                          </p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold">شريك حياتي المطلوب:</span>
                          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                            "{currentUser.partnerSpecs}"
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
                      <h4 className="font-bold text-slate-800 text-xs">مواصفاتي التفصيلية المسجلة</h4>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[9px] text-slate-400 block">السن</span>
                          <span className="font-bold text-slate-800">{currentUser.age} سنة</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[9px] text-slate-400 block">الجنسية</span>
                          <span className="font-bold text-slate-800">{currentUser.nationality}</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[9px] text-slate-400 block">بلد الإقامة</span>
                          <span className="font-bold text-slate-800">{currentUser.residence}</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[9px] text-slate-400 block">الحالة الاجتماعية</span>
                          <span className="font-bold text-slate-800">{currentUser.maritalStatus}</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[9px] text-slate-400 block">المؤهل</span>
                          <span className="font-bold text-slate-800">{currentUser.education}</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[9px] text-slate-400 block">التدين</span>
                          <span className="font-bold text-slate-800">{currentUser.religiousCommitment}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateProfileSubmit} className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-4">
                    <h3 className="font-bold text-slate-800 text-sm">تعديل فقرات الملف الشخصي</h3>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 block flex justify-between">
                        <span>تحدث عن نفسك بالتفصيل</span>
                        <span className="text-[10px] font-mono text-slate-400">{editAboutMe.length} / 140 حرف كحد أدنى</span>
                      </label>
                      <textarea
                        required
                        value={editAboutMe}
                        onChange={(e) => setEditAboutMe(e.target.value)}
                        rows={5}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 block flex justify-between">
                        <span>المواصفات المطلوبة في شريك الحياة</span>
                        <span className="text-[10px] font-mono text-slate-400">{editPartnerSpecs.length} / 140 حرف كحد أدنى</span>
                      </label>
                      <textarea
                        required
                        value={editPartnerSpecs}
                        onChange={(e) => setEditPartnerSpecs(e.target.value)}
                        rows={5}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white leading-relaxed"
                      />
                    </div>

                    <div className="flex gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="w-1/3 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 transition"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-600/10"
                      >
                        حفظ التعديلات
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Screen: My Interests list */}
            {activeScreen === "interests" && (
              <div className="p-4 space-y-4 pt-6 text-right" dir="rtl">
                <div className="text-center space-y-1">
                  <Heart className="w-10 h-10 text-pink-500 fill-pink-500 mx-auto" />
                  <h3 className="text-xl font-bold text-slate-800">قائمة اهتماماتك الشخصية</h3>
                  <p className="text-xs text-slate-400">الملفات التي أبديت اهتمامك بها للتعارف الجاد</p>
                </div>

                {interestedProfiles.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center text-slate-400 text-xs">
                    قائمتك فارغة حالياً. تصفح الملفات وعبر عن اهتمامك بالملفات التي تعجبك لتظهر هنا.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {interestedProfiles.map(p => (
                      <div 
                        key={p.id}
                        onClick={() => handleSelectProfile(p.id)}
                        className="bg-white p-4 rounded-2xl border border-slate-100 hover:shadow transition cursor-pointer flex gap-3 items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={getAvatarUrl(p.avatar, p.profileImage)} 
                            alt="" 
                            className="w-12 h-12 rounded-full object-cover border border-slate-200"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1">
                              {p.name}
                              {p.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                            </h4>
                            <p className="text-[10px] text-slate-400">{p.age} سنة • {p.nationality} • يقيم في {p.residence}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">عرض التفاصيل</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Screen: Ignored list */}
            {activeScreen === "ignored" && (
              <div className="p-4 space-y-4 pt-6 text-right" dir="rtl">
                <div className="text-center space-y-1">
                  <EyeOff className="w-10 h-10 text-slate-400 mx-auto" />
                  <h3 className="text-xl font-bold text-slate-800">قائمة المتجاهلين</h3>
                  <p className="text-xs text-slate-400">الملفات التي قمت بتجاهلها لإخفائها من لوائح البحث السريع والمتقدم</p>
                </div>

                {ignoredProfiles.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center text-slate-400 text-xs">
                    قائمة التجاهل فارغة تماماً.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {ignoredProfiles.map(p => (
                      <div 
                        key={p.id}
                        className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-3 items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={getAvatarUrl(p.avatar, p.profileImage)} 
                            alt="" 
                            className="w-12 h-12 rounded-full object-cover border border-slate-200"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{p.name}</h4>
                            <p className="text-[10px] text-slate-400">{p.age} سنة • {p.nationality}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            unignoreProfile(p.id);
                            alert(`تم إزالة العضو ${p.name} من قائمة المتجاهلين ويمكنه الظهور مجدداً.`);
                          }}
                          className="text-xs font-bold text-rose-600 hover:underline"
                        >
                          إلغاء التجاهل
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Screen: Who is interested in me */}
            {activeScreen === "who_interested" && (
              <div className="p-4 space-y-4 pt-6 text-right" dir="rtl">
                <div className="text-center space-y-1">
                  <Users className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="text-xl font-bold text-slate-800">من يهتم بملفي الشخصي؟</h3>
                  <p className="text-xs text-slate-400">الملفات التي أبدت اهتماماً حقيقياً وموثقاً بك لتسهيل الاتفاق</p>
                </div>

                {whoInterestedProfiles.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center text-slate-400 text-xs">
                    لم يبد أحد اهتماماً بملفك بعد، احرص على تفصيل فقرات التعريف بالذات لزيادة نسب القبول.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {whoInterestedProfiles.map(p => (
                      <div 
                        key={p.id}
                        onClick={() => handleSelectProfile(p.id)}
                        className="bg-white p-4 rounded-2xl border border-slate-100 hover:shadow transition cursor-pointer flex gap-3 items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={getAvatarUrl(p.avatar, p.profileImage)} 
                            alt="" 
                            className="w-12 h-12 rounded-full object-cover border border-slate-200"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1">
                              {p.name}
                              {p.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                            </h4>
                            <p className="text-[10px] text-slate-400">{p.age} سنة • {p.nationality} • يقيم في {p.residence}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                          <Star className="w-3.5 h-3.5 fill-pink-600" />
                          مهتم بك
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Screen: Contact Us */}
            {activeScreen === "contact_us" && (
              <div className="p-4 space-y-6 pt-6 text-right font-sans" dir="rtl">
                <div className="text-center space-y-1">
                  <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-full">
                    <Mail className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">اتصل بنا وادعم مودة ورحمة</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                    فريق الدعم الفني والإرشاد الأسري الموثق جاهز للرد على استفساراتكم أو تلقي الاقتراحات والمباركات طوال اليوم.
                  </p>
                </div>

                {!contactSubmitted ? (
                  <form onSubmit={handleContactSubmit} className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">عنوان الرسالة أو الموضوع</label>
                      <input 
                        type="text"
                        required
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        placeholder="استفسار عن تفعيل باقة التميز / مشكلة تقنية"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">نص الرسالة بالتفصيل</label>
                      <textarea 
                        required
                        value={contactBody}
                        onChange={(e) => setContactBody(e.target.value)}
                        rows={4}
                        placeholder="يرجى كتابة رسالتك أو مشكلتك بوضوح تام، وسوف نرد على بريدكم الإلكتروني في أقل من ساعتين."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/10"
                    >
                      <Send className="w-4 h-4" />
                      <span>إرسال الرسالة للإدارة</span>
                    </button>
                  </form>
                ) : (
                  <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm text-center space-y-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full w-fit mx-auto">
                      <ShieldCheck className="w-10 h-10" />
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-800 text-sm">تم إرسال رسالتك لفريق الدعم بنجاح!</h4>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                        نشكر تواصلك الراقي معنا. تم قيد الرسالة في تذاكر الدعم وسيرد عليك ممثلو خدمة مودة ورحمة على بريدك الإلكتروني قريباً جداً.
                      </p>
                    </div>

                    <button
                      onClick={() => setContactSubmitted(false)}
                      className="text-emerald-700 text-xs font-bold underline hover:text-emerald-800"
                    >
                      إرسال رسالة أخرى
                    </button>
                  </div>
                )}

                <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200/55 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800">قنوات التواصل المباشر السريعة:</h4>
                  <div className="text-[11px] text-slate-600 space-y-1">
                    <p className="flex items-center gap-1.5 font-mono"><Mail className="w-3.5 h-3.5 text-slate-400" /> support@mawada-rahma.com</p>
                    <p className="flex items-center gap-1.5 font-mono"><Phone className="w-3.5 h-3.5 text-slate-400" /> +20 1012345678</p>
                  </div>
                </div>
              </div>
            )}

          </>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <BottomBar 
        activeScreen={activeScreen} 
        setActiveScreen={(screen) => {
          setActiveScreen(screen);
          setSelectedProfileId(null);
          setSelectedChatUserId(null);
        }} 
      />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
