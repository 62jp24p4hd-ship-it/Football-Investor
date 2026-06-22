"use client";

import { useState } from "react";

type Props = {
  onClose: () => void;
  defaultTab?: "investor" | "clubowner";
};

const INVESTOR_SECTIONS = [
  {
    icon: "🎯",
    title: "الهدف",
    content: "ابنِ أقوى إمبراطورية كروية بحلول 2028. اشترِ لاعبين، طوّرهم، وبعهم في الوقت الصح.",
  },
  {
    icon: "⚽",
    title: "بناء الفريق",
    content: "اضغط على أي مركز لفتح سوق اللاعبين. عندك فرص شراء محدودة في كل موسم — استخدمها بذكاء! كل لاعب عنده نوع خفي: موهبة (ينمو بسرعة)، عادي (ثابت)، أو فخ (يبدو كويس ويخيب الظن).",
  },
  {
    icon: "📝",
    title: "العقود",
    content: "اللاعبون مو مجانيين — فاوض على الراتب ومدة العقد. حافظ على رضا اللاعب فوق 20% أو يرفض عرضك. عندك 60 ثانية لكل مفاوضة.",
  },
  {
    icon: "💰",
    title: "البيع",
    content: "بع اللاعبين لما تبلغ قيمتهم الذروة. بيع بـ€20M+ يفتح بطاقة التجميد، €40M+ يفتح الشراء الثلاثي، €50M+ يفتح بطاقة السرقة.",
  },
  {
    icon: "📈",
    title: "أحداث السوق",
    content: "كل موسم يجيب أحداث عشوائية: سوق ساخن، انهيار سوق، إصابات، جوائز، عروض سعودية، والمزيد. تكيّف مع كل موسم.",
  },
  {
    icon: "🎴",
    title: "البطاقات الخاصة",
    content: "🧊 تجميد: اوقف خصمك موسم كامل | ⚡ شراء ثلاثي: 3 فرص شراء إضافية | 🕵️ سرقة: بادل لاعباً من فريقك بلاعب خصمك.",
  },
  {
    icon: "🏆",
    title: "الفوز",
    content: "اللاعب بأعلى صافي قيمة (ميزانية + قيمة اللاعبين) في نهاية اللعبة يفوز.",
  },
];

const CLUBOWNER_SECTIONS = [
  {
    icon: "🏟️",
    title: "الهدف",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.2)",
    color: "#34d399",
    content: "أنت مالك نادٍ حقيقي. قُد فريقك خلال مواسم الدوري، فاز بالبطولة، تأهل لدوري الأبطال، وحاول تفوز بأرفع جائزة في كرة القدم.",
  },
  {
    icon: "⚽",
    title: "جولات الدوري",
    bg: "rgba(255,255,255,0.03)",
    border: "rgba(255,255,255,0.07)",
    color: "#e2e8f0",
    content: "اضغط على \"Next Game\" للعب جولة. نتيجة كل مباراة تؤثر على الترتيب مباشرة. الدوري من 34-38 جولة حسب البطولة. يمكنك رؤية معاينة المباراة قبل اللعب.",
  },
  {
    icon: "💰",
    title: "الميزانية والانتقالات",
    bg: "rgba(255,255,255,0.03)",
    border: "rgba(255,255,255,0.07)",
    color: "#e2e8f0",
    content: "تبدأ بميزانية حسب الدوري. اشترِ لاعبين لتقوية فريقك وبعهم عند الحاجة. نهاية الموسم تحصل على مكافآت مالية حسب ترتيبك في الجدول.",
  },
  {
    icon: "🏆",
    title: "دوري أبطال أوروبا",
    bg: "rgba(251,191,36,0.06)",
    border: "rgba(251,191,36,0.2)",
    color: "#fbbf24",
    content: [
      "تتأهل للـ UCL عبر الانتهاء في مراكز متقدمة بالدوري.",
      "دور المجموعات: 8 جولات ضد 7 منافسين أوروبيين.",
      "المراكز 1-8 يتأهلون مباشرة لدور الـ16.",
      "المراكز 9-24 يلعبون ملحق التأهل (ذهاب وإياب).",
      "الأدوار الإقصائية: دور 16 ← ربع النهائي ← نصف النهائي ← النهائي.",
      "الفوز بالبطولة = +€80M مكافأة.",
    ],
  },
  {
    icon: "📊",
    title: "الترقية والهبوط",
    bg: "rgba(255,255,255,0.03)",
    border: "rgba(255,255,255,0.07)",
    color: "#e2e8f0",
    content: "آخر 3 فرق في الدوري الأول تهبط للدوري الثاني. أول 3 فرق في الدوري الثاني ترقى للأول. الهبوط يؤثر على ميزانيتك، والترقية ترفعها.",
  },
  {
    icon: "👥",
    title: "اللاعبون والتشكيل",
    bg: "rgba(255,255,255,0.03)",
    border: "rgba(255,255,255,0.07)",
    color: "#e2e8f0",
    content: "اضغط على أي مركز فارغ لفتح سوق اللاعبين. الشراء غير محدود في طور مالك النادي. قوة الفريق تُحسب من متوسط تقييمات اللاعبين الـ11.",
  },
  {
    icon: "📈",
    title: "الإحصائيات",
    bg: "rgba(255,255,255,0.03)",
    border: "rgba(255,255,255,0.07)",
    color: "#e2e8f0",
    content: "تابع إحصائيات لاعبيك: أهداف، تمريرات حاسمة، كلين شيت. هناك إحصائيات منفصلة للدوري ودوري الأبطال. يمكنك الاطلاع عليها من تبويب Stats.",
  },
  {
    icon: "🎯",
    title: "نصيحة مهمة",
    bg: "rgba(251,191,36,0.06)",
    border: "rgba(251,191,36,0.2)",
    color: "#fbbf24",
    content: "قوة فريقك تُحسب من متوسط قيم اللاعبين. اشترِ لاعبين بقيم عالية، وحافظ على 11 لاعب مكتملين في كل الأوقات. كلما كان فريقك أقوى، ارتفعت فرص الفوز.",
  },
];

