import { getAvatarUrl } from "../lib/avatarUtils";
import React, { useState } from "react";
import { useApp } from "../lib/store";
import { Award, Heart, Sparkles, Send, CheckCircle2, User, ChevronLeft } from "lucide-react";

export const SuccessStories: React.FC = () => {
  const { successStories, adminAddStory } = useApp();

  const [husband, setHusband] = useState("");
  const [wife, setWife] = useState("");
  const [storyText, setStoryText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const approvedStories = successStories.filter(s => s.isApproved);

  const handleAddStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!husband || !wife || !storyText) return;

    adminAddStory(husband, wife, storyText);
    setSubmitted(true);
    setHusband("");
    setWife("");
    setStoryText("");
  };

  return (
    <div className="pb-24 pt-4 font-sans text-right bg-slate-50 min-h-screen" dir="rtl">
      <div className="max-w-xl mx-auto px-4 space-y-6">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-full">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800">صرح المودة - قصص النجاح والمباركات</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            البيوت الصالحة والمباركة التي جمعنا الله بينها على المودة والرحمة والالتزام بالضوابط الشرعية الميسرة.
          </p>
        </div>

        {/* Stories list */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-700 text-xs border-r-4 border-emerald-600 pr-2">أحدث مباركات الزواج السعيد</h3>
          
          {approvedStories.map(story => (
            <div key={story.id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4 relative overflow-hidden">
              <div className="absolute right-0 top-0 bg-emerald-600 text-white p-1 rounded-bl-xl">
                <Heart className="w-4 h-4 fill-white" />
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2 space-x-reverse">
                    <img 
                      src={getAvatarUrl("male_4")} 
                      className="w-8 h-8 rounded-full object-cover border border-white z-10 shadow-sm"
                      alt=""
                    />
                    <img 
                      src={getAvatarUrl("female_4")} 
                      className="w-8 h-8 rounded-full object-cover border border-white shadow-sm"
                      alt=""
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-800 text-xs sm:text-sm">عقد قران {story.husbandName} و {story.wifeName}</h4>
                    <p className="text-[10px] text-slate-400">بارك الله لهما وبارك عليهما وجمع بينهما في خير</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{story.date}</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed italic whitespace-pre-line bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                "{story.story}"
              </p>
            </div>
          ))}
        </div>

        {/* Submit your story form */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-r-4 border-amber-500 pr-2">
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h3 className="font-bold text-slate-800 text-sm">أضف قصة نجاحك وشاركنا فرحتك!</h3>
          </div>

          {!submitted ? (
            <form onSubmit={handleAddStory} className="space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                هل منّ الله عليك بلقاء شريك حياتك عبر مودة ورحمة؟ شارك قصتك الطيبة لتكون قدوة مباركة وبثاً للأمل والجدية في قلوب إخوانك وأخواتك الباحثين.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-600 block">اسم الزوج (أو الاسم المستعار)</label>
                  <input 
                    type="text"
                    required
                    value={husband}
                    onChange={(e) => setHusband(e.target.value)}
                    placeholder="عبد الرحمن بن فلان"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-600 block">اسم الزوجة (أو الاسم المستعار)</label>
                  <input 
                    type="text"
                    required
                    value={wife}
                    onChange={(e) => setWife(e.target.value)}
                    placeholder="فاطمة الزهراء"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-600 block">تفاصيل قصة زواجكم المبارك</label>
                <textarea 
                  required
                  value={storyText}
                  onChange={(e) => setStoryText(e.target.value)}
                  rows={4}
                  placeholder="كيف تم التوافق؟ كيف كانت التسهيلات الشرعية ومواقف الأهل والرؤية الشرعية؟"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/10"
              >
                <Send className="w-4 h-4" />
                <span>إرسال القصة للاعتماد والنشر</span>
              </button>
            </form>
          ) : (
            <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-200/40 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm">تم إرسال قصة نجاحكم للمراجعة بنجاح!</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                  بارك الله لكما وبارك عليكما وجمع بينكما في خير. سيقوم الإشراف بمراجعة القصة واعتمادها للنشر على صرح المودة في غضون ساعات قليلة.
                </p>
              </div>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-emerald-700 text-xs font-bold underline hover:text-emerald-800"
              >
                إضافة قصة نجاح أخرى
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
