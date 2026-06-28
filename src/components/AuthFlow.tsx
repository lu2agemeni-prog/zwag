import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "../lib/store";
import { Gender, MaritalStatus, HijabType } from "../types";
import { 
  Nationalities, Countries, EducationLevels, IncomeLevels, 
  SkinColors, BodyBuilds, HealthStatuses, ReligiousCommitmentLevels, 
  PrayersCommitment, QaImaStances, MahrOpinions, MarriageTimeframes, 
  ShariaVisionStances, HobbiesList, Avatars 
} from "../constants";
import { Shield, Check, Mail, Phone, Lock, BookOpen, User, Sparkles, AlertCircle, Heart } from "lucide-react";

export const AuthFlow: React.FC = () => {
  const { loginUser, verifyMobileCode, submitCharterAgreement, saveProfile, currentUser } = useApp();
  
  const [step, setStep] = useState<"login" | "otp" | "charter" | "gender" | "profile" | "avatars">(() => {
    if (!currentUser) return "login";
    if (!currentUser.isMobileVerified) return "otp";
    if (!currentUser.agreedToCharter) return "charter";
    if (!currentUser.name) return "gender";
    return "profile";
  });

  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Profile Form States
  const [selectedGender, setSelectedGender] = useState<Gender>(Gender.MALE);
  const [name, setName] = useState("");
  const [age, setAge] = useState<number>(25);
  const [nationality, setNationality] = useState(Nationalities[0]);
  const [residence, setResidence] = useState(Countries[0]);
  const [profession, setProfession] = useState("");
  const [education, setEducation] = useState(EducationLevels[2]);
  const [income, setIncome] = useState(IncomeLevels[2]);
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>(MaritalStatus.SINGLE);
  const [hasChildren, setHasChildren] = useState(false);
  const [childrenCount, setChildrenCount] = useState(0);
  const [isSmoker, setIsSmoker] = useState(false);
  
  // Physical
  const [height, setHeight] = useState<number>(170);
  const [weight, setWeight] = useState<number>(70);
  const [skinColor, setSkinColor] = useState(SkinColors[2]);
  const [bodyBuild, setBodyBuild] = useState(BodyBuilds[2]);
  const [healthStatus, setHealthStatus] = useState(HealthStatuses[0]);
  const [hasDisability, setHasDisability] = useState(false);
  const [chronicDiseases, setChronicDiseases] = useState("");
  
  // Religiosity & Marriage
  const [religiousCommitment, setReligiousCommitment] = useState(ReligiousCommitmentLevels[1]);
  const [prayers, setPrayers] = useState(PrayersCommitment[1]);
  const [hasBeard, setHasBeard] = useState<boolean>(true);
  const [hijabType, setHijabType] = useState<HijabType>(HijabType.HIJAB);
  const [qaImaStance, setQaImaStance] = useState(QaImaStances[2]);
  const [mahrOpinion, setMahrOpinion] = useState(MahrOpinions[1]);
  const [marriageTimeframe, setMarriageTimeframe] = useState(MarriageTimeframes[2]);
  const [shariaVisionStance, setShariaVisionStance] = useState(ShariaVisionStances[0]);
  
  // Text descriptions
  const [aboutMe, setAboutMe] = useState("");
  const [partnerSpecs, setPartnerSpecs] = useState("");
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !mobile) return;
    
    setIsLoading(true);
    await loginUser(email, mobile);
    setIsLoading(false);
    setOtpSent(true);
    setStep("otp");
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");
    const success = verifyMobileCode(otp);
    if (success) {
      setStep("charter");
    } else {
      setOtpError("رمز التحقق غير صحيح، يرجى كتابة الرمز التجريبي 1234 أو أي رمز آخر مكون من 4-6 أرقام.");
    }
  };

  const handleCharterAccept = () => {
    submitCharterAgreement();
    setStep("gender");
  };

  const handleSelectGender = (gender: Gender) => {
    setSelectedGender(gender);
    setStep("profile");
  };

  const handleToggleHobby = (hobby: string) => {
    setSelectedHobbies(prev => 
      prev.includes(hobby) ? prev.filter(h => h !== hobby) : [...prev, hobby]
    );
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (aboutMe.length < 140) {
      alert("حقل 'تحدث عن نفسك' يجب ألا يقل عن 140 حرفاً لتأكيد جديتك في الطلب.");
      return;
    }
    if (partnerSpecs.length < 140) {
      alert("حقل 'المواصفات المطلوبة في شريك حياتك' يجب ألا يقل عن 140 حرفاً للتعبير الدقيق عن تفضيلاتك.");
      return;
    }

    // Set default avatar depending on gender
    const defaultAv = selectedGender === Gender.MALE ? "male_1" : "female_1";
    setSelectedAvatar(defaultAv);
    setStep("avatars");
  };

  const handleFinishSetup = () => {
    saveProfile({
      name,
      gender: selectedGender,
      age: Number(age),
      nationality,
      residence,
      profession,
      education,
      income,
      maritalStatus,
      hasChildren,
      childrenCount: hasChildren ? Number(childrenCount) : 0,
      isSmoker,
      height: Number(height),
      weight: Number(weight),
      skinColor,
      bodyBuild,
      healthStatus,
      hasDisability,
      chronicDiseases: chronicDiseases || "لا يوجد",
      religiousCommitment,
      prayers,
      hasBeard: selectedGender === Gender.MALE ? hasBeard : null,
      hijabType: selectedGender === Gender.FEMALE ? hijabType : null,
      qaImaStance,
      mahrOpinion,
      marriageTimeframe,
      shariaVisionStance,
      aboutMe,
      partnerSpecs,
      hobbies: selectedHobbies,
      avatar: selectedAvatar,
      isVerified: true // Auto verify during demo for ease of preview
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-right" dir="rtl">
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>
      
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden relative z-10 my-6">
        {/* Header decoration */}
        <div className="bg-gradient-to-l from-emerald-700 via-emerald-600 to-teal-700 text-white p-8 text-center relative">
          <div className="absolute top-2 right-4 flex gap-1 text-emerald-200 text-xs font-mono">
            <span>● آمن وموثق</span>
          </div>
          <div className="inline-flex p-3 bg-white/10 rounded-full mb-3 backdrop-blur-sm">
            <Heart className="w-8 h-8 text-emerald-300 fill-emerald-300" />
          </div>
          <h1 className="text-2xl font-bold font-sans tracking-tight">مودة ورحمة للزواج الإسلامي</h1>
          <p className="text-emerald-100 text-sm mt-1 font-sans">تواصل شرعي جاد ومحافظ لربط القلوب في الحلال</p>
          
          {/* Step indicator */}
          <div className="flex justify-center gap-2 mt-6">
            <span className={`h-2 rounded-full transition-all duration-300 ${step === "login" ? "w-8 bg-emerald-300" : "w-2 bg-emerald-800"}`} />
            <span className={`h-2 rounded-full transition-all duration-300 ${step === "otp" ? "w-8 bg-emerald-300" : "w-2 bg-emerald-800"}`} />
            <span className={`h-2 rounded-full transition-all duration-300 ${step === "charter" ? "w-8 bg-emerald-300" : "w-2 bg-emerald-800"}`} />
            <span className={`h-2 rounded-full transition-all duration-300 ${step === "gender" ? "w-8 bg-emerald-300" : "w-2 bg-emerald-800"}`} />
            <span className={`h-2 rounded-full transition-all duration-300 ${step === "profile" ? "w-8 bg-emerald-300" : "w-2 bg-emerald-800"}`} />
            <span className={`h-2 rounded-full transition-all duration-300 ${step === "avatars" ? "w-8 bg-emerald-300" : "w-2 bg-emerald-800"}`} />
          </div>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Login & SMS Send */}
            {step === "login" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                key="login"
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-bold text-slate-800">ابدأ رحلتك المباركة</h2>
                  <p className="text-sm text-slate-500">سجل بريدك الإلكتروني ورقم الهاتف للبدء في التحقق الأمني لضمان الجدية التامة.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">البريد الإلكتروني</label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-3 w-5 h-5 text-slate-400" />
                      <input 
                        type="email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@example.com"
                        className="w-full pr-11 pl-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-left"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">رقم الموبايل للتحقق</label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-3 w-5 h-5 text-slate-400" />
                      <input 
                        type="tel" 
                        required 
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="+20 123 456 7890"
                        className="w-full pr-11 pl-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-left"
                      />
                    </div>
                    <p className="text-xs text-slate-400">سنرسل لك رمز تحقق OTP المكون من 4 أرقام لتأكيد حيازة الهاتف.</p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/10"
                  >
                    {isLoading ? "جاري الإرسال..." : "إرسال رمز التحقق (OTP)"}
                    <Shield className="w-5 h-5" />
                  </button>
                </form>

                <div className="border-t border-slate-100 pt-4 text-center">
                  <p className="text-xs text-slate-400">التطبيق يتبع ضوابط الشريعة الإسلامية بالكامل ولا يسمح بالتسلية أو العلاقات خارج نطاق السعي الجاد للزواج.</p>
                </div>
              </motion.div>
            )}

            {/* Step 2: Verification Code (OTP) */}
            {step === "otp" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                key="otp"
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-full mb-1">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">التحقق من الهاتف المحمول</h2>
                  <p className="text-sm text-slate-500">تم إرسال رمز التحقق إلى الهاتف {mobile}. يرجى إدخال الرمز لتأكيد هويتك وجديتك.</p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-2 text-center">
                    <label className="text-sm font-semibold text-slate-700 block">كود التحقق (OTP)</label>
                    <input 
                      type="text" 
                      required 
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="أدخل 1234 للتجربة"
                      className="w-48 text-center py-3 rounded-xl border-2 border-emerald-500 focus:outline-none text-2xl font-mono tracking-widest text-slate-800 focus:ring-4 focus:ring-emerald-100"
                    />
                    {otpError && (
                      <div className="flex items-center justify-center gap-2 text-rose-600 text-sm mt-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{otpError}</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition duration-200"
                  >
                    تأكيد ومتابعة التسجيل
                  </button>
                </form>

                <div className="text-center">
                  <button 
                    onClick={() => { setOtpSent(false); setStep("login"); }}
                    className="text-emerald-600 text-sm font-medium hover:underline"
                  >
                    تغيير رقم الهاتف أو البريد الإلكتروني
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Charter Agreement */}
            {step === "charter" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                key="charter"
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="inline-flex p-3 bg-amber-50 text-amber-600 rounded-full">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">ميثاق المودة وأخلاقيات التعارف الإسلامي</h2>
                  <p className="text-sm text-slate-500">نحن نؤمن بأن بناء الأسرة الصالحة يبدأ بعهد صادق ونية خالصة لله. يرجى قراءة ميثاق التطبيق بدقة والموافقة عليه.</p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-slate-700 text-sm leading-relaxed space-y-3 h-72 overflow-y-auto">
                  <p className="font-semibold text-emerald-800">البند الأول: النية الصالحة والجدية التامة</p>
                  <p>أعاهد الله تعالى وأقر بأنني أستخدم هذا التطبيق بنية صادقة وخالصة للبحث عن زوج شرعي / زوجة شرعية فقط، وليس للتسلية أو تضييع الوقت أو الصداقة المؤقتة.</p>
                  
                  <p className="font-semibold text-emerald-800">البند الثاني: صدق البيانات والأمانة</p>
                  <p>ألتزم التزاماً كاملاً بكتابة جميع بياناتي الشخصية والاجتماعية والدينية بمنتهى الأمانة والصدق والشفافية التامة، دون تزييف أو تجميل مخل بالواقع.</p>
                  
                  <p className="font-semibold text-emerald-800">البند الثالث: حفظ الأسرار وخصوصية الأعضاء</p>
                  <p>ألتزم بالمحافظة على خصوصية جميع الأعضاء الذين أطلع على ملفاتهم، ولا يحق لي تحت أي ظرف مشاركة أي معلومة أو صورة أو تفصيل مع أي جهة خارجية.</p>

                  <p className="font-semibold text-emerald-800">البند الرابع: الرقابة والضوابط الشرعية</p>
                  <p>أوافق على رقابة إدارة التطبيق لضمان الالتزام الأخلاقي والشرعي، وأقر بعلمي بأن أي تجاوز في الحديث أو تلميحات غير أخلاقية يؤدي إلى الحظر المباشر والنهائي لرقم العضوية دون استرداد أي مستحقات مادية.</p>

                  <p className="font-semibold text-emerald-800">البند الخامس: الرؤية الشرعية وطلب الأهل</p>
                  <p>ألتزم بالانتقال للمرحلة الرسمية (الرؤية الشرعية الرسمية بحضور ولي الأمر) في أقرب وقت يتفق عليه الطرفان عند ثبوت القبول الفكري والارتياح الأولي.</p>
                </div>

                <button
                  onClick={handleCharterAccept}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/10"
                >
                  <Check className="w-5 h-5" />
                  أعاهد الله وأوافق على ميثاق التعارف الشرعي
                </button>
              </motion.div>
            )}

            {/* Step 4: Gender Choice */}
            {step === "gender" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                key="gender"
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-bold text-slate-800 font-sans">حدد جنسك لبدء تخصيص الملف الشخصي</h2>
                  <p className="text-sm text-slate-500">سوف تختلف خيارات تعبئة الملف الشخصي والأسئلة الدينية والاجتماعية بناءً على اختيارك.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleSelectGender(Gender.MALE)}
                    className="p-8 rounded-2xl border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50/20 text-center transition group duration-200 flex flex-col items-center gap-3"
                  >
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-full group-hover:scale-110 transition duration-200">
                      <User className="w-10 h-10" />
                    </div>
                    <span className="font-bold text-lg text-slate-700">شاب يبحث عن زوجة</span>
                    <span className="text-xs text-slate-400">لإنشاء ملف شخصي رجالي وتفعيل أسئلة اللحية والنفقة</span>
                  </button>

                  <button
                    onClick={() => handleSelectGender(Gender.FEMALE)}
                    className="p-8 rounded-2xl border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50/20 text-center transition group duration-200 flex flex-col items-center gap-3"
                  >
                    <div className="p-4 bg-pink-50 text-pink-500 rounded-full group-hover:scale-110 transition duration-200">
                      <Heart className="w-10 h-10" />
                    </div>
                    <span className="font-bold text-lg text-slate-700">فتاة تبحث عن زوج</span>
                    <span className="text-xs text-slate-400">لإنشاء ملف شخصي نسائي وتفعيل أسئلة الحجاب والولي</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Complete Comprehensive Form */}
            {step === "profile" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="profile"
                className="space-y-6"
              >
                <div className="text-center space-y-1">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                    بناء الملف الشخصي المتكامل
                  </h2>
                  <p className="text-sm text-slate-500">يرجى تعبئة جميع الحقول بدقة، البيانات مصنفة كخيارات لتسهيل عملية التصفية لاحقاً.</p>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  
                  {/* Category 1: Personal Details */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                    <h3 className="font-bold text-emerald-800 border-r-4 border-emerald-600 pr-2 text-sm">أولاً: البيانات الشخصية الأساسية</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 block">الاسم الثلاثي أو المستعار</label>
                        <input 
                          type="text" 
                          required 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="مثال: أحمد عبد الله"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 block">العمر (سنوات)</label>
                        <input 
                          type="number" 
                          required 
                          min={18} 
                          max={70}
                          value={age}
                          onChange={(e) => setAge(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 block">الجنسية</label>
                        <select 
                          value={nationality}
                          onChange={(e) => setNationality(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white text-sm"
                        >
                          {Nationalities.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 block">مكان الإقامة الحالي</label>
                        <select 
                          value={residence}
                          onChange={(e) => setResidence(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white text-sm"
                        >
                          {Countries.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 block">الحالة الاجتماعية</label>
                        <select 
                          value={maritalStatus}
                          onChange={(e) => setMaritalStatus(e.target.value as MaritalStatus)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white text-sm"
                        >
                          <option value={MaritalStatus.SINGLE}>أعزب / عزباء</option>
                          <option value={MaritalStatus.DIVORCED}>مطلق / مطلقة</option>
                          <option value={MaritalStatus.WIDOWED}>أرمل / أرملة</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 block">هل لديك أولاد؟</label>
                        <div className="flex gap-4 pt-2">
                          <label className="flex items-center gap-1.5 text-xs text-slate-700">
                            <input 
                              type="radio" 
                              checked={hasChildren} 
                              onChange={() => setHasChildren(true)} 
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                            نعم
                          </label>
                          <label className="flex items-center gap-1.5 text-xs text-slate-700">
                            <input 
                              type="radio" 
                              checked={!hasChildren} 
                              onChange={() => { setHasChildren(false); setChildrenCount(0); }} 
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                            لا
                          </label>
                        </div>
                      </div>

                      {hasChildren && (
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700 block">عدد الأولاد</label>
                          <input 
                            type="number" 
                            min={1} 
                            value={childrenCount}
                            onChange={(e) => setChildrenCount(Number(e.target.value))}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white text-sm"
                          />
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 block">هل تدخن؟</label>
                        <div className="flex gap-4 pt-2">
                          <label className="flex items-center gap-1.5 text-xs text-slate-700">
                            <input 
                              type="radio" 
                              checked={isSmoker} 
                              onChange={() => setIsSmoker(true)} 
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                            نعم، أدخن
                          </label>
                          <label className="flex items-center gap-1.5 text-xs text-slate-700">
                            <input 
                              type="radio" 
                              checked={!isSmoker} 
                              onChange={() => setIsSmoker(false)} 
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                            لا، لا أدخن مطلقاً
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category 2: Physical Details */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                    <h3 className="font-bold text-emerald-800 border-r-4 border-emerald-600 pr-2 text-sm">ثانياً: البيانات الجسمانية</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 block">الطول (سم)</label>
                        <input 
                          type="number" 
                          required 
                          min={120} 
                          max={220}
                          value={height}
                          onChange={(e) => setHeight(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 block">الوزن (كجم)</label>
                        <input 
                          type="number" 
                          required 
                          min={30} 
                          max={200}
                          value={weight}
                          onChange={(e) => setWeight(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 block">لون البشرة</label>
                        <select 
                          value={skinColor}
                          onChange={(e) => setSkinColor(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white text-sm"
                        >
                          {SkinColors.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 block">بنية الجسم</label>
                        <select 
                          value={bodyBuild}
                          onChange={(e) => setBodyBuild(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white text-sm"
                        >
                          {BodyBuilds.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 block">الحالة الصحية العامة</label>
                        <select 
                          value={healthStatus}
                          onChange={(e) => setHealthStatus(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white text-sm"
                        >
                          {HealthStatuses.map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 block">وجود إعاقة أو أمراض مزمنة؟</label>
                        <div className="flex gap-4 pt-2">
                          <label className="flex items-center gap-1.5 text-xs text-slate-700">
                            <input 
                              type="checkbox" 
                              checked={hasDisability} 
                              onChange={(e) => setHasDisability(e.target.checked)} 
                              className="rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            نعم يوجد
                          </label>
                        </div>
                      </div>

                      {hasDisability && (
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-xs font-semibold text-slate-700 block">التفاصيل أو الأمراض المزمنة بالتفصيل</label>
                          <input 
                            type="text" 
                            value={chronicDiseases}
                            onChange={(e) => setChronicDiseases(e.target.value)}
                            placeholder="مثال: حساسية حنطة مسيطر عليها، السكري النوع الثاني إلخ"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Category 3: Education, Job and Income */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                    <h3 className="font-bold text-emerald-800 border-r-4 border-emerald-600 pr-2 text-sm">ثالثاً: بيانات العمل ومستوى الدخل</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 block">المهنة / الوظيفة الحالية</label>
                        <input 
                          type="text" 
                          required 
                          value={profession}
                          onChange={(e) => setProfession(e.target.value)}
                          placeholder="مثال: طبيب أطفال، محاسب مالي، معلم"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 block">المؤهل الدراسي</label>
                        <select 
                          value={education}
                          onChange={(e) => setEducation(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white text-sm"
                        >
                          {EducationLevels.map(el => <option key={el} value={el}>{el}</option>)}
                        </select>
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-xs font-semibold text-slate-700 block">مستوى الدخل المالي التقريبي</label>
                        <select 
                          value={income}
                          onChange={(e) => setIncome(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white text-sm"
                        >
                          {IncomeLevels.map(inc => <option key={inc} value={inc}>{inc}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Category 4: Religiosity & Gender specific details */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                    <h3 className="font-bold text-emerald-800 border-r-4 border-emerald-600 pr-2 text-sm">رابعاً: بيانات الالتزام الديني</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 block">درجة الالتزام الديني</label>
                        <select 
                          value={religiousCommitment}
                          onChange={(e) => setReligiousCommitment(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white text-sm"
                        >
                          {ReligiousCommitmentLevels.map(rc => <option key={rc} value={rc}>{rc}</option>)}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 block">المحافظة على الصلوات</label>
                        <select 
                          value={prayers}
                          onChange={(e) => setPrayers(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white text-sm"
                        >
                          {PrayersCommitment.map(pr => <option key={pr} value={pr}>{pr}</option>)}
                        </select>
                      </div>

                      {/* Gender-specific components */}
                      {selectedGender === Gender.MALE ? (
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700 block">اللحية</label>
                          <div className="flex gap-4 pt-2">
                            <label className="flex items-center gap-1.5 text-xs text-slate-700">
                              <input 
                                type="radio" 
                                name="beard"
                                checked={hasBeard === true} 
                                onChange={() => setHasBeard(true)} 
                                className="text-emerald-600 focus:ring-emerald-500"
                              />
                              نعم (ملتحي)
                            </label>
                            <label className="flex items-center gap-1.5 text-xs text-slate-700">
                              <input 
                                type="radio" 
                                name="beard"
                                checked={hasBeard === false} 
                                onChange={() => setHasBeard(false)} 
                                className="text-emerald-600 focus:ring-emerald-500"
                              />
                              لا (حليق / خفيفة)
                            </label>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700 block">نوع الحجاب الشرعي</label>
                          <select 
                            value={hijabType}
                            onChange={(e) => setHijabType(e.target.value as HijabType)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white text-sm"
                          >
                            <option value={HijabType.HIJAB}>حجاب عادي</option>
                            <option value={HijabType.NIQAB}>نقاب شرعي</option>
                            <option value={HijabType.KHIMAR}>خمار طويل</option>
                            <option value={HijabType.NONE}>غير محجبة</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Category 5: Marriage & Opinions Stance */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                    <h3 className="font-bold text-emerald-800 border-r-4 border-emerald-600 pr-2 text-sm">خامساً: بيانات الزواج والارتباط والاتفاق المالي</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 block">ما رأيك في قائمة المنقولات (القايمة)؟</label>
                        <select 
                          value={qaImaStance}
                          onChange={(e) => setQaImaStance(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white text-sm"
                        >
                          {QaImaStances.map(qs => <option key={qs} value={qs}>{qs}</option>)}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 block">ما رأيك في المهر والشبكة وتيسير العقد؟</label>
                        <select 
                          value={mahrOpinion}
                          onChange={(e) => setMahrOpinion(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white text-sm"
                        >
                          {MahrOpinions.map(mo => <option key={mo} value={mo}>{mo}</option>)}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 block">الموعد المتوقع لإتمام الارتباط والزواج</label>
                        <select 
                          value={marriageTimeframe}
                          onChange={(e) => setMarriageTimeframe(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white text-sm"
                        >
                          {MarriageTimeframes.map(mt => <option key={mt} value={mt}>{mt}</option>)}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 block">ما هو موقفك من الرؤية الشرعية الرسمية؟</label>
                        <select 
                          value={shariaVisionStance}
                          onChange={(e) => setShariaVisionStance(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white text-sm"
                        >
                          {ShariaVisionStances.map(sv => <option key={sv} value={sv}>{sv}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Category 6: Hobbies Multiselect */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                    <h3 className="font-bold text-emerald-800 border-r-4 border-emerald-600 pr-2 text-sm">سادساً: الهوايات والاهتمامات الشخصية</h3>
                    <p className="text-xs text-slate-500">اختر الهوايات والأنشطة والاهتمامات التي تعبر عن هويتك اليومية:</p>
                    
                    <div className="flex flex-wrap gap-2 pt-1">
                      {HobbiesList.map(hobby => {
                        const isSelected = selectedHobbies.includes(hobby);
                        return (
                          <button
                            type="button"
                            key={hobby}
                            onClick={() => handleToggleHobby(hobby)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition duration-150 border ${
                              isSelected 
                                ? "bg-emerald-600 border-emerald-600 text-white" 
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            {hobby}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category 7: Essential Self Text Descriptions (Min 140 Chars) */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                    <h3 className="font-bold text-emerald-800 border-r-4 border-emerald-600 pr-2 text-sm">سابعاً: التعبير بالكلمات والوصف الذاتي (هام وجدي)</h3>
                    <p className="text-xs text-rose-600">لتأكيد جديتك وحماية الخصوصية، يرجى كتابة ما لا يقل عن 140 حرفاً في كل من الخانتين التاليتين.</p>
                    
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-semibold text-slate-700">تحدث عن نفسك (الطباع، الطموحات، التدين، طريقتك في الحياة)</label>
                          <span className={`text-xs font-mono font-bold ${aboutMe.length >= 140 ? "text-emerald-600" : "text-amber-500"}`}>
                            {aboutMe.length} / 140 حرف
                          </span>
                        </div>
                        <textarea 
                          required
                          value={aboutMe}
                          onChange={(e) => setAboutMe(e.target.value)}
                          rows={4}
                          placeholder="تحدث بصدق وتفصيل عن نشأتك، طريقتك في العبادة، تعاملك مع الأهل، أفكارك حول بناء أسرة، طموحاتك المهنية والشخصية، وبماذا يتميز خلقك..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white text-sm leading-relaxed text-slate-700"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-semibold text-slate-700">المواصفات المطلوبة في شريك حياتك (السن، الدين، الشكل، الطباع، الأخلاق)</label>
                          <span className={`text-xs font-mono font-bold ${partnerSpecs.length >= 140 ? "text-emerald-600" : "text-amber-500"}`}>
                            {partnerSpecs.length} / 140 حرف
                          </span>
                        </div>
                        <textarea 
                          required
                          value={partnerSpecs}
                          onChange={(e) => setPartnerSpecs(e.target.value)}
                          rows={4}
                          placeholder="ما هي الصفات الأساسية التي لا تقبل التنازل عنها؟ (درجة تدينه، التزامه بالصلاة، المؤهل، الأخلاق الحوارية، التفاهم، مكان السكن، الرغبة في العمل، الطباع الحياتية والطبية...)"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white text-sm leading-relaxed text-slate-700"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold transition duration-200 shadow-lg shadow-emerald-600/15 text-center block"
                  >
                    حفظ ومتابعة لاختيار صورة الأفاتار
                  </button>
                </form>
              </motion.div>
            )}

            {/* Step 6: Choose Avatar */}
            {step === "avatars" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                key="avatars"
                className="space-y-6 text-center"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-slate-800">اختر صورة رمزية (أفاتار) تعبر عنك</h2>
                  <p className="text-sm text-slate-500">حفاظاً على خصوصية وحجاب وعفة الأعضاء، نعتمد على نظام الأفاتارز المحددة مسبقاً لعرضها للجميع.</p>
                  <p className="text-xs text-emerald-600">الأعضاء المتميزون فقط يمكنهم رفع صورهم الحقيقية لمشاركتها اختيارياً مع المقبولين.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 py-4">
                  {Avatars.filter(av => av.gender === selectedGender).map(avatar => {
                    const isSelected = selectedAvatar === avatar.id;
                    return (
                      <button
                        key={avatar.id}
                        onClick={() => setSelectedAvatar(avatar.id)}
                        className={`p-2 rounded-2xl border-2 transition duration-200 flex flex-col items-center gap-2 relative ${
                          isSelected 
                            ? "border-emerald-600 bg-emerald-50/30 scale-105 shadow-md" 
                            : "border-slate-100 hover:border-slate-300"
                        }`}
                      >
                        <img 
                          src={avatar.url} 
                          alt={avatar.label} 
                          className="w-16 h-16 rounded-full object-cover border border-slate-200"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-xs font-semibold text-slate-600">{avatar.label}</span>
                        {isSelected && (
                          <div className="absolute -top-1.5 -left-1.5 bg-emerald-600 text-white p-0.5 rounded-full">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep("profile")}
                    className="w-1/3 border border-slate-200 text-slate-600 hover:bg-slate-50 py-3 rounded-xl font-bold transition duration-200"
                  >
                    رجوع للبيانات
                  </button>
                  <button
                    onClick={handleFinishSetup}
                    className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition duration-200 shadow-lg shadow-emerald-600/10"
                  >
                    إنشاء الحساب ودخول التطبيق
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
