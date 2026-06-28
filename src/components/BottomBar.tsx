import React from "react";
import { useApp } from "../lib/store";
import { Home, Search, Sparkles, Bell } from "lucide-react";

interface BottomBarProps {
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({ activeScreen, setActiveScreen }) => {
  const { currentUser, notifications } = useApp();

  if (!currentUser) return null;

  const unreadCount = notifications.filter(n => n.userId === currentUser.id && !n.isRead).length;

  const tabs = [
    { id: "home", label: "الرئيسية", icon: Home },
    { id: "notifications", label: "البريد والاشعارات", icon: Bell, badge: unreadCount },
    { id: "premium", label: "باقة التميز", icon: Sparkles, highlight: true },
    { id: "search", label: "بحث", icon: Search },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-[0_-4px_24px_rgba(0,0,0,0.04)] z-30 font-sans" dir="rtl">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-2">
        {tabs.map(tab => {
          const isActive = activeScreen === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveScreen(tab.id)}
              className="flex flex-col items-center justify-center flex-1 h-full relative group transition duration-150"
            >
              <div className={`p-1.5 rounded-xl transition duration-200 ${
                tab.highlight 
                  ? "bg-amber-50 text-amber-600 group-hover:bg-amber-100"
                  : isActive
                    ? "text-emerald-700 bg-emerald-50/50"
                    : "text-slate-400 group-hover:text-slate-600"
              }`}>
                <Icon className={`w-5 h-5 ${tab.highlight ? "animate-pulse text-amber-500" : ""}`} />
              </div>
              
              <span className={`text-[10px] font-semibold mt-0.5 transition duration-150 ${
                tab.highlight
                  ? "text-amber-800"
                  : isActive
                    ? "text-emerald-700 font-bold"
                    : "text-slate-400"
              }`}>
                {tab.label}
              </span>

              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="absolute top-2 right-1/2 translate-x-5 bg-rose-500 text-white text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-full min-w-4 text-center">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
