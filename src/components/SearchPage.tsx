import React, { useState } from "react";
import { useApp } from "../lib/store";
import { Gender, MaritalStatus, HijabType } from "../types";
import { 
  Nationalities, Countries, EducationLevels, IncomeLevels, 
  SkinColors, BodyBuilds, ReligiousCommitmentLevels, 
  PrayersCommitment, QaImaStances, MahrOpinions, MarriageTimeframes
} from "../constants";
import { Search, SlidersHorizontal, ArrowUpDown, MapPin, User, ChevronDown, ChevronUp, Sparkles, ShieldCheck } from "lucide-react";

interface SearchPageProps {
  onSelectProfile: (userId: string) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onSelectProfile }) => {
  const { currentUser, profiles } = useApp();

  if (!currentUser) return null;

  // Opposite gender is the default target
  const oppositeGender = currentUser.gender === Gender.MALE ? Gender.FEMALE : Gender.MALE;

  const [isAdvanced, setIsAdvanced] = useState(false);
  
  // Fast Search States
  const [nationality, setNationality] = useState("all");
  const [residence, setResidence] = useState("all");
  const [ageFrom, setAgeFrom] = useState<number>(18);
  const [ageTo, setAgeTo] = useState<number>(65);
  const [maritalStatus, setMaritalStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("joinDate"); // joinDate, age, views

  // Advanced Search States
  const [heightFrom, setHeightFrom] = useState<number>(140);
  const [heightTo, setHeightTo] = useState<number>(210);
  const [weightFrom, setWeightFrom] = useState<number>(40);
  const [weightTo, setWeightTo] = useState<number>(150);
  const [skinColor, setSkinColor] = useState<string>("all");
  const [bodyBuild, setBodyBuild] = useState<string>("all");
  const [religiosity, setReligiosity] = useState<string>("all");
  const [prayers, setPrayers] = useState<string>("all");
  const [smoking, setSmoking] = useState<string>("all"); // all, yes, no
  const [beard, setBeard] = useState<string>("all"); // all, yes, no (only if searching for males)
  const [hijab, setHijab] = useState<string>("all"); // all, hijab, niqab, khimar, none (only if searching for females)
  const [education, setEducation] = useState<string>("all");
  const [income, setIncome] = useState<string>("all");
  const [qaIma, setQaIma] = useState<string>("all");
  const [mahr, setMahr] = useState<string>("all");
  const [timeframe, setTimeframe] = useState<string>("all");

  // Filtering Logic
  const filteredProfiles = profiles.filter(profile => {
    // 1. Core Gender & Setup Completion filter
    if (profile.gender !== oppositeGender || profile.name === "") return false;
    
    // 2. Fast Search Filters
    if (nationality !== "all" && profile.nationality !== nationality) return false;
    if (residence !== "all" && profile.residence !== residence) return false;
    if (profile.age < ageFrom || profile.age > ageTo) return false;
    if (maritalStatus !== "all" && profile.maritalStatus !== maritalStatus) return false;

    // 3. Advanced Search Filters
    if (isAdvanced) {
      if (profile.height < heightFrom || profile.height > heightTo) return false;
      if (profile.weight < weightFrom || profile.weight > weightTo) return false;
      if (skinColor !== "all" && profile.skinColor !== skinColor) return false;
      if (bodyBuild !== "all" && profile.bodyBuild !== bodyBuild) return false;
      if (religiosity !== "all" && profile.religiousCommitment !== religiosity) return false;
      if (prayers !== "all" && profile.prayers !== prayers) return false;
      
      if (smoking !== "all") {
        const wantsSmoker = smoking === "yes";
        if (profile.isSmoker !== wantsSmoker) return false;
      }
      
      // Gender specific
      if (oppositeGender === Gender.MALE && beard !== "all") {
        const wantsBeard = beard === "yes";
        if (profile.hasBeard !== wantsBeard) return false;
      }
      
      if (oppositeGender === Gender.FEMALE && hijab !== "all") {
        if (profile.hijabType !== hijab) return false;
      }

      if (education !== "all" && profile.education !== education) return false;
      if (income !== "all" && profile.income !== income) return false;
      if (qaIma !== "all" && profile.qaImaStance !== qaIma) return false;
      if (mahr !== "all" && profile.mahrOpinion !== mahr) return false;
      if (timeframe !== "all" && profile.marriageTimeframe !== timeframe) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === "joinDate") {
      return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
    } else if (sortBy === "age") {
      return a.age - b.age;
    } else if (sortBy === "views") {
      return b.viewsCount - a.viewsCount;
    }
    return 0;
  });

  return (
    <div className="pb-24 pt-4 font-sans text-right bg-slate-50 min-h-screen" dir="rtl">
      <div className="max-w-xl mx-auto px-4 space-y-6">
        
        {/* Page Title */}
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-slate-800 flex items-center justify-center gap-1.5">
            <Search className="w-5 h-5 text-emerald-600" />
            البحث والتصفية الشرعية
          </h2>
          <p className="text-xs text-slate-500">ابحث عن الشريك الصالح باستخدام خيارات التصفية التفصيلية الدقيقة</p>
        </div>

        {/* Fast Search Filter Card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-sm border-r-4 border-emerald-600 pr-2 flex justify-between items-center">
            <span>البحث السريع والتصنيفات الأساسية</span>
            <span className="text-[10px] text-slate-400 font-normal">عرض {filteredProfiles.length} ملفاً مطابقاً</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-500 block">الجنسية</label>
              <select 
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
              >
                <option value="all">كل الجنسيات</option>
                {Nationalities.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-500 block">بلد الإقامة الحالي</label>
              <select 
                value={residence}
                onChange={(e) => setResidence(e.target.value)}
                className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
              >
                <option value="all">كل الدول</option>
                {Countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-500 block">العمر من</label>
              <input 
                type="number" 
                min={18} 
                max={ageTo} 
                value={ageFrom}
                onChange={(e) => setAgeFrom(Number(e.target.value))}
                className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none bg-white font-mono text-center"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-500 block">العمر إلى</label>
              <input 
                type="number" 
                min={ageFrom} 
                max={70} 
                value={ageTo}
                onChange={(e) => setAgeTo(Number(e.target.value))}
                className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none bg-white font-mono text-center"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-500 block">الحالة الاجتماعية</label>
              <select 
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value)}
                className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
              >
                <option value="all">الكل (أعزب، أرمل، مطلق)</option>
                <option value={MaritalStatus.SINGLE}>أعزب / عزباء</option>
                <option value={MaritalStatus.DIVORCED}>مطلق / مطلقة</option>
                <option value={MaritalStatus.WIDOWED}>أرمل / أرملة</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-500 block">ترتيب النتائج حسب</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white font-semibold text-emerald-800"
              >
                <option value="joinDate">أحدث المنضمين</option>
                <option value="age">السن تصاعدي</option>
                <option value="views">الأكثر مشاهدة وزيارة</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setIsAdvanced(!isAdvanced)}
            className="w-full py-2.5 rounded-xl border border-emerald-200 text-emerald-700 hover:bg-emerald-50 text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {isAdvanced ? "إخفاء الفلاتر المتقدمة" : "عرض الفلاتر والخيارات المتقدمة"}
            {isAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Advanced Filters Expandable Card */}
        {isAdvanced && (
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-r-4 border-teal-600 pr-2">الفلاتر المتقدمة والدقيقة</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 block">الطول الأدنى (سم)</label>
                <input 
                  type="number" 
                  value={heightFrom} 
                  onChange={(e) => setHeightFrom(Number(e.target.value))}
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white text-center font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 block">الطول الأقصى (سم)</label>
                <input 
                  type="number" 
                  value={heightTo} 
                  onChange={(e) => setHeightTo(Number(e.target.value))}
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white text-center font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 block">الوزن الأدنى (كجم)</label>
                <input 
                  type="number" 
                  value={weightFrom} 
                  onChange={(e) => setWeightFrom(Number(e.target.value))}
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white text-center font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 block">الوزن الأقصى (كجم)</label>
                <input 
                  type="number" 
                  value={weightTo} 
                  onChange={(e) => setWeightTo(Number(e.target.value))}
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white text-center font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 block">لون البشرة</label>
                <select 
                  value={skinColor} 
                  onChange={(e) => setSkinColor(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  <option value="all">الكل</option>
                  {SkinColors.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 block">بنية الجسم</label>
                <select 
                  value={bodyBuild} 
                  onChange={(e) => setBodyBuild(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  <option value="all">الكل</option>
                  {BodyBuilds.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 block">درجة التدين والالتزام</label>
                <select 
                  value={religiosity} 
                  onChange={(e) => setReligiosity(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  <option value="all">الكل</option>
                  {ReligiousCommitmentLevels.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 block">المحافظة على الصلاة</label>
                <select 
                  value={prayers} 
                  onChange={(e) => setPrayers(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  <option value="all">الكل</option>
                  {PrayersCommitment.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 block">هل يدخن؟</label>
                <select 
                  value={smoking} 
                  onChange={(e) => setSmoking(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  <option value="all">الكل</option>
                  <option value="no">غير مدخن</option>
                  <option value="yes">مدخن</option>
                </select>
              </div>

              {/* Gender conditional advanced filters */}
              {oppositeGender === Gender.MALE ? (
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 block">اللحية</label>
                  <select 
                    value={beard} 
                    onChange={(e) => setBeard(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="all">الكل</option>
                    <option value="yes">ملتحي</option>
                    <option value="no">حليق</option>
                  </select>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 block">الحجاب والزي الشرعي</label>
                  <select 
                    value={hijab} 
                    onChange={(e) => setHijab(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="all">الكل</option>
                    <option value={HijabType.HIJAB}>حجاب عادي</option>
                    <option value={HijabType.NIQAB}>نقاب</option>
                    <option value={HijabType.KHIMAR}>خمار طويل</option>
                    <option value={HijabType.NONE}>غير محجبة</option>
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 block">المؤهل التعليمي</label>
                <select 
                  value={education} 
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  <option value="all">الكل</option>
                  {EducationLevels.map(el => <option key={el} value={el}>{el}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 block">مستوى الدخل المالي</label>
                <select 
                  value={income} 
                  onChange={(e) => setIncome(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  <option value="all">الكل</option>
                  {IncomeLevels.map(inc => <option key={inc} value={inc}>{inc}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 block">الموقف من القايمة</label>
                <select 
                  value={qaIma} 
                  onChange={(e) => setQaIma(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  <option value="all">الكل</option>
                  {QaImaStances.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 block">الموقف من الشبكة والمهر</label>
                <select 
                  value={mahr} 
                  onChange={(e) => setMahr(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  <option value="all">الكل</option>
                  {MahrOpinions.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-semibold text-slate-500 block">موعد الارتباط المتوقع</label>
                <select 
                  value={timeframe} 
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  <option value="all">الكل</option>
                  {MarriageTimeframes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        <div className="space-y-4">
          <h4 className="font-bold text-slate-700 text-xs">نتائج البحث الفعالة</h4>
          
          {filteredProfiles.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center space-y-2">
              <p className="text-sm font-bold text-slate-600">عذراً، لم نجد أي ملف يطابق شروط تصفيتك الحالية.</p>
              <p className="text-xs text-slate-400">يرجى تقليل الفلاتر المتقدمة والبحث على نطاق أوسع لزيادة الفرص.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredProfiles.map(profile => (
                <div
                  key={profile.id}
                  onClick={() => onSelectProfile(profile.id)}
                  className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition cursor-pointer flex gap-4 relative overflow-hidden group"
                >
                  {profile.isPremium && (
                    <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-bl-xl shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                      تميز
                    </div>
                  )}

                  <img
                    src={profile.profileImage || `https://images.unsplash.com/photo-${profile.avatar === "male_1" ? "1534528741775-53994a69daeb" : profile.avatar === "female_1" ? "1494790108377-be9c29b29330" : "1507003211169-0a1dd7228f2d"}?auto=format&fit=crop&w=150&q=80`}
                    alt={profile.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 group-hover:scale-105 transition duration-200"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 space-y-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-extrabold text-slate-800 text-sm sm:text-base leading-tight">{profile.name}</h4>
                        {profile.isVerified && (
                          <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-100 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono">عضوية رقم: {profile.id}</p>
                    </div>

                    <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {profile.age} سنة • {profile.maritalStatus}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        الجنسية: {profile.nationality} • يقيم في: {profile.residence}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      "{profile.aboutMe}"
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md">
                        {profile.religiousCommitment}
                      </span>
                      <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        {profile.profession}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
