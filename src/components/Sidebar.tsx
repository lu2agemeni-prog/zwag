import React from "react";
import { useApp } from "../lib/store";
import { motion, AnimatePresence } from "motion/react";
import { 
  Home, Bell, User, Heart, EyeOff, Users, Award, 
  Sparkles, Mail, Share2, LogOut, X, ShieldAlert 
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  activeScreen, 
  setActiveScreen 
}) => {
  const { currentUser, logout, notifications } = useApp();

  if (!currentUser) return null;

  const handleItemClick = (screen: string) => {
    setActiveScreen(screen);
    onClose();
  };

  const unreadNotifications = notifications.filter(n => n.userId === currentUser.id && !n.isRead).length;

  const menuItems = [
    { id: "home", label: "الرئيسية", icon: Home },
    { id: "notifications", label: "الإشعارات والبريد", icon: Bell, badge: unreadNotifications },
    { id: "profile", label: "الملف الشخصي", icon: User },
    { id: "interests", label: "قائمة الاهتمامات", icon: Heart },
    { id: "ignored", label: "قائمة التجاهل", icon: EyeOff },
    { id: "who_interested", label: "من يهتم بي", icon: Users },
    { id: "success_stories", label: "قصص النجاح", icon: Award },
    { id: "premium", label: "الانضمام لباقة التميز", icon: Sparkles, highlight: true },
    { id: "contact_us", label: "اتصل بنا", icon: Mail },
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'تطبيق الزواج الإسلامي - مودة ورحمة',
        text: 'انضم إلينا في تطبيق الزواج الإسلامي للتعارف الجاد والموثق على الطريقة الشرعية.',
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert("تم نسخ رابط التطبيق بنجاح! يمكنك مشاركته الآن مع الأصدقاء والعائلة.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950 z-40"
          />

          {/* Sidebar drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col font-sans text-right"
            dir="rtl"
          >
            {/* Sidebar Header */}
            <div className="p-6 bg-gradient-to-l from-emerald-800 to-emerald-700 text-white relative">
              <button 
                onClick={onClose}
                className="absolute top-4 left-4 p-1 rounded-full hover:bg-white/10 text-white transition duration-200"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mt-4">
                <div className="relative">
                  <img 
                    src={currentUser.profileImage || `https://images.unsplash.com/photo-${currentUser.avatar === "male_1" ? "1534528741775-53994a69daeb" : currentUser.avatar === "female_1" ? "1494790108377-be9c29b29330" : "1507003211169-0a1dd7228f2d"}?auto=format&fit=crop&w=150&q=80`} 
                    alt={currentUser.name} 
                    className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400"
                    referrerPolicy="no-referrer"
                  />
                  {currentUser.isPremium && (
                    <span className="absolute -bottom-1 -left-1 bg-amber-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">
                      تميز
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-base leading-tight flex items-center gap-1">
                    {currentUser.name || "مستخدم جديد"}
                    {currentUser.isVerified && (
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1 py-0.5 rounded">موثق</span>
                    )}
                  </h3>
                  <p className="text-xs text-emerald-200 font-mono">رقم العضوية: {currentUser.id}</p>
                </div>
              </div>
            </div>

            {/* Navigation links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              
              {/* If user is Admin (or email is the developer's / demo admin) */}
              {(currentUser.email === "admin@example.com" || currentUser.email === "gharbalmatar@gmail.com") && (
                <button
                  onClick={() => handleItemClick("admin")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition duration-200 ${
                    activeScreen === "admin" 
                      ? "bg-rose-50 text-rose-700 border-r-4 border-rose-600" 
                      : "text-rose-600 hover:bg-rose-50/50"
                  }`}
                >
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                  <span>لوحة تحكم المدير</span>
                </button>
              )}

              {menuItems.map(item => {
                const isSelected = activeScreen === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition duration-200 ${
                      item.highlight 
                        ? "bg-amber-50 text-amber-800 hover:bg-amber-100/80 border border-amber-200" 
                        : isSelected 
                          ? "bg-emerald-50 text-emerald-700 border-r-4 border-emerald-600" 
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${
                        item.highlight 
                          ? "text-amber-600 animate-pulse" 
                          : isSelected 
                            ? "text-emerald-700" 
                            : "text-slate-400"
                      }`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="bg-emerald-600 text-white text-xs font-bold font-mono px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <button
                onClick={handleShare}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition duration-200 text-right"
              >
                <Share2 className="w-5 h-5 text-slate-400" />
                <span>مشاركة التطبيق</span>
              </button>
            </div>

            {/* Logout Footer */}
            <div className="p-4 border-t border-slate-100">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition duration-200 text-right"
              >
                <LogOut className="w-5 h-5 text-rose-500" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
