import React, { useState } from "react";
import { useApp } from "../lib/store";
import { Sparkles, CheckCircle2, CreditCard, Smartphone, HelpCircle, Send, ShieldAlert, PhoneCall } from "lucide-react";

export const PremiumPage: React.FC = () => {
  const { currentUser, submitPremiumRequest, premiumRequests } = useApp();

  const [selectedPlan, setSelectedPlan] = useState<"week" | "month" | "3months" | "6months" | "year">("month");
  const [paymentMethod, setPaymentMethod] = useState<"google_play" | "credit_card" | "mobile_wallet">("mobile_wallet");
  const [walletNumber, setWalletNumber] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  if (!currentUser) return null;

  // Active requests
  const myPendingRequest = premiumRequests.find(r => r.userId === currentUser.id && r.status === "pending");

  const plans = [
    { id: "week", label: "الاشتراك الأسبوعي", price: "49 ج.م", originalPrice: "69 ج.م", badge: "تجربة" },
    { id: "month", label: "الاشتراك الشهري", price: "149 ج.م", originalPrice: "199 ج.م", badge: "الأكثر مبيعاً" },
    { id: "3months", label: "اشتراك 3 أشهر", price: "299 ج.م", originalPrice: "450 ج.م", discount: "وفر 33%" },
    { id: "6months", label: "اشتراك 6 أشهر", price: "499 ج.م", originalPrice: "890 ج.م", discount: "وفر 45%" },
    { id: "year", label: "الاشتراك السنوي", price: "799 ج.م", originalPrice: "1780 ج.م", discount: "وفر 55%", highlight: true },
  ];

  const premiumFeatures = [
    "تعزيز وإظهار ملفك الشخصي في مقدمة نتائج البحث السريع والمتقدم.",
    "إرسال رسائل ومحادثات ومتابعات غير محدودة مع كافة الأعضاء.",
    "تغيير اسم المستخدم وتحديث البيانات والملف الشخصي في أي وقت.",
    "التصفح المخفي تماماً لملفات الشركاء دون ترك أثر أو إشعارهم بزيارتك.",
    "إمكانية رفع صورة شخصية حقيقية آمنة لا يراها إلا من تقبل اهتمامه.",
    "شارة التميز الذهبية التي توثق الجدية وتزيد معدل القبول لـ 4 أضعاف.",
    "دعم فني خاص وهاتف استشارات للمساعدة في التوفيق والتحدث الشرعي.",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === "mobile_wallet" && !walletNumber) {
      alert("يرجى إدخال رقم الهاتف المحول منه لتأكيد الحوالة والتحقق منها.");
      return;
    }

    submitPremiumRequest(selectedPlan, paymentMethod, walletNumber);
    setHasSubmitted(true);
  };

  return (
    <div className="pb-24 pt-4 font-sans text-right bg-slate-50 min-h-screen" dir="rtl">
      <div className="max-w-xl mx-auto px-4 space-y-6">
        
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-amber-50 text-amber-500 rounded-full">
            <Sparkles className="w-8 h-8 fill-amber-300 animate-spin-slow" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800">باقة التميز - مودة ورحمة</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            استفد من المميزات الكاملة لخدمة مودة ورحمة لبناء بيتك الجديد بكل سهولة وجدية وبما يتوافق مع الضوابط الشرعية الموثوقة.
          </p>
        </div>

        {/* Success Banner if Active */}
        {currentUser.isPremium && (
          <div className="bg-gradient-to-l from-amber-500 to-amber-600 text-slate-950 p-5 rounded-2xl border border-amber-400 shadow-md flex gap-3 items-center">
            <CheckCircle2 className="w-8 h-8 flex-shrink-0" />
            <div>
              <h4 className="font-extrabold text-sm leading-tight">اشتراكك في باقة التميز نشط بالكامل!</h4>
              <p className="text-xs text-slate-900 font-medium mt-0.5">يمكنك الآن التمتع بجميع الميزات والحديث بحرية تامة والتصفح الخفي.</p>
            </div>
          </div>
        )}

        {/* Pending Request Warning */}
        {myPendingRequest && !hasSubmitted && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex gap-3">
            <ShieldAlert className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-blue-900 text-sm">لديك طلب اشتراك مسبق معلق</h4>
              <p className="text-xs text-blue-800 leading-relaxed">
                قيد المراجعة: طلبك للاشتراك (عبر {myPendingRequest.paymentMethod === "mobile_wallet" ? "المحفظة الإلكترونية" : myPendingRequest.paymentMethod}) معلق بانتظار موافقة المدير من لوحة التحكم.
              </p>
            </div>
          </div>
        )}

        {/* Benefits list */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-sm border-r-4 border-emerald-600 pr-2">مزايا الاشتراك والتميز</h3>
          
          <ul className="space-y-3">
            {premiumFeatures.map((benefit, idx) => (
              <li key={idx} className="flex gap-2.5 items-start text-xs text-slate-600 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Subscription Choice */}
        {!currentUser.isPremium && !myPendingRequest && !hasSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Packages list */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-r-4 border-emerald-600 pr-2">اختر الباقة المناسبة لك</h3>
              
              <div className="space-y-3">
                {plans.map(plan => {
                  const isSelected = selectedPlan === plan.id;
                  return (
                    <button
                      type="button"
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id as any)}
                      className={`w-full p-4 rounded-2xl border-2 transition duration-150 flex justify-between items-center ${
                        isSelected 
                          ? "border-amber-500 bg-amber-50/20 shadow-md" 
                          : "border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? "border-amber-500 bg-amber-500" : "border-slate-300"
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div className="text-right">
                          <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{plan.label}</h4>
                          <span className="text-[10px] text-slate-400 font-semibold line-through">{plan.originalPrice}</span>
                        </div>
                      </div>

                      <div className="text-left space-y-1">
                        <span className="font-extrabold text-amber-700 text-base font-mono">{plan.price}</span>
                        {plan.badge && (
                          <span className="block text-[9px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-full">
                            {plan.badge}
                          </span>
                        )}
                        {plan.discount && (
                          <span className="block text-[9px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded-full">
                            {plan.discount}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-r-4 border-emerald-600 pr-2">اختر طريقة الدفع الآمنة</h3>
              
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("mobile_wallet")}
                  className={`p-3.5 rounded-2xl border transition duration-150 flex flex-col items-center gap-2 ${
                    paymentMethod === "mobile_wallet" 
                      ? "border-amber-500 bg-amber-50/10 text-amber-800 font-bold shadow-sm" 
                      : "border-slate-100 text-slate-500 hover:border-slate-200"
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  <span className="text-[10px]">كاش موبايل</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("credit_card")}
                  className={`p-3.5 rounded-2xl border transition duration-150 flex flex-col items-center gap-2 ${
                    paymentMethod === "credit_card" 
                      ? "border-amber-500 bg-amber-50/10 text-amber-800 font-bold shadow-sm" 
                      : "border-slate-100 text-slate-500 hover:border-slate-200"
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-[10px]">البطاقة الائتمانية</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("google_play")}
                  className={`p-3.5 rounded-2xl border transition duration-150 flex flex-col items-center gap-2 ${
                    paymentMethod === "google_play" 
                      ? "border-amber-500 bg-amber-50/10 text-amber-800 font-bold shadow-sm" 
                      : "border-slate-100 text-slate-500 hover:border-slate-200"
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <span className="text-[10px]">جوجل بلاي</span>
                </button>
              </div>

              {/* Mobile Wallet Directions */}
              {paymentMethod === "mobile_wallet" && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                  <div className="flex gap-1.5 items-start text-xs text-slate-600 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>قم بتحويل قيمة الباقة المحددة إلى محفظة فودافون كاش أو إنستاباي على الرقم: <span className="font-bold text-emerald-700">01012345678</span></span>
                  </div>
                  <div className="flex gap-1.5 items-start text-xs text-slate-600 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>بعد إتمام عملية التحويل، يرجى كتابة الرقم الذي قمت بالتحويل منه بالأسفل لإرسال الطلب للمراجعة.</span>
                  </div>

                  <div className="space-y-1 pt-1">
                    <label className="text-[10px] font-semibold text-slate-500 block">رقم الهاتف المحول منه الحوالة الكاش</label>
                    <input 
                      type="text"
                      required
                      value={walletNumber}
                      onChange={(e) => setWalletNumber(e.target.value)}
                      placeholder="01xxxxxxxxx"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === "credit_card" && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center text-xs text-slate-500">
                  سيتم توجيهك لبوابة الدفع الآمنة (البطاقة التأمينية المضمونة بضوابط حماية البيانات البنكية والائتمانية) بمجرد ضغط تقديم الطلب.
                </div>
              )}

              {paymentMethod === "google_play" && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center text-xs text-slate-500">
                  سيتم معالجة العملية بضغطة زر واحدة وآمنة تماماً عبر حساب Google Play الخاص بك.
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 py-3.5 rounded-2xl font-extrabold transition text-center shadow-lg shadow-amber-500/15"
            >
              تقديم طلب الاشتراك وتفعيل التميز
            </button>
          </form>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm text-center space-y-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full w-fit mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-800 text-base">تم إرسال طلب تفعيل باقة التميز بنجاح!</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                يسعدنا اهتمامك بتأكيد جديتك وسعيك في الحلال. سيقوم الإداري بالتحقق والرد على طلبك بالتفعيل فوراً. يرجى التوجه إلى <span className="font-bold text-rose-600">لوحة تحكم المدير</span> في القائمة الجانبية للموافقة الذاتية الفورية على طلب الاشتراك للتجربة في وضع الديمو!
              </p>
            </div>
          </div>
        )}

        {/* Hotlines and assistance */}
        <div className="bg-emerald-950 text-slate-200 rounded-2xl p-5 border border-emerald-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              للدعم الفني وتسهيل الاشتراك
            </h4>
            <p className="text-slate-400 text-xs">هل واجهت أي صعوبة أو لديك استفسار؟ نحن متواجدون للمساعدة الفورية طوال اليوم.</p>
          </div>
          <a 
            href="tel:+201012345678"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition inline-flex items-center gap-1.5 self-stretch sm:self-auto text-center justify-center font-mono"
          >
            +20 1012345678
          </a>
        </div>

      </div>
    </div>
  );
};