export default function HowToPlayModal({ onClose, defaultTab = "investor" }: Props) {
  const [tab, setTab] = useState<"investor" | "clubowner">(defaultTab);

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="w-full max-w-2xl max-h-[88vh] overflow-hidden flex flex-col"
        style={{
          background: "#080d12",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
        }}
      >
        {/* Header */}
        <div style={{
          padding: "18px 24px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>📖 كيف تلعب</h2>
          <button
            onClick={onClose}
            style={{
              padding: "6px 16px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#94a3b8",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            إغلاق
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex",
          gap: 0,
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(255,255,255,0.02)",
        }}>
          {[
            { key: "investor", label: "💼 المستثمر", accent: "#10b981" },
            { key: "clubowner", label: "🏟️ مالك النادي", accent: "#fbbf24" },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as "investor" | "clubowner")}
              style={{
                flex: 1,
                padding: "12px 0",
                fontWeight: 800,
                fontSize: 13,
                cursor: "pointer",
                border: "none",
                borderBottom: tab === t.key ? `2px solid ${t.accent}` : "2px solid transparent",
                background: tab === t.key ? `${t.accent}10` : "transparent",
                color: tab === t.key ? t.accent : "#475569",
                transition: "all 0.2s ease",
                letterSpacing: "0.02em",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>

          {tab === "investor" && INVESTOR_SECTIONS.map((s, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14,
              padding: "14px 16px",
            }}>
              <div style={{ fontWeight: 900, color: "#fff", fontSize: 14, marginBottom: 6 }}>
                {s.icon} {s.title}
              </div>
              <div style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.6 }}>{s.content}</div>
            </div>
          ))}

          {tab === "clubowner" && CLUBOWNER_SECTIONS.map((s, i) => (
            <div key={i} style={{
              background: s.bg,
              border: `1px solid ${s.border}`,
              borderRadius: 14,
              padding: "14px 16px",
            }}>
              <div style={{ fontWeight: 900, color: s.color, fontSize: 14, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                <span>{s.icon}</span>
                <span>{s.title}</span>
              </div>
              {Array.isArray(s.content) ? (
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 5 }}>
                  {s.content.map((line, j) => (
                    <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8, color: "#94a3b8", fontSize: 13, lineHeight: 1.5 }}>
                      <span style={{ color: s.color, flexShrink: 0, marginTop: 1 }}>›</span>
                      {line}
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.6 }}>{s.content}</div>
              )}
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
