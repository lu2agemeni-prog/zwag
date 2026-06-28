import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../lib/store";
import { Gender, Message, Notification } from "../types";
import { 
  Bell, Mail, MessageSquare, Send, CheckCheck, 
  Trash2, ShieldCheck, ChevronLeft, ArrowRight, Sparkles, Lock 
} from "lucide-react";

interface InboxPageProps {
  selectedChatUserId: string | null;
  onCloseChat: () => void;
  onOpenChat: (userId: string) => void;
}

export const InboxPage: React.FC<InboxPageProps> = ({ 
  selectedChatUserId, 
  onCloseChat, 
  onOpenChat 
}) => {
  const { 
    currentUser, messages, notifications, profiles, sendMessage, 
    markMessagesAsRead, markNotificationAsRead, markAllNotificationsAsRead 
  } = useApp();

  const [activeTab, setActiveTab] = useState<"messages" | "notifications">("messages");
  const [typedMessage, setTypedMessage] = useState("");
  const chatBottomRef = useRef<HTMLDivElement>(null);

  if (!currentUser) return null;

  // Opposite gender profiles for preloading simulated conversations
  const oppositeGender = currentUser.gender === Gender.MALE ? Gender.FEMALE : Gender.MALE;
  const matchProfiles = profiles.filter(p => p.gender === oppositeGender && p.name !== "");

  // Auto scroll to bottom in chat
  useEffect(() => {
    if (selectedChatUserId && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatUserId, messages]);

  // Mark messages as read when opening a chat
  useEffect(() => {
    if (selectedChatUserId) {
      markMessagesAsRead(selectedChatUserId);
    }
  }, [selectedChatUserId, messages]);

  // Seed initial simulated message threads if they do not exist
  useEffect(() => {
    if (messages.length === 0 && matchProfiles.length > 0) {
      // Seed a welcome message from the first compatible profile
      const seedPartner = matchProfiles[0];
      sendMessage(seedPartner.id, "السلام عليكم ورحمة الله وبركاته. لقد اطلعت على ملفك الشخصي الكريم ووجدت توافقاً كبيراً في اهتماماتي وتفاصيل تديني ومواصفاتي المطلوبة، ويسعدني ويشرفني التعارف الجاد في سياق هذا التطبيق الطيب.");
    }
  }, []);

  // Filter messages related to the current user
  const myMessages = messages.filter(m => m.senderId === currentUser.id || m.receiverId === currentUser.id);

  // Group messages by partner
  const chatPartners = Array.from(new Set(myMessages.map(m => 
    m.senderId === currentUser.id ? m.receiverId : m.senderId
  ))).map(partnerId => {
    const partner = profiles.find(p => p.id === partnerId);
    const partnerMessages = myMessages.filter(m => 
      (m.senderId === currentUser.id && m.receiverId === partnerId) || 
      (m.senderId === partnerId && m.receiverId === currentUser.id)
    );
    const lastMessage = partnerMessages[partnerMessages.length - 1];
    const unreadCount = partnerMessages.filter(m => m.senderId === partnerId && !m.isRead).length;

    return {
      partner,
      lastMessage,
      unreadCount
    };
  }).filter(item => item.partner !== undefined);

  // Active Chat Message history
  const activeChatMessages = myMessages.filter(m => 
    (m.senderId === currentUser.id && m.receiverId === selectedChatUserId) || 
    (m.senderId === selectedChatUserId && m.receiverId === currentUser.id)
  );

  const activeChatPartner = profiles.find(p => p.id === selectedChatUserId);

  // Handle send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage || !selectedChatUserId) return;

    sendMessage(selectedChatUserId, typedMessage);
    const sentText = typedMessage;
    setTypedMessage("");

    // Simulate automatic prospective partner reply for high-fidelity testing
    setTimeout(() => {
      const responsePool = [
        "جزاكم الله خيراً على صراحتكم ووضوحكم. حقيقةً تهمّني الجدية جداً وأرغب في مراجعة آرائكم في الرؤية الشرعية وطلب الأهل.",
        "أهلاً بك أخي الكريم / أختي الفاضلة. يسعدني التواصل لمعرفة مدى التوافق، هل تفضل التحدث بوعي وصراحة في القضايمة والشروط المالية أولاً؟",
        "وعليكم السلام ورحمة الله وبركاته، قرأت ملفك وأحيي فيك هذا التدين والالتزام الطيب. دعنا نتناقش أكثر في تفاصيل السكن المقترح والإقامة.",
        "أشكرك على طيب كلماتك. تهمّني المحافظة والضوابط الأخلاقية بشدة، وسأكون حريصاً على إشراك أهلي فور ثبوت التوافق الفكري والروحي الأول بيننا."
      ];
      const randomResponse = responsePool[Math.floor(Math.random() * responsePool.length)];
      sendMessage(selectedChatUserId, randomResponse);
    }, 2000);
  };

  // Filter user notifications
  const myNotifications = notifications.filter(n => n.userId === currentUser.id);

  return (
    <div className="pb-24 pt-4 font-sans text-right bg-slate-50 min-h-screen" dir="rtl">
      <div className="max-w-xl mx-auto px-4">
        
        {/* If Active Chat is Open */}
        {selectedChatUserId && activeChatPartner ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[650px] relative">
            
            {/* Active Chat Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <button 
                onClick={onCloseChat}
                className="p-1 text-slate-500 hover:text-slate-800 transition rounded-lg hover:bg-slate-100"
              >
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <img 
                  src={activeChatPartner.profileImage || `https://images.unsplash.com/photo-${activeChatPartner.avatar === "male_1" ? "1534528741775-53994a69daeb" : activeChatPartner.avatar === "female_1" ? "1494790108377-be9c29b29330" : "1507003211169-0a1dd7228f2d"}?auto=format&fit=crop&w=150&q=80`} 
                  alt="" 
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div className="text-right">
                  <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm flex items-center gap-1">
                    {activeChatPartner.name}
                    {activeChatPartner.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">عضوية رقم: {activeChatPartner.id} • {activeChatPartner.isOnline ? "نشط الآن" : "أوفلاين"}</p>
                </div>
              </div>

              <div className="w-8" /> {/* spacing */}
            </div>

            {/* Chat Body messages list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
              {activeChatMessages.map(msg => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div 
                    key={msg.id}
                    className={`flex ${isMe ? "justify-start" : "justify-end"}`}
                  >
                    <div className={`p-3.5 rounded-2xl max-w-[80%] text-xs leading-relaxed shadow-sm ${
                      isMe 
                        ? "bg-emerald-600 text-white rounded-br-none" 
                        : "bg-white text-slate-700 border border-slate-100 rounded-bl-none"
                    }`}>
                      <p>{msg.content}</p>
                      
                      <div className={`flex items-center gap-1.5 mt-1 justify-end text-[9px] ${isMe ? "text-emerald-200" : "text-slate-400"}`}>
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {isMe && <CheckCheck className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            {/* Premium Lock safeguard for Messaging */}
            {!currentUser.isPremium && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col justify-center items-center text-center p-6 space-y-4">
                <div className="p-3 bg-amber-50 text-amber-500 rounded-full">
                  <Lock className="w-8 h-8 fill-amber-100" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">المحادثات مغلقة للأعضاء المتميزين</h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  أنت تتصفح في الوضع المجاني حالياً. لتمكين إرسال واستقبال الرسائل وبدء محادثات جادة، يرجى تفعيل باقة التميز التفضيلية.
                </p>
                <button
                  onClick={() => {
                    onCloseChat();
                    setActiveTab("messages");
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl transition shadow-md shadow-amber-500/10"
                >
                  الاشتراك في باقة التميز
                </button>
              </div>
            )}

            {/* Active Chat Input footer form */}
            {currentUser.isPremium && (
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white flex gap-2">
                <input 
                  type="text" 
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  placeholder="اكتب رسالتك الجادة والمحترمة هنا..."
                  className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-600/10"
                >
                  <Send className="w-4 h-4 rotate-180" />
                </button>
              </form>
            )}

          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Tab navigation */}
            <div className="bg-white rounded-2xl border border-slate-100 p-1.5 shadow-sm flex">
              <button
                onClick={() => setActiveTab("messages")}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === "messages" 
                    ? "bg-emerald-600 text-white" 
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>المحادثات والرسائل ({chatPartners.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("notifications");
                  markAllNotificationsAsRead();
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === "notifications" 
                    ? "bg-emerald-600 text-white" 
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>الإشعارات والأنشطة ({myNotifications.filter(n => !n.isRead).length})</span>
              </button>
            </div>

            {/* Tab content 1: Conversations */}
            {activeTab === "messages" && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-xs">صندوق الوارد والمراسلات الجارية</h3>

                {chatPartners.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center space-y-2">
                    <Mail className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-600">صندوق رسائلك فارغ تماماً حالياً.</p>
                    <p className="text-[10px] text-slate-400">بادر بتصفح الأعضاء، وإبداء الاهتمام والحديث مع من تشعر بالارتياح الأولي نحو مواصفاتهم.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50 overflow-hidden shadow-sm">
                    {chatPartners.map(item => (
                      <div 
                        key={item.partner.id}
                        onClick={() => onOpenChat(item.partner.id)}
                        className="p-4 hover:bg-slate-50 transition cursor-pointer flex justify-between items-center"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <img 
                            src={item.partner.profileImage || `https://images.unsplash.com/photo-${item.partner.avatar === "male_1" ? "1534528741775-53994a69daeb" : item.partner.avatar === "female_1" ? "1494790108377-be9c29b29330" : "1507003211169-0a1dd7228f2d"}?auto=format&fit=crop&w=150&q=80`} 
                            alt="" 
                            className="w-11 h-11 rounded-full object-cover border border-slate-200"
                            referrerPolicy="no-referrer"
                          />
                          <div className="text-right truncate">
                            <h4 className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1 truncate">
                              {item.partner.name}
                              {item.partner.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                            </h4>
                            <p className="text-[10px] text-slate-400 truncate leading-relaxed">
                              {item.lastMessage ? item.lastMessage.content : "ابدأ التحدث الشرعي الجاد..."}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          {item.lastMessage && (
                            <span className="text-[9px] text-slate-400 font-mono">
                              {new Date(item.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                          {item.unreadCount > 0 && (
                            <span className="bg-emerald-600 text-white text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-full min-w-4 text-center">
                              {item.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab content 2: Notifications */}
            {activeTab === "notifications" && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-xs">سجل إشعارات الأنشطة والتفاعلات الشرعية</h3>

                {myNotifications.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center space-y-2">
                    <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-600">لا توجد إشعارات جديدة بانتظارك.</p>
                    <p className="text-[10px] text-slate-400">ستظهر هنا الأنشطة؛ مثل إبداء اهتمام أحد الأعضاء بك، أو تفعيل اشتراكاتك.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50 overflow-hidden shadow-sm">
                    {myNotifications.map(notif => (
                      <div 
                        key={notif.id}
                        className={`p-4 flex gap-3.5 items-start transition ${notif.isRead ? "bg-white" : "bg-emerald-50/20"}`}
                      >
                        <div className="p-2 bg-slate-50 text-emerald-600 rounded-xl flex-shrink-0 mt-0.5">
                          <Bell className="w-4 h-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                            {notif.content}
                          </p>
                          <span className="text-[9px] text-slate-400 font-mono block">
                            {new Date(notif.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
