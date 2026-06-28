import React, { useState } from "react";
import { useApp } from "../lib/store";
import { Gender } from "../types";
import { 
  Shield, Users, Sparkles, Check, X, AlertTriangle, 
  Trash2, Award, ShieldCheck, Database, Copy, RefreshCw, CheckCircle2 
} from "lucide-react";

export const AdminPanel: React.FC = () => {
  const { 
    profiles, premiumRequests, interactions, successStories, dbError, isSupabaseLoading,
    adminApprovePremium, adminRejectPremium, adminVerifyUser, 
    adminDeleteUser, adminApproveStory, retryLoadData
  } = useApp();

  const [activeTab, setActiveTab] = useState<"requests" | "users" | "reports" | "stories" | "supabase">("requests");
  const [copied, setCopied] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const pendingRequests = premiumRequests.filter(r => r.status === "pending");
  const verifiedProfiles = profiles.filter(p => p.name !== "");
  const reports = interactions.filter(i => i.type === "report");
  const pendingStories = successStories.filter(s => !s.isApproved);

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRetrySync = async () => {
    setIsRetrying(true);
    await retryLoadData();
    setIsRetrying(false);
  };

  return (
    <div className="pb-24 pt-4 font-sans text-right bg-slate-50 min-h-screen" dir="rtl">
      <div className="max-w-xl mx-auto px-4 space-y-6">
        
        {/* Title */}
        <div className="text-center space-y-1">
          <div className="inline-flex p-3 bg-rose-50 text-rose-600 rounded-full">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">لوحة تحكم الإدارة والمتابعة الشرعية</h2>
          <p className="text-xs text-rose-600 font-semibold">قسم الإشراف العام • تحكم مباشر في الاشتراكات وتوثيق الأعضاء</p>
        </div>

        {/* Live Database Status Banner */}
        {dbError ? (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 text-amber-800 rounded-full flex-shrink-0 mt-0.5 md:mt-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-amber-900 text-xs">حالة ربط قاعدة البيانات (Supabase)</h4>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  الجداول غير موجودة أو لم يتم إنشاؤها بعد في مشروع Supabase الخاص بك. تم تفعيل التخزين المحلي كبديل تلقائي لتشغيل التطبيق بسلاسة.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("supabase")}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-xl transition flex-shrink-0 self-end md:self-auto"
            >
              عرض كود التهيئة
            </button>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-full">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-900 text-xs">حالة ربط قاعدة البيانات</h4>
                <p className="text-[10px] text-emerald-700">متصل بنجاح بمشروع Supabase وقيد مزامنة البيانات الحية!</p>
              </div>
            </div>
            <button
              onClick={handleRetrySync}
              disabled={isRetrying || isSupabaseLoading}
              className="p-2 text-emerald-800 hover:bg-emerald-100 rounded-xl transition flex-shrink-0"
              title="تحديث البيانات"
            >
              <RefreshCw className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`} />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl border border-slate-100 p-2 shadow-sm flex flex-wrap justify-between gap-1">
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 min-w-[70px] py-2 rounded-xl text-[10px] md:text-xs font-bold transition flex items-center justify-center gap-1 ${
              activeTab === "requests" 
                ? "bg-emerald-600 text-white" 
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>الاشتراكات ({pendingRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`flex-1 min-w-[70px] py-2 rounded-xl text-[10px] md:text-xs font-bold transition flex items-center justify-center gap-1 ${
              activeTab === "users" 
                ? "bg-emerald-600 text-white" 
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>الأعضاء ({verifiedProfiles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`flex-1 min-w-[70px] py-2 rounded-xl text-[10px] md:text-xs font-bold transition flex items-center justify-center gap-1 ${
              activeTab === "reports" 
                ? "bg-emerald-600 text-white" 
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>البلاغات ({reports.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("stories")}
            className={`flex-1 min-w-[70px] py-2 rounded-xl text-[10px] md:text-xs font-bold transition flex items-center justify-center gap-1 ${
              activeTab === "stories" 
                ? "bg-emerald-600 text-white" 
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>القصص ({pendingStories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("supabase")}
            className={`flex-1 min-w-[70px] py-2 rounded-xl text-[10px] md:text-xs font-bold transition flex items-center justify-center gap-1 ${
              activeTab === "supabase" 
                ? "bg-emerald-600 text-white" 
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>إعداد Supabase</span>
          </button>
        </div>

        {/* Tab content 1: Subscriptions requests */}
        {activeTab === "requests" && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-xs">طلبات تفعيل الاشتراكات المميزة المعلقة</h3>
            
            {pendingRequests.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center text-slate-400 text-xs">
                لا توجد أي طلبات اشتراك معلقة حالياً.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map(req => (
                  <div key={req.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <h4 className="font-extrabold text-slate-800 text-sm">{req.userName}</h4>
                        <p className="text-[10px] text-slate-400 font-mono">عضوية رقم: {req.userId} • جنس العضو: {req.userGender === Gender.MALE ? "ذكر" : "أنثى"}</p>
                      </div>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                        طلب: {req.planDuration}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                      <p>طريقة الدفع: <span className="font-bold text-slate-800">{req.paymentMethod}</span></p>
                      {req.phoneNumber && <p>رقم التحويل المحول منه: <span className="font-bold text-emerald-700 font-mono">{req.phoneNumber}</span></p>}
                      <p>تاريخ تقديم الطلب: <span className="font-mono">{new Date(req.timestamp).toLocaleString()}</span></p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          adminApprovePremium(req.id);
                          alert("تمت الموافقة وتفعيل اشتراك التميز للعضو وتحديث صلاحياته!");
                        }}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-md shadow-emerald-600/10"
                      >
                        <Check className="w-4 h-4" />
                        <span>موافقة وتفعيل</span>
                      </button>

                      <button
                        onClick={() => {
                          adminRejectPremium(req.id);
                          alert("تم رفض طلب الاشتراك وإرسال إشعار فوري للتوضيح.");
                        }}
                        className="w-1/3 py-2 border border-rose-100 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        <span>رفض الطلب</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab content 2: User management */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-xs">إدارة حسابات الأعضاء ومراجعة وتوثيق الهوية</h3>
            
            <div className="grid grid-cols-1 gap-3">
              {verifiedProfiles.map(user => (
                <div key={user.id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex justify-between items-center gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img 
                      src={user.profileImage || `https://images.unsplash.com/photo-${user.avatar === "male_1" ? "1534528741775-53994a69daeb" : user.avatar === "female_1" ? "1494790108377-be9c29b29330" : "1507003211169-0a1dd7228f2d"}?auto=format&fit=crop&w=150&q=80`} 
                      alt="" 
                      className="w-12 h-12 rounded-full object-cover border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-0.5 truncate">
                      <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1 truncate">
                        {user.name}
                        {user.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                        {user.isPremium && <span className="text-[8px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded-full">تميز</span>}
                      </h4>
                      <p className="text-[9px] text-slate-400 font-mono">عضوية: {user.id} • سن: {user.age} • هاتف: {user.mobile}</p>
                    </div>
                  </div>

                  <div className="flex gap-1.5 flex-shrink-0">
                    {!user.isVerified && (
                      <button
                        onClick={() => {
                          adminVerifyUser(user.id);
                          alert(`تم توثيق حساب العضو ${user.name} وإعطائه الشارة بنجاح.`);
                        }}
                        className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl transition"
                        title="توثيق الحساب"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        const confirm = window.confirm(`هل أنت متأكد من رغبتك في حذف حساب العضو ${user.name} نهائياً؟ هذا الإجراء لا يمكن التراجع عنه.`);
                        if (confirm) {
                          adminDeleteUser(user.id);
                          alert("تم حذف العضو من قاعدة البيانات بنجاح.");
                        }
                      }}
                      className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition"
                      title="حذف الحساب"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab content 3: Abuse Reports */}
        {activeTab === "reports" && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-xs">شكاوى الأعضاء وبلاغات إساءة الاستخدام</h3>
            
            {reports.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center text-slate-400 text-xs">
                لم يتم تسجيل أي بلاغات إساءة استخدام حالياً. المجتمع يتسم بالاحترام والجدية.
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map(report => {
                  const complainant = profiles.find(p => p.id === report.fromUserId);
                  const target = profiles.find(p => p.id === report.toUserId);

                  return (
                    <div key={report.id} className="bg-white rounded-2xl border border-rose-100 p-4 shadow-sm space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1 text-xs text-rose-600 font-bold bg-rose-50 px-2.5 py-1 rounded-full">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          بلاغ مخالفة سلوكية
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{new Date(report.timestamp).toLocaleString()}</span>
                      </div>

                      <div className="text-xs text-slate-600 space-y-1">
                        <p>العضو المُبلِّغ: <span className="font-bold text-slate-800">{complainant?.name || report.fromUserId}</span> ({report.fromUserId})</p>
                        <p>العضو المشكو في حقه: <span className="font-bold text-rose-700">{target?.name || report.toUserId}</span> ({report.toUserId})</p>
                      </div>

                      <div className="bg-rose-50/40 p-3 rounded-xl border border-rose-100/30 text-xs text-slate-700">
                        <span className="font-semibold block text-rose-900 mb-0.5">تفاصيل المخالفة:</span>
                        "{report.reason}"
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const confirm = window.confirm("هل ترغب في حظر وحذف هذا المشكو في حقه نهائياً بسبب إساءة استخدامه الفاضحة؟");
                            if (confirm) {
                              adminDeleteUser(report.toUserId);
                              alert("تم حظر وحذف العضو المخالف بنجاح لحماية المجتمع.");
                            }
                          }}
                          className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/10"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>حظر وحذف المشكو في حقه</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab content 4: Stories approval */}
        {activeTab === "stories" && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-xs">مراجعة واعتماد قصص النجاح والمباركات</h3>
            
            {pendingStories.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center text-slate-400 text-xs">
                لا توجد أي قصص نجاح معلقة بانتظار المراجعة.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingStories.map(story => (
                  <div key={story.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                      <h4 className="font-extrabold text-slate-800 text-xs">{story.husbandName} و {story.wifeName}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{story.date}</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      "{story.story}"
                    </p>

                    <button
                      onClick={() => {
                        adminApproveStory(story.id);
                        alert("تم اعتماد ونشر قصة النجاح بنجاح لتكون حافزاً وأملاً لجميع الأعضاء!");
                      }}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-md shadow-emerald-600/10"
                    >
                      <Check className="w-4 h-4" />
                      <span>اعتماد ونشر القصة للعامة</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab content 5: Supabase Setup Code */}
        {activeTab === "supabase" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4 text-xs leading-relaxed">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-3 text-slate-800">
                <Database className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm">تهيئة جداول Supabase وقواعد الحماية RLS</h3>
              </div>
              
              <p className="text-slate-600 font-medium">
                لتفعيل قاعدة البيانات الحقيقية وتخزين بيانات الأعضاء والرسائل والإشعارات في مشروعك على Supabase، اتبع الخطوات التالية بجدية وسهولة:
              </p>

              <ol className="list-decimal list-inside space-y-2 pr-1 text-slate-600">
                <li>افتح لوحة تحكم مشروعك في <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline font-bold">Supabase Console</a>.</li>
                <li>من القائمة الجانبية اليسرى، اختر قسم <span className="font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">SQL Editor</span>.</li>
                <li>اضغط على زر <span className="font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">+ New Query</span> لفتح محرر جديد.</li>
                <li>اضغط على زر <b>"نسخ كود SQL البرمجي"</b> أدناه، ثم الصقه داخل المحرر في Supabase.</li>
                <li>اضغط على زر <span className="font-bold bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px]">Run</span> باللون الأخضر لتنفيذ الأوامر فوراً.</li>
                <li>بعد تنفيذ الكود، اضغط على <b>"إعادة المحاولة ومزامنة البيانات"</b> بالأسفل للربط النهائي!</li>
              </ol>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center bg-slate-800 text-slate-200 px-4 py-2 rounded-t-xl font-mono text-[10px]">
                  <span>MODAWWAH_SETUP.sql</span>
                  <button
                    onClick={handleCopySQL}
                    className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg transition font-sans text-xs"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ كود SQL البرمجي</span>
                      </>
                    )}
                  </button>
                </div>
                
                <div className="relative">
                  <pre className="bg-slate-900 text-slate-300 p-4 rounded-b-xl overflow-x-auto font-mono text-[9px] h-60 border border-slate-800 leading-normal select-all">
                    {SUPABASE_SQL_SETUP}
                  </pre>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleRetrySync}
                  disabled={isRetrying}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/10"
                >
                  <RefreshCw className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`} />
                  <span>إعادة المحاولة ومزامنة البيانات الحية</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
