"use client";

import { useEffect, useState } from "react";

// ============================================
// FOOTBALL INVESTOR — EVENT ANIMATIONS
// كل أنيميشنات الإيفنتات في مكان واحد
// ============================================

// ── Shared types ────────────────────────────
type AnimProps = {
  onDone: () => void;
};

// ── Skip overlay (shared) ────────────────────
function SkipHint() {
  return (
    <div className="absolute bottom-16 left-0 right-0 flex justify-center z-30 pointer-events-none">
      <div style={{
        background:"rgba(0,0,0,0.6)",
        border:"1px solid rgba(255,255,255,0.1)",
        padding:"4px 14px",
        fontSize:"10px",
        letterSpacing:"0.2em",
        color:"rgba(255,255,255,0.3)",
        animation:"skipFade 2s ease-in-out infinite alternate",
      }}>
        TAP TO SKIP
      </div>
      <style>{`@keyframes skipFade{0%{opacity:0.4}100%{opacity:0.8}}`}</style>
    </div>
  );
}

// ============================================
// FLORENTINO PÉREZ — BOSS ENTRANCE
// trigger: florentinoPerez event
// ============================================

export function FlorentinoEntrance({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"dark"|"walk"|"sit"|"talk"|"exit">("dark");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("walk"), 400);
    const t2 = setTimeout(() => setPhase("sit"),  1400);
    const t3 = setTimeout(() => setPhase("talk"), 2200);
    const t4 = setTimeout(() => setPhase("exit"), 5500);
    const t5 = setTimeout(() => onDone(),         6200);
    return () => { clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);clearTimeout(t4);clearTimeout(t5); };
  }, [onDone]);

  const laughLines = [
    "لاعبك وقّع معي",
    "شكراً على التدريب",
    "هههه…",
    "Real Madrid يشكرك",
  ];
  const [lineIdx, setLineIdx] = useState(0);
  useEffect(() => {
    if (phase !== "talk") return;
    const iv = setInterval(() => setLineIdx(i => (i + 1) % laughLines.length), 900);
    return () => clearInterval(iv);
  }, [phase]);

  return (
    <div className="fixed inset-0 z-[999] pointer-events-auto overflow-hidden"
      onClick={() => onDone()}
      style={{ cursor:"pointer", opacity: phase==="exit" ? 0 : 1, transition: phase==="exit" ? "opacity 1s ease-in" : "opacity 0.4s ease",
        background: "#000" }}>
<SkipHint />

      {/* ── Cinematic bars ── */}
      <div className="absolute top-0 left-0 right-0 z-20" style={{ height:"clamp(40px,7vh,70px)", background:"#000" }} />
      <div className="absolute bottom-0 left-0 right-0 z-20" style={{ height:"clamp(40px,7vh,70px)", background:"#000" }} />

      {/* ── Scene background ── */}
      <div className="absolute inset-0" style={{
        background: phase==="sit"||phase==="talk"
          ? "linear-gradient(180deg, #0a0800 0%, #180e00 50%, #0a0600 100%)"
          : "linear-gradient(180deg, #050300 0%, #0a0800 100%)",
        transition: "background 1s ease",
      }} />

      {/* ── Office desk line ── */}
      {(phase==="sit"||phase==="talk") && (
        <div className="absolute" style={{
          bottom: "clamp(80px,18vh,160px)", left: "15%", right: "15%",
          height: "3px",
          background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.3) 20%, rgba(212,175,55,0.5) 50%, rgba(212,175,55,0.3) 80%, transparent)",
          boxShadow: "0 0 20px rgba(212,175,55,0.15)",
        }} />
      )}

      {/* ── Real Madrid crest watermark ── */}
      {(phase==="sit"||phase==="talk") && (
        <div className="absolute" style={{
          top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          fontSize: "clamp(100px,20vw,200px)",
          opacity: 0.03,
          userSelect: "none",
          fontWeight: 900,
          color: "#D4AF37",
          letterSpacing: "-0.05em",
          animation: "florCrest 6s ease-in-out infinite alternate",
        }}>RM</div>
      )}

      {/* ── Gold ambient light ── */}
      {(phase==="sit"||phase==="talk") && (
        <div className="absolute" style={{
          top: "10%", left: "50%", transform: "translateX(-50%)",
          width: "clamp(200px,35vw,380px)", height: "clamp(200px,35vw,380px)",
          background: "radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)",
          animation: "florLight 3s ease-in-out infinite alternate",
        }} />
      )}

      {/* ── Portrait ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ zIndex: 5 }}>
        <div style={{
          animation:
            phase==="walk" ? "florWalkIn 1s cubic-bezier(0.22,1,0.36,1) forwards"
            : phase==="sit" ? "florSettle 0.8s ease-out forwards"
            : phase==="talk" ? "florLaughBody 0.6s ease-in-out infinite"
            : "none",
          marginBottom: "clamp(12px,2vw,24px)",
        }}>
          <img src="/images/florentino-pixel.png" alt="Florentino"
            style={{
              width: "clamp(160px,24vw,220px)",
              imageRendering: "pixelated", objectFit: "contain",
              filter: phase==="talk"
                ? "drop-shadow(0 0 30px rgba(212,175,55,0.8)) drop-shadow(0 0 60px rgba(212,175,55,0.3))"
                : "drop-shadow(0 0 12px rgba(212,175,55,0.4))",
              transition: "filter 0.5s ease",
            }}
          />
        </div>

        {/* ── Speech bubble ── */}
        {phase==="talk" && (
          <div style={{
            position: "relative",
            background: "rgba(5,3,0,0.97)",
            border: "1px solid rgba(212,175,55,0.7)",
            boxShadow: "0 0 40px rgba(212,175,55,0.25)",
            padding: "12px 28px",
            marginBottom: "8px",
            animation: "florBubble 0.4s cubic-bezier(0.22,1,0.36,1) forwards",
          }}>
            {/* triangle */}
            <div style={{
              position: "absolute", top: "-8px", left: "50%",
              transform: "translateX(-50%)",
              width: 0, height: 0,
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderBottom: "8px solid rgba(212,175,55,0.7)",
            }} />
            <div className="font-black text-base tracking-wide text-center"
              style={{ color: "#D4AF37", textShadow: "0 0 12px rgba(212,175,55,0.7)", minWidth: "180px" }}>
              {laughLines[lineIdx]}
            </div>
          </div>
        )}

        {/* ── Name plate ── */}
        {(phase==="sit"||phase==="talk") && (
          <div style={{
            textAlign: "center",
            opacity: phase==="sit" ? 0 : 1,
            transform: phase==="sit" ? "translateY(10px)" : "translateY(0)",
            transition: "all 0.6s ease 0.2s",
          }}>
            <div className="px-8 py-4" style={{
              background: "linear-gradient(135deg,rgba(5,3,0,0.97),rgba(15,10,0,0.97))",
              border: "1px solid rgba(212,175,55,0.6)",
              boxShadow: "0 0 30px rgba(212,175,55,0.2)",
            }}>
              <div className="text-[9px] tracking-[0.5em] uppercase mb-1" style={{ color:"rgba(212,175,55,0.5)" }}>
                Real Madrid President
              </div>
              <div className="font-black text-2xl tracking-widest uppercase"
                style={{ color:"#D4AF37", textShadow:"0 0 20px rgba(212,175,55,0.8)" }}>
                Florentino Pérez
              </div>
              <div className="text-xs tracking-[0.2em] uppercase mt-1.5"
                style={{ color:"rgba(255,255,255,0.25)" }}>
                Convinced your player to leave
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes florWalkIn {
          0%   { opacity:0; transform:translateX(80px) scale(0.7); }
          60%  { opacity:1; transform:translateX(-6px) scale(1.04); }
          100% { opacity:1; transform:translateX(0) scale(1); }
        }
        @keyframes florSettle {
          0%   { transform:translateY(-5px) scale(1.04); }
          100% { transform:translateY(0) scale(1); }
        }
        @keyframes florLaughBody {
          0%,100% { transform:rotate(0deg) scale(1); }
          25%      { transform:rotate(-2deg) scale(1.03); }
          75%      { transform:rotate(2deg) scale(1.03); }
        }
        @keyframes florBubble {
          0%   { opacity:0; transform:scale(0.7) translateY(10px); }
          100% { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes florLight {
          0%   { opacity:0.6; transform:translateX(-50%) scale(0.9); }
          100% { opacity:1;   transform:translateX(-50%) scale(1.1); }
        }
        @keyframes florCrest {
          0%   { opacity:0.02; transform:translate(-50%,-50%) scale(0.95); }
          100% { opacity:0.05; transform:translate(-50%,-50%) scale(1.05); }
        }
      `}</style>
    </div>
  );
}

export function AclInjuryAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter"|"fall"|"hold"|"exit">("enter");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("fall"),  400);
    const t2 = setTimeout(() => setPhase("hold"),  1200);
    const t3 = setTimeout(() => setPhase("exit"),  3800);
    const t4 = setTimeout(() => onDone(),          4500);
    return () => { clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);clearTimeout(t4); };
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[999] pointer-events-auto overflow-hidden flex items-center justify-center"
      onClick={() => onDone()}
      style={{cursor:"pointer", opacity:phase==="exit"?0:1, transition:phase==="exit"?"opacity 0.7s ease-in":"opacity 0.3s",
        background:"#000", animation:phase==="fall"?"aclShock 0.4s ease-out":"none" }}>
      <SkipHint />
      <div className="absolute inset-0" style={{background:phase==="hold"?"radial-gradient(ellipse at center, rgba(100,0,0,0.6) 0%,rgba(0,0,0,0.97) 65%)":"rgba(0,0,0,0.9)",transition:"background 0.8s ease"}} />
      {/* X-ray style scan lines */}
      {phase==="hold" && <div className="absolute inset-0" style={{backgroundImage:"repeating-linear-gradient(0deg,rgba(255,255,255,0.015) 0,rgba(255,255,255,0.015) 1px,transparent 1px,transparent 6px)"}} />}
      {/* Alert bars */}
      {phase==="hold" && (
        <div className="absolute top-0 left-0 right-0" style={{background:"rgba(200,0,0,0.9)",padding:"6px",textAlign:"center",animation:"aclBlink 1s steps(1) infinite",zIndex:3}}>
          <span style={{color:"#fff",fontWeight:900,fontSize:"11px",letterSpacing:"0.3em"}}>⚠️ MEDICAL EMERGENCY — ACL RUPTURE</span>
        </div>
      )}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <img src="/images/acl-injury-pixel.png" alt="ACL Injury"
          style={{ width:"clamp(200px,32vw,280px)", imageRendering:"pixelated", objectFit:"contain",
            animation: phase==="fall" ? "aclFall 0.8s cubic-bezier(0.22,1,0.36,1) forwards"
              : phase==="hold" ? "aclPain 2s ease-in-out infinite" : "none",
            filter:phase==="hold"?"drop-shadow(0 0 20px rgba(255,0,0,0.7)) grayscale(0.4)":"none",
          }}
        />
        {phase==="hold" && (
          <div style={{textAlign:"center"}}>
            <div className="px-8 py-4" style={{background:"rgba(8,0,0,0.97)",border:"1px solid rgba(255,0,0,0.7)",boxShadow:"0 0 40px rgba(200,0,0,0.3)"}}>
              <div className="text-[9px] tracking-[0.5em] uppercase mb-1" style={{color:"rgba(255,80,80,0.6)"}}>Season-Ending</div>
              <div className="font-black text-2xl tracking-widest uppercase" style={{color:"#ff2222",textShadow:"0 0 20px rgba(255,0,0,0.9)"}}>ACL Rupture</div>
              <div className="text-xs tracking-[0.2em] uppercase mt-1.5" style={{color:"rgba(255,255,255,0.25)"}}>Out for the entire season</div>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes aclShock{0%,100%{transform:translate(0)}20%{transform:translate(-12px,6px)}40%{transform:translate(12px,-6px)}60%{transform:translate(-6px,3px)}80%{transform:translate(6px,-3px)}}@keyframes aclFall{0%{opacity:0;transform:translateY(-40px) scale(0.8)}60%{opacity:1;transform:translateY(5px) scale(1.04)}100%{opacity:1;transform:translateY(0) scale(1)}}@keyframes aclPain{0%,100%{transform:scale(1) rotate(0)}30%{transform:scale(1.03) rotate(-1deg)}70%{transform:scale(0.98) rotate(1deg)}}@keyframes aclBlink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </div>
  );
}

// ============================================
// SAUDI OFFER — طائرة تهبط + ذهب يتساقط
// ============================================
export function SaudiOfferAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter"|"land"|"hold"|"exit">("enter");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("land"),  300);
    const t2 = setTimeout(() => setPhase("hold"),  1200);
    const t3 = setTimeout(() => setPhase("exit"),  3800);
    const t4 = setTimeout(() => onDone(),          4500);
    return () => { clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);clearTimeout(t4); };
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[999] pointer-events-auto overflow-hidden flex items-center justify-center"
      onClick={() => onDone()}
      style={{cursor:"pointer", opacity:phase==="exit"?0:1, transition:phase==="exit"?"opacity 0.7s ease-in":"opacity 0.4s",
        background:"radial-gradient(ellipse at center, rgba(0,40,0,0.7) 0%, #000 75%)" }}>
      <SkipHint />
      {/* Gold rain */}
      {phase==="hold" && (
        <div className="absolute inset-0 overflow-hidden">
          {["💰","💵","💴","💶","💰","💵","$","$","€"].map((s,i)=>(
            <span key={i} style={{position:"absolute",left:`${(i*11.5)%93}%`,top:"-20px",
              fontSize:`${14+(i%3)*8}px`,animation:`saudiRain ${1.2+i*0.13}s linear ${i*0.09}s infinite`}}>{s}</span>
          ))}
        </div>
      )}
      {/* Saudi flag colors shimmer */}
      {phase==="hold" && <div className="absolute inset-0" style={{background:"linear-gradient(135deg,rgba(0,100,0,0.05) 0%,transparent 50%,rgba(255,255,255,0.02) 100%)"}} />}
      <div className="relative z-10 flex flex-col items-center gap-5">
        <img src="/images/saudi-offer-pixel.png" alt="Saudi Offer"
          style={{ width:"clamp(180px,28vw,240px)", imageRendering:"pixelated", objectFit:"contain",
            animation: phase==="land" ? "saudiLand 0.9s cubic-bezier(0.22,1,0.36,1) forwards"
              : phase==="hold" ? "saudiFloat 2.5s ease-in-out infinite" : "none",
            filter:phase==="hold"?"drop-shadow(0 0 24px rgba(0,200,50,0.8)) drop-shadow(0 0 50px rgba(0,150,40,0.4))":"none",
          }}
        />
        {phase==="hold" && (
          <div style={{textAlign:"center"}}>
            <div className="px-9 py-5" style={{background:"rgba(0,5,0,0.97)",border:"1px solid rgba(0,180,50,0.7)",boxShadow:"0 0 50px rgba(0,150,40,0.3)"}}>
              <div className="text-[9px] tracking-[0.5em] uppercase mb-2" style={{color:"rgba(0,200,60,0.6)"}}>Mega Deal</div>
              <div className="font-black text-2xl tracking-widest uppercase" style={{color:"#00cc44",textShadow:"0 0 25px rgba(0,200,60,1)"}}>Saudi Offer</div>
              <div className="text-xs tracking-[0.2em] uppercase mt-1.5" style={{color:"rgba(255,255,255,0.25)"}}>Untold millions on the table</div>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes saudiLand{0%{opacity:0;transform:translateY(-80px) rotate(-8deg) scale(0.6)}60%{opacity:1;transform:translateY(6px) rotate(2deg) scale(1.05)}80%{transform:translateY(-2px) rotate(-1deg)}100%{opacity:1;transform:translateY(0) rotate(0) scale(1)}}@keyframes saudiFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@keyframes saudiRain{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(110vh) rotate(360deg);opacity:0}}`}</style>
    </div>
  );
}

// ============================================
// GOAT SIGNING — Easter egg portal opening
// ============================================
type GoatAnimProps = AnimProps & { playerName?: string };
export function GoatSigningAnimation({ onDone, playerName }: GoatAnimProps) {
  const [phase, setPhase] = useState<"portal"|"flash"|"hold"|"exit">("portal");
  const portraits: Record<string,string> = {
    "Yousef Alnuwasser":"/images/yousef-pixel.png",
    "Hussain Alrezk":"/images/hussain-alrezk.png",
    "ABDULLAH ALMUSAWI":"/images/abdullah-almusawi.png",
    "Ali Alsaif":"/images/ali-alsaif.png",
    "Abdulaziz Alghariri":"/images/abdulaziz-alghariri.png",
    "Ali Albrahim":"/images/ali-albrahim.png",
    "Mohammed Al Abullah":"/images/mohammed-al-abullah.png",
  };
  const portrait = playerName ? portraits[playerName] : null;
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("flash"), 1200);
    const t2 = setTimeout(() => setPhase("hold"),  1800);
    const t3 = setTimeout(() => setPhase("exit"),  4500);
    const t4 = setTimeout(() => onDone(),          5200);
    return () => { clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);clearTimeout(t4); };
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[999] pointer-events-auto overflow-hidden flex items-center justify-center"
      onClick={() => onDone()}
      style={{cursor:"pointer", opacity:phase==="exit"?0:1, transition:phase==="exit"?"opacity 0.8s ease-in":"opacity 0.3s",
        background: phase==="flash"?"#fff":"#000" }}>
      <SkipHint />
      <div className="absolute inset-0" style={{background:phase==="hold"?"radial-gradient(ellipse at center,rgba(40,30,0,0.7) 0%,rgba(0,0,0,0.95) 70%)":"transparent",transition:"background 0.5s"}} />
      {/* Portal rings */}
      {(phase==="portal"||phase==="hold") && [...Array(4)].map((_,i)=>(
        <div key={i} className="absolute rounded-full" style={{
          width:`${100+i*80}px`, height:`${100+i*80}px`,
          border:`${3-i*0.5}px solid rgba(212,175,55,${0.8-i*0.15})`,
          animation:`goatPortal ${0.8+i*0.2}s ease-out ${i*0.1}s forwards`,
          boxShadow:`0 0 ${20+i*10}px rgba(212,175,55,${0.5-i*0.1})`,
        }} />
      ))}
      {/* Gold particles */}
      {phase==="hold" && [...Array(14)].map((_,i)=>(
        <div key={i} className="absolute rounded-full" style={{
          width:`${2+(i%3)}px`,height:`${2+(i%3)}px`,
          left:`${(i*7.2)%92}%`,bottom:"10%",
          background:"#D4AF37",boxShadow:"0 0 4px rgba(212,175,55,0.8)",
          animation:`goatParticle ${2+i*0.2}s ease-out ${i*0.1}s infinite`,
        }} />
      ))}
      <div className="relative z-10 flex flex-col items-center gap-5">
        {portrait && (
          <img src={portrait} alt={playerName}
            style={{ width:"clamp(140px,22vw,190px)", imageRendering:"pixelated", objectFit:"contain",
              animation:phase==="flash"?"goatFlash 0.6s ease-out forwards":phase==="hold"?"goatFloat 3s ease-in-out infinite":"none",
              filter:phase==="hold"?"drop-shadow(0 0 24px rgba(212,175,55,1)) drop-shadow(0 0 48px rgba(212,175,55,0.5))":"none",
            }}
          />
        )}
        {phase==="hold" && (
          <div style={{textAlign:"center"}}>
            <div className="px-9 py-5" style={{background:"rgba(5,4,0,0.97)",border:"1px solid rgba(212,175,55,0.8)",boxShadow:"0 0 50px rgba(212,175,55,0.35)"}}>
              <div className="text-[9px] tracking-[0.5em] uppercase mb-2" style={{color:"rgba(212,175,55,0.5)"}}>🐐 Secret Signing</div>
              <div className="font-black text-2xl tracking-widest uppercase" style={{color:"#D4AF37",textShadow:"0 0 25px rgba(212,175,55,1)"}}>{playerName ?? "Legend Signed"}</div>
              <div className="text-xs tracking-[0.2em] uppercase mt-1.5" style={{color:"rgba(255,255,255,0.25)"}}>You found a hidden gem</div>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes goatPortal{0%{transform:scale(0);opacity:1}100%{transform:scale(3);opacity:0}}@keyframes goatFlash{0%{opacity:0;transform:scale(2);filter:brightness(5)}100%{opacity:1;transform:scale(1);filter:brightness(1)}}@keyframes goatFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}@keyframes goatParticle{0%{transform:translateY(0);opacity:0.8}100%{transform:translateY(-90vh);opacity:0}}`}</style>
    </div>
  );
}

// ============================================
// GOLDEN BOOT — الحذاء يطير ويضرب الشاشة
// ============================================
export function GoldenBootAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"fly"|"impact"|"hold"|"exit">("fly");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("impact"), 600);
    const t2 = setTimeout(() => setPhase("hold"),   1100);
    const t3 = setTimeout(() => setPhase("exit"),   3600);
    const t4 = setTimeout(() => onDone(),           4300);
    return () => { clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);clearTimeout(t4); };
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[999] pointer-events-auto overflow-hidden flex items-center justify-center"
      onClick={() => onDone()}
      style={{cursor:"pointer", opacity:phase==="exit"?0:1, transition:phase==="exit"?"opacity 0.7s ease-in":"opacity 0.3s",
        background:"#000", animation:phase==="impact"?"bootImpact 0.4s ease-out":"none" }}>
      <SkipHint />
      <div className="absolute inset-0" style={{background:phase==="hold"?"radial-gradient(ellipse at center,rgba(100,75,0,0.6) 0%,rgba(0,0,0,0.95) 65%)":"rgba(0,0,0,0.9)",transition:"background 0.6s"}} />
      {/* Impact flash */}
      {phase==="impact" && <div className="absolute inset-0" style={{background:"rgba(255,220,0,0.3)",animation:"bootFlash 0.4s ease-out forwards"}} />}
      {/* Star burst */}
      {phase==="hold" && [...Array(8)].map((_,i)=>(
        <div key={i} className="absolute" style={{
          width:"2px",height:"clamp(60px,10vw,100px)",
          left:"50%",top:"50%",
          background:"linear-gradient(180deg,rgba(212,175,55,0.9),transparent)",
          transformOrigin:"0 0",
          transform:`rotate(${i*45}deg)`,
          animation:`bootRay 2s ease-in-out ${i*0.1}s infinite alternate`,
        }} />
      ))}
      <div className="relative z-10 flex flex-col items-center gap-5">
        <img src="/images/golden-boot-pixel.png" alt="Golden Boot"
          style={{ width:"clamp(160px,26vw,220px)", imageRendering:"pixelated", objectFit:"contain",
            animation: phase==="fly" ? "bootFly 0.6s cubic-bezier(0.22,1,0.36,1) forwards"
              : phase==="hold" ? "bootSpin 4s linear infinite" : "none",
            filter:phase==="hold"?"drop-shadow(0 0 28px rgba(212,175,55,1)) drop-shadow(0 0 56px rgba(212,175,55,0.5))":"none",
          }}
        />
        {phase==="hold" && (
          <div style={{textAlign:"center"}}>
            <div className="px-9 py-5" style={{background:"rgba(5,4,0,0.97)",border:"1px solid rgba(212,175,55,0.8)",boxShadow:"0 0 50px rgba(212,175,55,0.4)"}}>
              <div className="text-[9px] tracking-[0.5em] uppercase mb-2" style={{color:"rgba(212,175,55,0.5)"}}>Top Scorer Award</div>
              <div className="font-black text-2xl tracking-widest uppercase" style={{color:"#D4AF37",textShadow:"0 0 25px rgba(212,175,55,1)"}}>Golden Boot</div>
              <div className="text-xs tracking-[0.2em] uppercase mt-1.5" style={{color:"rgba(255,255,255,0.25)"}}>Most goals in the league</div>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes bootFly{0%{opacity:0;transform:translateX(-150px) translateY(80px) rotate(-30deg) scale(0.4)}60%{opacity:1;transform:translateX(5px) translateY(-5px) rotate(5deg) scale(1.08)}100%{opacity:1;transform:translateX(0) translateY(0) rotate(0) scale(1)}}@keyframes bootImpact{0%,100%{transform:translate(0)}20%{transform:translate(-10px,5px)}40%{transform:translate(10px,-5px)}60%{transform:translate(-5px,3px)}80%{transform:translate(5px,-3px)}}@keyframes bootFlash{0%{opacity:0.5}100%{opacity:0}}@keyframes bootSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes bootRay{0%{opacity:0.3;transform:rotate(var(--r)) scaleY(0.6)}100%{opacity:1;transform:rotate(var(--r)) scaleY(1.2)}}`}</style>
    </div>
  );
}

// ============================================
// BALLON D'OR — curtain reveal سينمائي
// ============================================
// ============================================
// FAST FOOD — burger drops + grease drips
// ============================================
export function FastFoodAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter"|"splat"|"hold"|"exit">("enter");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("splat"),  400);
    const t2 = setTimeout(() => setPhase("hold"),   900);
    const t3 = setTimeout(() => setPhase("exit"),   3400);
    const t4 = setTimeout(() => onDone(),           4100);
    return () => { clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);clearTimeout(t4); };
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[999] pointer-events-auto overflow-hidden flex items-center justify-center"
      onClick={() => onDone()}
      style={{cursor:"pointer", opacity:phase==="exit"?0:1, transition:phase==="exit"?"opacity 0.7s ease-in":"opacity 0.3s",
        background:phase==="hold"?"rgba(20,10,0,0.97)":"#000" }}>
      <SkipHint />
      {phase==="hold" && (
        <div className="absolute top-0 left-0 right-0 flex justify-around" style={{zIndex:1}}>
          {[...Array(8)].map((_,i)=>(
            <div key={i} style={{width:`${6+i%3*4}px`,background:"rgba(200,120,0,0.4)",borderRadius:"0 0 50% 50%",animation:`ffDrip ${1+i*0.3}s ease-in ${i*0.2}s infinite`,height:"0"}} />
          ))}
        </div>
      )}
      {phase==="hold" && (
        <div className="absolute inset-0 overflow-hidden">
          {["🍔","🍟","🌭","🍕","🍔","🌮","🍟","🍕"].map((em,i)=>(
            <span key={i} style={{position:"absolute",left:`${(i*12.5)%94}%`,top:"-20px",fontSize:`${16+(i%3)*10}px`,animation:`ffFall ${1.3+i*0.14}s linear ${i*0.1}s infinite`}}>{em}</span>
          ))}
        </div>
      )}
      <div className="relative z-10 flex flex-col items-center gap-4" style={{animation:phase==="splat"?"ffSplat 0.5s ease-out":"none"}}>
        <img src="/images/fastfood-pixel.png" alt="Fast Food"
          style={{ width:"clamp(170px,28vw,230px)", imageRendering:"pixelated", objectFit:"contain",
            animation:phase==="enter"?"ffDrop 0.9s cubic-bezier(0.22,1,0.36,1) forwards":phase==="hold"?"ffWobble 1.5s ease-in-out infinite":"none",
            filter:phase==="hold"?"drop-shadow(0 0 20px rgba(200,120,0,0.7)) saturate(1.4)":"none" }} />
        {phase==="hold" && (
          <div style={{textAlign:"center"}}>
            <div className="px-8 py-4" style={{background:"rgba(10,5,0,0.97)",border:"1px solid rgba(200,120,0,0.6)",boxShadow:"0 0 30px rgba(180,100,0,0.25)"}}>
              <div className="text-[9px] tracking-[0.4em] uppercase mb-1" style={{color:"rgba(220,140,0,0.6)"}}>Bad Habits</div>
              <div className="font-black text-2xl tracking-widest uppercase" style={{color:"#dc8800",textShadow:"0 0 20px rgba(200,120,0,0.9)"}}>Fast Food Addiction</div>
              <div className="text-xs tracking-[0.2em] uppercase mt-1.5" style={{color:"rgba(255,255,255,0.25)"}}>Performance drops — weight increasing</div>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes ffDrop{0%{opacity:0;transform:translateY(-100px) scale(0.5) rotate(15deg)}60%{opacity:1;transform:translateY(8px) scale(1.08) rotate(-3deg)}80%{transform:translateY(-3px) rotate(1deg)}100%{opacity:1;transform:translateY(0) scale(1) rotate(0)}}@keyframes ffSplat{0%,100%{transform:translate(0)}30%{transform:translate(-6px,3px) scale(0.98)}60%{transform:translate(6px,-3px) scale(1.02)}}@keyframes ffWobble{0%,100%{transform:rotate(0) scale(1)}25%{transform:rotate(-3deg) scale(1.03)}75%{transform:rotate(3deg) scale(0.97)}}@keyframes ffFall{0%{transform:translateY(0) rotate(0)}100%{transform:translateY(110vh) rotate(180deg);opacity:0}}@keyframes ffDrip{0%{height:0;opacity:0.6}100%{height:80px;opacity:0}}`}</style>
    </div>
  );
}

// ============================================
// YOUTUBE VIRAL
// ============================================
export function YouTubeViralAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter"|"ping"|"hold"|"exit">("enter");
  const [views, setViews] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("ping"),  300);
    const t2 = setTimeout(() => setPhase("hold"),  1000);
    const t3 = setTimeout(() => setPhase("exit"),  4000);
    const t4 = setTimeout(() => onDone(),          4700);
    let v = 0;
    const vi = setInterval(() => { v += Math.floor(Math.random()*500000+100000); setViews(v); }, 80);
    setTimeout(() => clearInterval(vi), 3500);
    return () => { clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);clearTimeout(t4);clearInterval(vi); };
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[999] pointer-events-auto overflow-hidden flex items-center justify-center"
      onClick={() => onDone()}
      style={{cursor:"pointer", opacity:phase==="exit"?0:1, transition:phase==="exit"?"opacity 0.7s ease-in":"opacity 0.3s",
        background:phase==="hold"?"rgba(10,0,0,0.97)":"#000" }}>
      <SkipHint />
      {phase==="ping" && [...Array(5)].map((_,i)=>(
        <div key={i} className="absolute inset-0" style={{background:"rgba(255,0,0,0.2)",animation:`ytPing 0.3s ease-out ${i*0.06}s forwards`}} />
      ))}
      {phase==="hold" && [...Array(6)].map((_,i)=>(
        <div key={i} className="absolute" style={{top:`${8+i*13}%`,right:`${2+i*2}%`,background:"rgba(0,0,0,0.9)",border:"1px solid rgba(255,0,0,0.5)",padding:"4px 8px",fontSize:"9px",color:"#fff",whiteSpace:"nowrap",animation:`ytNotif 0.4s ease-out ${i*0.15}s both`,boxShadow:"0 0 10px rgba(255,0,0,0.2)"}}>
          🔔 +{(i+1)*247}K views
        </div>
      ))}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <img src="/images/youtube-viral-pixel.png" alt="YouTube Viral"
          style={{ width:"clamp(170px,28vw,230px)", imageRendering:"pixelated", objectFit:"contain",
            animation:phase==="enter"?"ytZoom 0.9s cubic-bezier(0.22,1,0.36,1) forwards":phase==="hold"?"ytPulse 1.5s ease-in-out infinite":"none",
            filter:phase==="hold"?"drop-shadow(0 0 24px rgba(255,0,0,0.8))":"none" }} />
        {phase==="hold" && (
          <div style={{textAlign:"center"}}>
            <div className="px-8 py-4" style={{background:"rgba(8,0,0,0.97)",border:"1px solid rgba(255,0,0,0.7)",boxShadow:"0 0 40px rgba(200,0,0,0.3)"}}>
              <div className="text-[9px] tracking-[0.4em] uppercase mb-1" style={{color:"rgba(255,80,80,0.6)"}}>Viral Clip</div>
              <div className="font-black text-2xl tracking-widest uppercase" style={{color:"#ff2200",textShadow:"0 0 25px rgba(255,30,0,0.9)"}}>YouTube Viral</div>
              <div className="font-black text-lg mt-1" style={{color:"#ff6644"}}>
                {views > 1000000 ? `${(views/1000000).toFixed(1)}M` : `${Math.floor(views/1000)}K`} views
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes ytPing{0%{opacity:0.5}100%{opacity:0}}@keyframes ytZoom{0%{opacity:0;transform:scale(0.3)}60%{opacity:1;transform:scale(1.1)}100%{opacity:1;transform:scale(1)}}@keyframes ytPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}@keyframes ytNotif{0%{opacity:0;transform:translateX(40px)}100%{opacity:1;transform:translateX(0)}}`}</style>
    </div>
  );
}

export function BallonDorAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"black"|"title"|"curtain"|"reveal"|"hold"|"exit">("black");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("title"),   400);
    const t2 = setTimeout(() => setPhase("curtain"), 1600);
    const t3 = setTimeout(() => setPhase("reveal"),  2400);
    const t4 = setTimeout(() => setPhase("hold"),    3200);
    const t5 = setTimeout(() => setPhase("exit"),    6500);
    const t6 = setTimeout(() => onDone(),            7200);
    return () => { clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);clearTimeout(t4);clearTimeout(t5);clearTimeout(t6); };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[999] pointer-events-auto overflow-hidden flex flex-col items-center justify-center"
      onClick={() => onDone()}
      style={{cursor:"pointer", opacity: phase==="exit"?0:1, transition: phase==="exit"?"opacity 1.2s ease-in":"opacity 0.3s",
        background: "#000" }}>

      <SkipHint />

      {/* ── Cinematic bars ── */}
      <div className="absolute top-0 left-0 right-0 z-20" style={{ height:"clamp(45px,7vh,72px)", background:"#000" }} />
      <div className="absolute bottom-0 left-0 right-0 z-20" style={{ height:"clamp(45px,7vh,72px)", background:"#000" }} />

      {/* ── Deep velvet background ── */}
      <div className="absolute inset-0" style={{
        background: phase==="hold"||phase==="reveal"
          ? "radial-gradient(ellipse at 50% 40%, rgba(40,20,0,0.9) 0%, rgba(10,5,0,1) 60%, #000 100%)"
          : "radial-gradient(ellipse at 50% 40%, rgba(10,5,0,0.9) 0%, #000 70%)",
        transition: "background 1.5s ease",
      }} />

      {/* ── Title card ── */}
      {(phase==="title"||phase==="curtain") && (
        <div className="absolute flex flex-col items-center gap-3 z-10"
          style={{ animation: phase==="curtain"?"bdTitleFade 0.8s ease-in forwards":"bdTitleIn 1.2s ease-out forwards" }}>
          <div className="text-[9px] tracking-[0.8em] uppercase" style={{ color:"rgba(212,175,55,0.5)" }}>
            Presented by France Football
          </div>
          <div className="font-black uppercase tracking-widest"
            style={{ fontSize:"clamp(2rem,6vw,4rem)", color:"rgba(212,175,55,0.15)",
              textShadow:"0 0 60px rgba(212,175,55,0.1)", letterSpacing:"0.2em" }}>
            Ballon d'Or
          </div>
          <div className="text-[9px] tracking-[0.5em] uppercase" style={{ color:"rgba(255,255,255,0.15)" }}>
            The world's greatest individual honor
          </div>
        </div>
      )}

      {/* ── Red velvet curtains ── */}
      {(phase==="curtain"||phase==="reveal"||phase==="hold") && (
        <div className="absolute inset-0 flex z-10">
          <div style={{
            flex:1,
            background: "linear-gradient(90deg, rgba(80,0,0,0.95) 0%, rgba(50,0,0,0.98) 100%)",
            transformOrigin: "left center",
            animation: phase==="reveal"||phase==="hold"
              ? "bdCurtainL 1.2s cubic-bezier(0.22,1,0.36,1) forwards"
              : "bdCurtainIn 0.8s ease-out forwards",
            boxShadow: "inset -8px 0 20px rgba(0,0,0,0.5)",
          }} />
          <div style={{
            flex:1,
            background: "linear-gradient(90deg, rgba(50,0,0,0.98) 0%, rgba(80,0,0,0.95) 100%)",
            transformOrigin: "right center",
            animation: phase==="reveal"||phase==="hold"
              ? "bdCurtainR 1.2s cubic-bezier(0.22,1,0.36,1) forwards"
              : "bdCurtainIn 0.8s ease-out forwards",
            boxShadow: "inset 8px 0 20px rgba(0,0,0,0.5)",
          }} />
        </div>
      )}

      {/* ── Spotlight from above ── */}
      {(phase==="reveal"||phase==="hold") && (
        <div className="absolute z-5" style={{
          top: 0, left:"50%", transform:"translateX(-50%)",
          width:"clamp(200px,30vw,320px)", height:"100vh",
          background:"linear-gradient(180deg, rgba(255,230,150,0.18) 0%, rgba(212,175,55,0.06) 40%, transparent 70%)",
          clipPath:"polygon(20% 0%,80% 0%,100% 100%,0% 100%)",
          animation:"bdSpotlight 4s ease-in-out infinite alternate",
        }} />
      )}

      {/* ── Gold dust particles ── */}
      {phase==="hold" && [...Array(20)].map((_,i)=>(
        <div key={i} className="absolute z-8 rounded-full" style={{
          width:`${1+(i%3)}px`, height:`${1+(i%3)}px`,
          left:`${(i*5.3)%94}%`, bottom:"10%",
          background:`rgba(212,175,55,${0.4+i%3*0.2})`,
          boxShadow:`0 0 3px rgba(212,175,55,0.6)`,
          animation:`bdDust ${3+i*0.25}s ease-out ${i*0.12}s infinite`,
        }} />
      ))}

      {/* ── Gold confetti ── */}
      {phase==="hold" && [...Array(18)].map((_,i)=>(
        <div key={i} className="absolute z-8" style={{
          width:`${3+(i%3)*2}px`, height:`${7+(i%4)*4}px`,
          left:`${(i*5.7)%96}%`, top:"-20px",
          background:`hsl(${42+(i%12)*3},${75+i%15}%,${50+i%20}%)`,
          borderRadius:"1px",
          animation:`bdConf ${1.8+i*0.13}s linear ${i*0.08}s infinite`,
        }} />
      ))}

      {/* ── Expanding rings ── */}
      {phase==="hold" && [300,420,540].map((size,i)=>(
        <div key={i} className="absolute rounded-full z-5" style={{
          width:`${size}px`, height:`${size}px`,
          border:`1px solid rgba(212,175,55,${0.3-i*0.08})`,
          animation:`bdRing ${3+i*0.8}s ease-out ${i*0.5}s infinite`,
        }} />
      ))}

      {/* ── Trophy portrait ── */}
      <div className="relative z-15 flex flex-col items-center gap-5">
        <div style={{
          opacity: phase==="reveal"||phase==="hold" ? 1 : 0,
          transition: "opacity 0.6s ease",
          animation: phase==="reveal"
            ? "bdReveal 1.2s cubic-bezier(0.22,1,0.36,1) forwards"
            : phase==="hold"
            ? "bdFloat 4s ease-in-out infinite"
            : "none",
        }}>
          <img src="/images/ballon-dor-pixel.png" alt="Ballon d'Or"
            style={{
              width:"clamp(160px,26vw,220px)",
              imageRendering:"pixelated", objectFit:"contain",
              filter: phase==="hold"
                ? "drop-shadow(0 0 30px rgba(212,175,55,1)) drop-shadow(0 0 60px rgba(212,175,55,0.6)) drop-shadow(0 0 100px rgba(255,220,80,0.3)) brightness(1.1)"
                : "drop-shadow(0 0 10px rgba(212,175,55,0.3))",
              transition: "filter 0.8s ease",
            }}
          />
        </div>

        {/* ── Award card ── */}
        {phase==="hold" && (
          <div style={{ textAlign:"center",
            animation:"bdCardReveal 0.8s cubic-bezier(0.22,1,0.36,1) forwards" }}>
            <div style={{
              background:"linear-gradient(135deg,rgba(3,2,0,0.98),rgba(12,8,0,0.98))",
              border:"1px solid rgba(212,175,55,0.9)",
              boxShadow:"0 0 60px rgba(212,175,55,0.4), 0 0 120px rgba(212,175,55,0.15), inset 0 0 40px rgba(212,175,55,0.04)",
              padding:"20px 40px",
            }}>
              <div className="flex items-center gap-4 mb-4">
                <div style={{flex:1,height:"1px",background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.6))"}} />
                <span className="text-[9px] tracking-[0.6em] uppercase" style={{color:"rgba(212,175,55,0.5)"}}>World Best</span>
                <div style={{flex:1,height:"1px",background:"linear-gradient(90deg,rgba(212,175,55,0.6),transparent)"}} />
              </div>
              <div className="font-black tracking-widest uppercase"
                style={{ fontSize:"clamp(1.6rem,4vw,2.6rem)",
                  color:"#D4AF37",
                  textShadow:"0 0 30px rgba(212,175,55,1), 0 0 60px rgba(212,175,55,0.6), 0 0 100px rgba(255,220,80,0.3)",
                  letterSpacing:"0.12em" }}>
                Ballon d'Or
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div style={{flex:1,height:"1px",background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.3))"}} />
                <span className="text-xs" style={{color:"rgba(212,175,55,0.4)"}}>✦</span>
                <div style={{flex:1,height:"1px",background:"linear-gradient(90deg,rgba(212,175,55,0.3),transparent)"}} />
              </div>
              <div className="text-xs tracking-[0.3em] uppercase mt-2" style={{color:"rgba(255,255,255,0.2)"}}>
                The greatest individual honor in football
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bdTitleIn  {0%{opacity:0;transform:scale(0.8)}100%{opacity:1;transform:scale(1)}}
        @keyframes bdTitleFade{0%{opacity:1}100%{opacity:0}}
        @keyframes bdCurtainIn{0%{transform:scaleX(0)}100%{transform:scaleX(1)}}
        @keyframes bdCurtainL {0%{transform:scaleX(1)}100%{transform:scaleX(0)}}
        @keyframes bdCurtainR {0%{transform:scaleX(1)}100%{transform:scaleX(0)}}
        @keyframes bdSpotlight{0%{transform:translateX(-50%) rotate(-5deg)}100%{transform:translateX(-50%) rotate(5deg)}}
        @keyframes bdReveal   {0%{opacity:0;transform:scale(0.3) translateY(40px)}60%{opacity:1;transform:scale(1.1) translateY(-8px)}100%{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes bdFloat    {0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-16px) scale(1.02)}}
        @keyframes bdRing     {0%{transform:scale(0.5);opacity:0.6}100%{transform:scale(2.5);opacity:0}}
        @keyframes bdDust     {0%{transform:translateY(0);opacity:0.8}100%{transform:translateY(-80vh);opacity:0}}
        @keyframes bdConf     {0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(110vh) rotate(540deg);opacity:0}}
        @keyframes bdCardReveal{0%{opacity:0;transform:translateY(20px)}100%{opacity:1;transform:translateY(0)}}
      `}</style>
    </div>
  );
}


export function GoldenBoyAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"rise"|"hold"|"exit">("rise");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"),  1200);
    const t2 = setTimeout(() => setPhase("exit"),  4000);
    const t3 = setTimeout(() => onDone(),          4700);
    return () => { clearTimeout(t1);clearTimeout(t2);clearTimeout(t3); };
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[999] pointer-events-auto overflow-hidden flex items-center justify-center"
      onClick={() => onDone()}
      style={{cursor:"pointer", opacity:phase==="exit"?0:1, transition:phase==="exit"?"opacity 0.8s ease-in":"opacity 0.3s",
        background:"radial-gradient(ellipse at 50% 60%, rgba(60,45,0,0.5) 0%,#000 70%)" }}>
      <SkipHint />
      {/* Ground crack effect */}
      {(phase==="rise"||phase==="hold") && (
        <div className="absolute" style={{bottom:"28%",left:0,right:0,height:"2px",background:"linear-gradient(90deg,transparent 10%,rgba(212,175,55,0.4) 50%,transparent 90%)",animation:"gbCrack 0.3s ease-out forwards"}} />
      )}
      {/* Star sparkles */}
      {phase==="hold" && [...Array(10)].map((_,i)=>(
        <div key={i} className="absolute" style={{
          width:"4px",height:"4px",background:"#D4AF37",borderRadius:"50%",
          left:`${(i*10.5)%90}%`,top:`${15+(i*7)%50}%`,
          boxShadow:"0 0 6px rgba(212,175,55,0.9)",
          animation:`gbStar ${1+i*0.2}s ease-in-out ${i*0.15}s infinite alternate`,
        }} />
      ))}
      <div className="relative z-10 flex flex-col items-center gap-5">
        <img src="/images/golden-boy-pixel.png" alt="Golden Boy"
          style={{ width:"clamp(160px,26vw,220px)", imageRendering:"pixelated", objectFit:"contain",
            animation: phase==="rise" ? "gbRise 1.2s cubic-bezier(0.22,1,0.36,1) forwards"
              : phase==="hold" ? "gbFloat 3s ease-in-out infinite" : "none",
            filter:phase==="hold"?"drop-shadow(0 0 28px rgba(212,175,55,1)) drop-shadow(0 0 56px rgba(212,175,55,0.5))":"none",
          }}
        />
        {phase==="hold" && (
          <div style={{textAlign:"center"}}>
            <div className="px-9 py-5" style={{background:"rgba(5,4,0,0.97)",border:"1px solid rgba(212,175,55,0.8)",boxShadow:"0 0 50px rgba(212,175,55,0.35)"}}>
              <div className="text-[9px] tracking-[0.5em] uppercase mb-2" style={{color:"rgba(212,175,55,0.5)"}}>Rising Star Award</div>
              <div className="font-black text-2xl tracking-widest uppercase" style={{color:"#D4AF37",textShadow:"0 0 25px rgba(212,175,55,1)"}}>Golden Boy</div>
              <div className="text-xs tracking-[0.2em] uppercase mt-1.5" style={{color:"rgba(255,255,255,0.25)"}}>Best young player of the year</div>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes gbRise{0%{opacity:0;transform:translateY(100px) scale(0.6)}60%{opacity:1;transform:translateY(-8px) scale(1.08)}80%{transform:translateY(3px) scale(0.97)}100%{opacity:1;transform:translateY(0) scale(1)}}@keyframes gbFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}@keyframes gbCrack{0%{width:0;opacity:0}100%{opacity:1}}@keyframes gbStar{0%{transform:scale(0.5);opacity:0.3}100%{transform:scale(1.5);opacity:1}}`}</style>
    </div>
  );
}

// ============================================
// RECORD TRANSFER — ticker tape + cash explosion
// ============================================
export function RecordTransferAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter"|"ticker"|"hold"|"exit">("enter");
  const [amount, setAmount] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("ticker"), 400);
    const t2 = setTimeout(() => setPhase("hold"),   1200);
    const t3 = setTimeout(() => setPhase("exit"),   3800);
    const t4 = setTimeout(() => onDone(),           4500);
    let a = 0; const target = Math.floor(Math.random()*200+100);
    const ai = setInterval(() => { a += Math.floor(Math.random()*30+10); if(a>=target){a=target;clearInterval(ai);} setAmount(a); }, 50);
    return () => { clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);clearTimeout(t4);clearInterval(ai); };
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[999] pointer-events-auto overflow-hidden flex items-center justify-center"
      onClick={() => onDone()}
      style={{cursor:"pointer", opacity:phase==="exit"?0:1, transition:phase==="exit"?"opacity 0.7s ease-in":"opacity 0.3s",
        background:"radial-gradient(ellipse at center,rgba(0,50,10,0.6) 0%,#000 70%)" }}>
      <SkipHint />
      {/* Breaking news ticker */}
      {(phase==="ticker"||phase==="hold") && (
        <div className="absolute bottom-8 left-0 right-0" style={{background:"rgba(0,0,0,0.95)",borderTop:"3px solid #00cc44",padding:"6px 0",overflow:"hidden",zIndex:3}}>
          <div style={{whiteSpace:"nowrap",animation:"rtTicker 6s linear infinite",color:"#00cc44",fontWeight:900,fontSize:"12px",letterSpacing:"0.1em"}}>
            🚨 BREAKING: RECORD TRANSFER FEE AGREED &nbsp;&nbsp;&nbsp; 🚨 SOURCES CONFIRM: HISTORIC DEAL &nbsp;&nbsp;&nbsp; 🚨 UNPRECEDENTED AMOUNT PAID &nbsp;&nbsp;&nbsp;
          </div>
        </div>
      )}
      {/* Money explosion */}
      {phase==="hold" && [...Array(10)].map((_,i)=>(
        <div key={i} className="absolute rounded-full" style={{
          width:`${3+(i%3)}px`,height:`${3+(i%3)}px`,
          left:`${(i*10.3)%92}%`,bottom:"15%",
          background:"#00cc44",boxShadow:"0 0 5px rgba(0,200,60,0.8)",
          animation:`rtParticle ${1.5+i*0.2}s ease-out ${i*0.1}s infinite`,
        }} />
      ))}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <img src="/images/record-transfer-pixel.png" alt="Record Transfer"
          style={{ width:"clamp(180px,30vw,250px)", imageRendering:"pixelated", objectFit:"contain",
            animation: phase==="enter" ? "rtSlide 0.8s cubic-bezier(0.22,1,0.36,1) forwards"
              : phase==="hold" ? "rtBob 2s ease-in-out infinite" : "none",
            filter:phase==="hold"?"drop-shadow(0 0 24px rgba(0,200,80,0.8))":"none",
          }}
        />
        {phase==="hold" && (
          <div style={{textAlign:"center"}}>
            <div className="px-9 py-5" style={{background:"rgba(0,5,0,0.97)",border:"1px solid rgba(0,200,80,0.7)",boxShadow:"0 0 50px rgba(0,180,60,0.3)"}}>
              <div className="text-[9px] tracking-[0.5em] uppercase mb-2" style={{color:"rgba(0,200,80,0.6)"}}>Breaking Deal</div>
              <div className="font-black text-2xl tracking-widest uppercase" style={{color:"#00cc44",textShadow:"0 0 25px rgba(0,200,60,1)"}}>Record Transfer</div>
              <div className="font-black text-xl mt-1" style={{color:"#00ff55"}}>€{amount}M</div>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes rtSlide{0%{opacity:0;transform:translateX(-100px)}60%{opacity:1;transform:translateX(6px)}100%{opacity:1;transform:translateX(0)}}@keyframes rtBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}@keyframes rtTicker{0%{transform:translateX(100%)}100%{transform:translateX(-100%)}}@keyframes rtParticle{0%{transform:translateY(0);opacity:0.8}100%{transform:translateY(-80vh);opacity:0}}`}</style>
    </div>
  );
}

// ============================================
// WONDERKID — glitch data scan reveal
// ============================================
export function WonderkidAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"scan"|"lock"|"hold"|"exit">("scan");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("lock"),  800);
    const t2 = setTimeout(() => setPhase("hold"),  1400);
    const t3 = setTimeout(() => setPhase("exit"),  3800);
    const t4 = setTimeout(() => onDone(),          4500);
    return () => { clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);clearTimeout(t4); };
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[999] pointer-events-auto overflow-hidden flex items-center justify-center"
      onClick={() => onDone()}
      style={{cursor:"pointer", opacity:phase==="exit"?0:1, transition:phase==="exit"?"opacity 0.7s ease-in":"opacity 0.3s",
        background:"radial-gradient(ellipse at center,rgba(0,20,60,0.7) 0%,#000 70%)" }}>
      <SkipHint />
      {/* Scan line */}
      {(phase==="scan") && (
        <div className="absolute" style={{left:0,right:0,height:"3px",background:"rgba(0,200,255,0.8)",boxShadow:"0 0 20px rgba(0,200,255,0.8)",animation:"wkScan 0.8s ease-in-out 1 forwards",zIndex:3}} />
      )}
      {/* Glitch lines */}
      {(phase==="hold") && [...Array(5)].map((_,i)=>(
        <div key={i} className="absolute w-full" style={{height:"1px",top:`${15+i*17}%`,background:`rgba(0,200,255,${0.08+i*0.03})`,animation:`wkGlitch ${0.8+i*0.2}s steps(1) ${i*0.15}s infinite`}} />
      ))}
      {/* Data readout numbers */}
      {phase==="lock" && (
        <div className="absolute inset-0 flex items-center justify-center" style={{zIndex:2}}>
          <div style={{fontFamily:"monospace",fontSize:"clamp(40px,8vw,70px)",fontWeight:900,color:"rgba(0,200,255,0.8)",animation:"wkLock 0.6s steps(1) infinite",textShadow:"0 0 20px rgba(0,200,255,0.9)"}}>
            TARGET LOCKED
          </div>
        </div>
      )}
      {/* Rising particles */}
      {phase==="hold" && [...Array(10)].map((_,i)=>(
        <div key={i} className="absolute rounded-full" style={{
          width:`${2+(i%3)}px`,height:`${2+(i%3)}px`,
          left:`${(i*10.3)%92}%`,bottom:"5%",
          background:"rgba(0,200,255,0.8)",boxShadow:"0 0 4px rgba(0,200,255,0.8)",
          animation:`wkRise ${2+i*0.2}s ease-out ${i*0.1}s infinite`,
        }} />
      ))}
      <div className="relative z-10 flex flex-col items-center gap-5">
        <img src="/images/wonderkid-pixel.png" alt="Wonderkid"
          style={{ width:"clamp(160px,26vw,220px)", imageRendering:"pixelated", objectFit:"contain",
            animation: phase==="scan" ? "wkAppear 0.8s ease-out forwards"
              : phase==="hold" ? "wkElectric 2s ease-in-out infinite" : "none",
            filter:phase==="hold"?"drop-shadow(0 0 24px rgba(0,220,255,0.9)) drop-shadow(0 0 48px rgba(0,180,255,0.4))":"none",
          }}
        />
        {phase==="hold" && (
          <div style={{textAlign:"center"}}>
            <div className="px-9 py-5" style={{background:"rgba(0,3,12,0.97)",border:"1px solid rgba(0,200,255,0.6)",boxShadow:"0 0 50px rgba(0,180,255,0.25)"}}>
              <div className="text-[9px] tracking-[0.5em] uppercase mb-2" style={{color:"rgba(0,200,255,0.5)"}}>Rising Star</div>
              <div className="font-black text-2xl tracking-widest uppercase" style={{color:"#00c8ff",textShadow:"0 0 25px rgba(0,200,255,1)"}}>Wonderkid</div>
              <div className="text-xs tracking-[0.2em] uppercase mt-1.5" style={{color:"rgba(255,255,255,0.25)"}}>The next big thing</div>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes wkScan{0%{top:0}100%{top:100%}}@keyframes wkLock{0%,100%{opacity:1}50%{opacity:0}}@keyframes wkAppear{0%{opacity:0;transform:scaleX(0)}100%{opacity:1;transform:scaleX(1)}}@keyframes wkElectric{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}@keyframes wkRise{0%{transform:translateY(0);opacity:0.8}100%{transform:translateY(-90vh);opacity:0}}@keyframes wkGlitch{0%,90%,100%{opacity:0;transform:translateX(0)}92%{opacity:1;transform:translateX(-8px)}96%{opacity:1;transform:translateX(8px)}}`}</style>
    </div>
  );
}

// ============================================
// BOB PAISLEY — طائرة تطير من اليمين تنفجر + شاشة تهتز
// ============================================
export function BobPaisleyAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"fly"|"explode"|"hold"|"exit">("fly");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("explode"), 900);
    const t2 = setTimeout(() => setPhase("hold"),    1600);
    const t3 = setTimeout(() => setPhase("exit"),    4000);
    const t4 = setTimeout(() => onDone(),            4700);
    return () => { clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);clearTimeout(t4); };
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[999] pointer-events-auto overflow-hidden flex items-center justify-center"
      onClick={() => onDone()}
      style={{cursor:"pointer", opacity:phase==="exit"?0:1, transition:phase==="exit"?"opacity 0.7s ease-in":"opacity 0.3s",
        background:"#000", animation:phase==="explode"?"bpShake 0.5s ease-out":"none" }}>
      <SkipHint />
      <div className="absolute inset-0" style={{background:phase==="hold"?"radial-gradient(ellipse at center,rgba(60,20,0,0.65) 0%,rgba(0,0,0,0.97) 65%)":"rgba(0,0,0,0.9)",transition:"background 0.4s"}} />
      {/* Explosion flash */}
      {phase==="explode" && <div className="absolute inset-0" style={{background:"rgba(255,150,0,0.4)",animation:"bpFlash 0.5s ease-out forwards"}} />}
      {/* Fire sparks */}
      {phase==="explode" && ["🔥","💥","🔥","💥","🔥","💥"].map((em,i)=>(
        <span key={i} style={{position:"absolute",left:`${25+(i*9)}%`,top:`${25+(i*5)%25}%`,
          fontSize:`${20+(i%3)*14}px`,animation:`bpSpark 0.5s ease-out ${i*0.04}s forwards`}}>{em}</span>
      ))}
      {/* Smoke */}
      {phase==="hold" && [...Array(6)].map((_,i)=>(
        <div key={i} className="absolute rounded-full" style={{
          width:`${30+i*12}px`,height:`${30+i*12}px`,
          left:`${28+(i*7)}%`,top:`${15+(i*6)%30}%`,
          background:`rgba(40,30,20,0.5)`,filter:"blur(8px)",
          animation:`bpSmoke ${2+i*0.3}s ease-out ${i*0.1}s infinite`,
        }} />
      ))}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <img src="/images/bob-paisley-pixel.png" alt="Bob Paisley"
          style={{ width:"clamp(200px,34vw,300px)", imageRendering:"pixelated", objectFit:"contain",
            animation: phase==="fly" ? "bpFly 0.9s cubic-bezier(0.22,1,0.36,1) forwards"
              : phase==="explode" ? "bpExplode 0.5s ease-out forwards"
              : phase==="hold" ? "bpHover 2.5s ease-in-out infinite" : "none",
            filter:phase==="hold"?"drop-shadow(0 0 24px rgba(255,80,0,0.8)) drop-shadow(0 0 50px rgba(255,40,0,0.4))":"none",
          }}
        />
        {phase==="hold" && (
          <div style={{textAlign:"center"}}>
            <div className="px-8 py-5" style={{background:"rgba(5,1,0,0.97)",border:"1px solid rgba(255,80,0,0.7)",boxShadow:"0 0 40px rgba(255,60,0,0.3)"}}>
              <div className="text-[9px] tracking-[0.5em] uppercase mb-2" style={{color:"rgba(255,120,0,0.6)"}}>Catastrophic</div>
              <div className="font-black text-2xl tracking-widest uppercase" style={{color:"#ff5000",textShadow:"0 0 25px rgba(255,80,0,0.9)"}}>Bob Paisley</div>
              <div className="text-xs tracking-[0.2em] uppercase mt-1.5" style={{color:"rgba(255,255,255,0.25)"}}>A catastrophic turn of events</div>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes bpFly{0%{opacity:0;transform:translateX(150vw) rotate(-12deg) scale(0.5)}60%{opacity:1;transform:translateX(-8px) rotate(3deg) scale(1.05)}100%{opacity:1;transform:translateX(0) rotate(0) scale(1)}}@keyframes bpExplode{0%{transform:scale(1)}30%{transform:scale(1.3);filter:brightness(3)}70%{transform:scale(0.85)}100%{transform:scale(1)}}@keyframes bpHover{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-8px) rotate(-1deg)}}@keyframes bpShake{0%,100%{transform:translate(0)}20%{transform:translate(-10px,5px)}40%{transform:translate(10px,-5px)}60%{transform:translate(-5px,3px)}80%{transform:translate(5px,-3px)}}@keyframes bpFlash{0%{opacity:0.5}100%{opacity:0}}@keyframes bpSpark{0%{opacity:1;transform:scale(0.5) translate(0)}100%{opacity:0;transform:scale(1.5) translate(20px,-30px)}}@keyframes bpSmoke{0%{transform:translateY(0) scale(1);opacity:0.5}100%{transform:translateY(-60px) scale(2);opacity:0}}`}</style>
    </div>
  );
}

// ============================================
// HOT MARKET — stock exchange chaos
// ============================================
export function HotMarketAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter"|"hold"|"exit">("enter");
  const [ticker, setTicker] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"),  700);
    const t2 = setTimeout(() => setPhase("exit"),  3200);
    const t3 = setTimeout(() => onDone(),          3900);
    const ti = setInterval(() => setTicker(v=>v+Math.floor(Math.random()*8+2)), 60);
    setTimeout(() => clearInterval(ti), 3000);
    return () => { clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);clearInterval(ti); };
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[999] pointer-events-auto overflow-hidden flex items-center justify-center"
      onClick={() => onDone()}
      style={{cursor:"pointer", opacity:phase==="exit"?0:1, transition:phase==="exit"?"opacity 0.7s ease-in":"opacity 0.3s",
        background:"radial-gradient(ellipse at center,rgba(0,50,10,0.6) 0%,#000 70%)" }}>
      <SkipHint />
      {/* Chart lines background */}
      {phase==="hold" && (
        <div className="absolute inset-0 overflow-hidden" style={{zIndex:1}}>
          {[...Array(5)].map((_,i)=>(
            <div key={i} className="absolute" style={{bottom:`${10+i*15}%`,left:0,right:0,height:"1px",background:`rgba(0,200,60,${0.06+i*0.03})`}} />
          ))}
        </div>
      )}
      {/* Green arrows raining */}
      {phase==="hold" && (
        <div className="absolute inset-0 overflow-hidden">
          {["📈","📈","📈","↗","↑","📈","↗","↑"].map((s,i)=>(
            <span key={i} style={{position:"absolute",left:`${(i*12.8)%93}%`,top:"-20px",
              fontSize:`${16+(i%3)*8}px`,animation:`hmFall ${1.2+i*0.13}s linear ${i*0.1}s infinite`}}>{s}</span>
          ))}
        </div>
      )}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <img src="/images/hot-market-pixel.png" alt="Hot Market"
          style={{ width:"clamp(200px,34vw,280px)", imageRendering:"pixelated", objectFit:"contain",
            animation: phase==="enter" ? "hmDrop 0.7s cubic-bezier(0.22,1,0.36,1) forwards"
              : phase==="hold" ? "hmBob 2s ease-in-out infinite" : "none",
            filter:phase==="hold"?"drop-shadow(0 0 24px rgba(0,220,80,0.9))":"none",
          }}
        />
        {phase==="hold" && (
          <div style={{textAlign:"center"}}>
            <div className="px-9 py-5" style={{background:"rgba(0,5,0,0.97)",border:"1px solid rgba(0,200,80,0.7)",boxShadow:"0 0 40px rgba(0,180,60,0.3)"}}>
              <div className="text-[9px] tracking-[0.5em] uppercase mb-2" style={{color:"rgba(0,200,80,0.6)"}}>Market Event</div>
              <div className="font-black text-2xl tracking-widest uppercase" style={{color:"#00e060",textShadow:"0 0 25px rgba(0,220,80,0.9)"}}>Hot Market</div>
              <div className="font-black text-lg mt-1" style={{color:"#00ff80"}}>+{ticker}% surge</div>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes hmDrop{0%{opacity:0;transform:translateY(-80px) scale(0.6)}60%{opacity:1;transform:translateY(6px) scale(1.06)}100%{opacity:1;transform:translateY(0) scale(1)}}@keyframes hmBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@keyframes hmFall{0%{transform:translateY(0);opacity:1}100%{transform:translateY(110vh);opacity:0}}`}</style>
    </div>
  );
}

// ============================================
// ONE SEASON WONDER — spotlight فلاش ثم تلاشي
// ============================================
export function OneSeasonWonderAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"flash"|"hold"|"fade"|"exit">("flash");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"),  800);
    const t2 = setTimeout(() => setPhase("fade"),  2500);
    const t3 = setTimeout(() => setPhase("exit"),  3500);
    const t4 = setTimeout(() => onDone(),          4200);
    return () => { clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);clearTimeout(t4); };
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[999] pointer-events-auto overflow-hidden flex items-center justify-center"
      onClick={() => onDone()}
      style={{cursor:"pointer", opacity:phase==="exit"?0:1, transition:phase==="exit"?"opacity 0.8s ease-in":"opacity 0.3s",
        background:"#000" }}>
      <SkipHint />
      {/* Initial flash */}
      {phase==="flash" && <div className="absolute inset-0" style={{background:"rgba(255,200,0,0.3)",animation:"oswFlash 0.8s ease-out forwards"}} />}
      {/* Spotlight beam */}
      {(phase==="hold") && (
        <div className="absolute" style={{top:0,left:"50%",transform:"translateX(-50%)",width:"250px",height:"100vh",
          background:"linear-gradient(180deg,rgba(255,200,50,0.2) 0%,transparent 55%)",
          clipPath:"polygon(20% 0%,80% 0%,100% 100%,0% 100%)",
          animation:"oswSpot 2s ease-in-out infinite alternate"}} />
      )}
      {/* Fading particles (after peak) */}
      {phase==="fade" && [...Array(8)].map((_,i)=>(
        <div key={i} className="absolute rounded-full" style={{
          width:`${4+(i%3)*2}px`,height:`${4+(i%3)*2}px`,
          left:`${(i*12.5)%90}%`,top:`${20+(i*7)%50}%`,
          background:"rgba(255,200,50,0.6)",
          animation:`oswFade ${0.8+i*0.1}s ease-out ${i*0.05}s forwards`,
        }} />
      ))}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <img src="/images/one-season-wonder-pixel.png" alt="One Season Wonder"
          style={{ width:"clamp(200px,34vw,280px)", imageRendering:"pixelated", objectFit:"contain",
            animation: phase==="flash" ? "oswEnter 0.8s cubic-bezier(0.22,1,0.36,1) forwards"
              : phase==="hold" ? "oswGlow 2.5s ease-in-out infinite"
              : phase==="fade" ? "oswShrink 1s ease-in forwards" : "none",
            filter:phase==="hold"?"drop-shadow(0 0 28px rgba(255,200,50,0.9))":"none",
          }}
        />
        {(phase==="hold"||phase==="fade") && (
          <div style={{textAlign:"center",opacity:phase==="fade"?0:1,transition:"opacity 0.8s ease"}}>
            <div className="px-9 py-5" style={{background:"rgba(8,6,0,0.97)",border:"1px solid rgba(255,180,0,0.7)",boxShadow:"0 0 40px rgba(255,160,0,0.3)"}}>
              <div className="text-[9px] tracking-[0.5em] uppercase mb-2" style={{color:"rgba(255,180,0,0.6)"}}>Flash of Brilliance</div>
              <div className="font-black text-2xl tracking-widest uppercase" style={{color:"#ffb400",textShadow:"0 0 25px rgba(255,180,0,0.9)"}}>One Season Wonder</div>
              <div className="text-xs tracking-[0.2em] uppercase mt-1.5" style={{color:"rgba(255,255,255,0.25)"}}>Shine while it lasts</div>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes oswFlash{0%{opacity:0.4}100%{opacity:0}}@keyframes oswEnter{0%{opacity:0;transform:scale(1.5) translateY(-20px)}60%{opacity:1;transform:scale(0.97) translateY(4px)}100%{opacity:1;transform:scale(1) translateY(0)}}@keyframes oswGlow{0%,100%{filter:drop-shadow(0 0 28px rgba(255,200,50,0.9))}50%{filter:drop-shadow(0 0 45px rgba(255,220,60,1)) drop-shadow(0 0 80px rgba(255,200,50,0.5))}}@keyframes oswShrink{0%{transform:scale(1);opacity:1}100%{transform:scale(0.6);opacity:0}}@keyframes oswSpot{0%{transform:translateX(-50%) rotate(-6deg)}100%{transform:translateX(-50%) rotate(6deg)}}@keyframes oswFade{0%{transform:scale(1);opacity:0.6}100%{transform:scale(0.3) translateY(-30px);opacity:0}}`}</style>
    </div>
  );
}

// ============================================
// CASINO NIGHT — slot machine spin
// ============================================
export function CasinoNightAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"spin"|"hold"|"exit">("spin");
  const [slot, setSlot] = useState(["🎰","🎰","🎰"]);
  const symbols = ["🎰","🃏","🎲","💰","7️⃣","🍒","⭐"];
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"),  1400);
    const t2 = setTimeout(() => setPhase("exit"),  3800);
    const t3 = setTimeout(() => onDone(),          4500);
    let count = 0;
    const si = setInterval(() => {
      count++;
      setSlot([symbols[Math.floor(Math.random()*symbols.length)],symbols[Math.floor(Math.random()*symbols.length)],symbols[Math.floor(Math.random()*symbols.length)]]);
      if(count>12) clearInterval(si);
    },90);
    return () => { clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);clearInterval(si); };
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[999] pointer-events-auto overflow-hidden flex items-center justify-center"
      onClick={() => onDone()}
      style={{cursor:"pointer", opacity:phase==="exit"?0:1, transition:phase==="exit"?"opacity 0.7s ease-in":"opacity 0.3s",
        background:"radial-gradient(ellipse at center,rgba(60,30,0,0.7) 0%,#000 70%)" }}>
      <SkipHint />
      {/* Neon sign flicker */}
      {(phase==="spin"||phase==="hold") && (
        <div className="absolute top-8" style={{fontSize:"clamp(20px,4vw,32px)",fontWeight:900,letterSpacing:"0.2em",
          color:"rgba(255,150,0,0.9)",textShadow:"0 0 20px rgba(255,150,0,0.8), 0 0 40px rgba(255,100,0,0.4)",
          animation:"casinoNeon 0.5s steps(2) infinite"}}>
          ✦ CASINO ROYALE ✦
        </div>
      )}
      {/* Slot machine display */}
      <div className="absolute top-20 flex gap-2" style={{zIndex:3}}>
        {slot.map((s,i)=>(
          <div key={i} style={{width:"50px",height:"60px",background:"rgba(0,0,0,0.9)",border:"2px solid rgba(255,150,0,0.6)",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:"24px",
            boxShadow:"inset 0 0 10px rgba(0,0,0,0.5)",
            animation:phase==="spin"?`casinoSlot 0.1s steps(1) ${i*0.05}s infinite`:"none"}}>
            {s}
          </div>
        ))}
      </div>
      <div className="relative z-10 flex flex-col items-center gap-4 mt-12">
        <img src="/images/casino-night-pixel.png" alt="Casino Night"
          style={{ width:"clamp(180px,28vw,240px)", imageRendering:"pixelated", objectFit:"contain",
            animation: phase==="spin" ? "casinoIn 1.4s cubic-bezier(0.22,1,0.36,1) forwards"
              : phase==="hold" ? "casinoPulse 1.5s ease-in-out infinite" : "none",
            filter:phase==="hold"?"drop-shadow(0 0 24px rgba(255,150,0,0.8))":"none",
          }}
        />
        {phase==="hold" && (
          <div style={{textAlign:"center"}}>
            <div className="px-9 py-4" style={{background:"rgba(10,5,0,0.97)",border:"1px solid rgba(255,150,0,0.7)",boxShadow:"0 0 40px rgba(255,130,0,0.25)"}}>
              <div className="text-[9px] tracking-[0.5em] uppercase mb-2" style={{color:"rgba(255,150,0,0.6)"}}>Risky Night</div>
              <div className="font-black text-2xl tracking-widest uppercase" style={{color:"#ff9500",textShadow:"0 0 25px rgba(255,150,0,0.9)"}}>Casino Night</div>
              <div className="text-xs tracking-[0.2em] uppercase mt-1.5" style={{color:"rgba(255,255,255,0.25)"}}>Salary demands skyrocket</div>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes casinoNeon{0%{opacity:1}50%{opacity:0.3}}@keyframes casinoSlot{0%{transform:translateY(0)}50%{transform:translateY(-5px)}}@keyframes casinoIn{0%{opacity:0;transform:rotate(-10deg) scale(0.4)}60%{opacity:1;transform:rotate(3deg) scale(1.08)}100%{opacity:1;transform:rotate(0) scale(1)}}@keyframes casinoPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}`}</style>
    </div>
  );
}

// ============================================
// MARKET CRASH — red flash + numbers crashing
// ============================================
export function MarketCrashAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"flash"|"crash"|"hold"|"exit">("flash");
  const [value, setValue] = useState(500);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("crash"), 300);
    const t2 = setTimeout(() => setPhase("hold"),  1000);
    const t3 = setTimeout(() => setPhase("exit"),  3400);
    const t4 = setTimeout(() => onDone(),          4100);
    let v = 500;
    const vi = setInterval(() => { v -= Math.floor(Math.random()*30+10); if(v<50){v=50;clearInterval(vi);} setValue(v); }, 60);
    return () => { clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);clearTimeout(t4);clearInterval(vi); };
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[999] pointer-events-auto overflow-hidden flex items-center justify-center"
      onClick={() => onDone()}
      style={{cursor:"pointer", opacity:phase==="exit"?0:1, transition:phase==="exit"?"opacity 0.7s ease-in":"opacity 0.3s",
        background:"#000", animation:phase==="crash"?"mcShock 0.5s ease-out":"none" }}>
      <SkipHint />
      {phase==="flash" && <div className="absolute inset-0" style={{background:"rgba(255,0,0,0.5)",animation:"mcFlash 0.4s ease-out forwards"}} />}
      <div className="absolute inset-0" style={{background:phase==="hold"?"radial-gradient(ellipse at center,rgba(80,0,0,0.65) 0%,rgba(0,0,0,0.97) 65%)":"rgba(0,0,0,0.9)",transition:"background 0.5s"}} />
      {/* Falling red numbers */}
      {phase==="hold" && (
        <div className="absolute inset-0 overflow-hidden">
          {["📉","↘","📉","↓","📉","↘","↓"].map((s,i)=>(
            <span key={i} style={{position:"absolute",left:`${(i*14.5)%93}%`,top:"-20px",
              fontSize:`${16+(i%3)*8}px`,color:`rgba(255,50,50,${0.6+i*0.05})`,
              animation:`mcDrop ${1+i*0.12}s linear ${i*0.08}s infinite`}}>{s}</span>
          ))}
        </div>
      )}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <img src="/images/market-crash-pixel.png" alt="Market Crash"
          style={{ width:"clamp(200px,34vw,280px)", imageRendering:"pixelated", objectFit:"contain",
            animation: phase==="crash" ? "mcFall 0.7s cubic-bezier(0.22,1,0.36,1) forwards"
              : phase==="hold" ? "mcTremor 0.4s ease-in-out 3" : "none",
            filter:phase==="hold"?"drop-shadow(0 0 24px rgba(255,0,0,0.8))":"none",
          }}
        />
        {phase==="hold" && (
          <div style={{textAlign:"center"}}>
            <div className="px-9 py-5" style={{background:"rgba(8,0,0,0.97)",border:"1px solid rgba(255,0,0,0.7)",boxShadow:"0 0 40px rgba(200,0,0,0.3)"}}>
              <div className="text-[9px] tracking-[0.5em] uppercase mb-2" style={{color:"rgba(255,80,80,0.6)"}}>Disaster</div>
              <div className="font-black text-2xl tracking-widest uppercase" style={{color:"#ff2222",textShadow:"0 0 25px rgba(255,0,0,0.9)"}}>Market Crash</div>
              <div className="font-black text-xl mt-1" style={{color:"#ff4444"}}>€{value}M ↓</div>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes mcFlash{0%{opacity:0.6}100%{opacity:0}}@keyframes mcFall{0%{opacity:0;transform:translateY(-60px) scale(0.7)}60%{opacity:1;transform:translateY(5px) scale(1.04)}100%{opacity:1;transform:translateY(0) scale(1)}}@keyframes mcTremor{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}@keyframes mcDrop{0%{transform:translateY(0)}100%{transform:translateY(110vh);opacity:0}}@keyframes mcShock{0%,100%{transform:translate(0)}20%{transform:translate(-8px,4px)}40%{transform:translate(8px,-4px)}60%{transform:translate(-4px,2px)}80%{transform:translate(4px,-2px)}}`}</style>
    </div>
  );
}

// ============================================
// FAILED TRANSFER — deal papers torn apart
// ============================================
export function FailedTransferAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter"|"tear"|"hold"|"exit">("enter");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("tear"),  500);
    const t2 = setTimeout(() => setPhase("hold"),  1100);
    const t3 = setTimeout(() => setPhase("exit"),  3400);
    const t4 = setTimeout(() => onDone(),          4100);
    return () => { clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);clearTimeout(t4); };
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[999] pointer-events-auto overflow-hidden flex items-center justify-center"
      onClick={() => onDone()}
      style={{cursor:"pointer", opacity:phase==="exit"?0:1, transition:phase==="exit"?"opacity 0.7s ease-in":"opacity 0.3s",
        background:"radial-gradient(ellipse at center,rgba(50,0,50,0.6) 0%,#000 70%)" }}>
      <SkipHint />
      {/* Torn paper pieces */}
      {phase==="tear" && [...Array(8)].map((_,i)=>(
        <div key={i} className="absolute" style={{
          width:`${20+(i%3)*15}px`,height:`${15+(i%4)*12}px`,
          background:"rgba(200,180,200,0.9)",
          left:`${30+(i*5)}%`,top:"40%",
          animation:`ftTear 0.6s ease-out ${i*0.03}s forwards`,
          borderRadius:"1px",
          transform:`rotate(${(i-4)*15}deg)`,
        }} />
      ))}
      {/* X marks */}
      {phase==="hold" && (
        <div className="absolute" style={{top:"15%",left:"50%",transform:"translateX(-50%)",
          fontSize:"clamp(30px,6vw,50px)",animation:"ftX 0.8s ease-out forwards"}}>❌</div>
      )}
      <div className="relative z-10 flex flex-col items-center gap-4" style={{animation:phase==="tear"?"ftShake 0.4s ease-out":"none"}}>
        <img src="/images/failed-transfer-pixel.png" alt="Failed Transfer"
          style={{ width:"clamp(180px,28vw,240px)", imageRendering:"pixelated", objectFit:"contain",
            animation: phase==="enter" ? "ftSlide 0.9s cubic-bezier(0.22,1,0.36,1) forwards"
              : phase==="hold" ? "ftSad 2.5s ease-in-out infinite" : "none",
            filter:phase==="hold"?"drop-shadow(0 0 20px rgba(180,0,180,0.7)) grayscale(0.2)":"none",
          }}
        />
        {phase==="hold" && (
          <div style={{textAlign:"center"}}>
            <div className="px-9 py-5" style={{background:"rgba(8,0,8,0.97)",border:"1px solid rgba(180,0,180,0.6)",boxShadow:"0 0 40px rgba(150,0,150,0.25)"}}>
              <div className="text-[9px] tracking-[0.5em] uppercase mb-2" style={{color:"rgba(200,0,200,0.6)"}}>Deal Collapsed</div>
              <div className="font-black text-2xl tracking-widest uppercase" style={{color:"#cc00cc",textShadow:"0 0 25px rgba(180,0,180,0.9)"}}>Failed Transfer</div>
              <div className="text-xs tracking-[0.2em] uppercase mt-1.5" style={{color:"rgba(255,255,255,0.25)"}}>Negotiations broke down</div>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes ftSlide{0%{opacity:0;transform:translateX(100px) scale(0.7)}60%{opacity:1;transform:translateX(-5px) scale(1.04)}100%{opacity:1;transform:translateX(0) scale(1)}}@keyframes ftSad{0%,100%{transform:translateY(0)}50%{transform:translateY(6px)}}@keyframes ftTear{0%{opacity:1;transform:translate(0) rotate(var(--r))}100%{opacity:0;transform:translate(calc((var(--i)-4)*40px),-60px) rotate(calc(var(--r)*3)) scale(0.3)}}@keyframes ftShake{0%,100%{transform:translate(0)}25%{transform:translate(-8px,3px)}75%{transform:translate(8px,-3px)}}@keyframes ftX{0%{opacity:0;transform:translateX(-50%) scale(3)}100%{opacity:1;transform:translateX(-50%) scale(1)}}`}</style>
    </div>
  );
}

// ============================================
// BENCH WARMER — cold fog + sitting animation
// ============================================
export function BenchWarmerAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter"|"hold"|"exit">("enter");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"),  900);
    const t2 = setTimeout(() => setPhase("exit"),  3400);
    const t3 = setTimeout(() => onDone(),          4100);
    return () => { clearTimeout(t1);clearTimeout(t2);clearTimeout(t3); };
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[999] pointer-events-auto overflow-hidden flex items-center justify-center"
      onClick={() => onDone()}
      style={{cursor:"pointer", opacity:phase==="exit"?0:1, transition:phase==="exit"?"opacity 0.8s ease-in":"opacity 0.4s",
        background:"radial-gradient(ellipse at center,rgba(0,10,40,0.7) 0%,#000 70%)" }}>
      <SkipHint />
      {/* Fog/mist at bottom */}
      {phase==="hold" && (
        <div className="absolute bottom-0 left-0 right-0" style={{height:"30%",
          background:"linear-gradient(0deg,rgba(100,150,255,0.08) 0%,transparent 100%)",
          animation:"bwFog 3s ease-in-out infinite alternate"}} />
      )}
      {/* Ice crystals */}
      {phase==="hold" && [...Array(8)].map((_,i)=>(
        <div key={i} className="absolute" style={{
          width:`${3+(i%3)*2}px`,height:`${3+(i%3)*2}px`,
          left:`${(i*12.8)%92}%`,top:`${10+(i*8)%60}%`,
          background:"rgba(150,200,255,0.6)",borderRadius:"50%",
          boxShadow:"0 0 4px rgba(150,200,255,0.8)",
          animation:`bwIce ${2+i*0.3}s ease-in-out ${i*0.2}s infinite alternate`,
        }} />
      ))}
      {/* Sleep Z's */}
      {phase==="hold" && ["💤","😴","💤","Zzz"].map((s,i)=>(
        <span key={i} style={{position:"absolute",left:`${10+(i*20)}%`,bottom:`${30+(i%3)*10}%`,
          fontSize:`${14+(i%3)*8}px`,color:`rgba(150,180,255,${0.3+i*0.1})`,
          animation:`bwZzz ${2+i*0.4}s ease-in-out ${i*0.3}s infinite alternate`}}>{s}</span>
      ))}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <img src="/images/bench-warmer-pixel.png" alt="Bench Warmer"
          style={{ width:"clamp(220px,36vw,300px)", imageRendering:"pixelated", objectFit:"contain",
            animation: phase==="enter" ? "bwSettle 1s cubic-bezier(0.22,1,0.36,1) forwards"
              : phase==="hold" ? "bwDroop 3s ease-in-out infinite" : "none",
            filter:phase==="hold"?"drop-shadow(0 0 20px rgba(80,120,255,0.5)) drop-shadow(0 0 40px rgba(50,100,200,0.25)) grayscale(0.2)":"none",
          }}
        />
        {phase==="hold" && (
          <div style={{textAlign:"center"}}>
            <div className="px-9 py-5" style={{background:"rgba(0,2,10,0.97)",border:"1px solid rgba(80,120,255,0.5)",boxShadow:"0 0 40px rgba(60,100,200,0.2)"}}>
              <div className="text-[9px] tracking-[0.5em] uppercase mb-2" style={{color:"rgba(100,140,255,0.6)"}}>Sidelined</div>
              <div className="font-black text-2xl tracking-widest uppercase" style={{color:"#5080ff",textShadow:"0 0 25px rgba(60,100,255,0.8)"}}>Bench Warmer</div>
              <div className="text-xs tracking-[0.2em] uppercase mt-1.5" style={{color:"rgba(255,255,255,0.25)"}}>Not seeing any game time</div>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes bwSettle{0%{opacity:0;transform:translateY(-30px) scale(0.85)}60%{opacity:1;transform:translateY(5px) scale(1.03)}100%{opacity:1;transform:translateY(0) scale(1)}}@keyframes bwDroop{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(6px) rotate(-1deg)}}@keyframes bwFog{0%{opacity:0.5}100%{opacity:1}}@keyframes bwIce{0%{transform:scale(0.5);opacity:0.3}100%{transform:scale(1.5);opacity:1}}@keyframes bwZzz{0%{transform:translateY(0);opacity:0.3}100%{transform:translateY(-20px);opacity:0.8}}`}</style>
    </div>
  );
}

// ============================================
// BREAKUP SEASON — screen splits apart
// ============================================
export function BreakupSeasonAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter"|"split"|"hold"|"exit">("enter");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("split"), 400);
    const t2 = setTimeout(() => setPhase("hold"),  1000);
    const t3 = setTimeout(() => setPhase("exit"),  3500);
    const t4 = setTimeout(() => onDone(),          4200);
    return () => { clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);clearTimeout(t4); };
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[999] pointer-events-auto overflow-hidden flex items-center justify-center"
      onClick={() => onDone()}
      style={{cursor:"pointer", opacity:phase==="exit"?0:1, transition:phase==="exit"?"opacity 0.7s ease-in":"opacity 0.3s",
        background:"radial-gradient(ellipse at center,rgba(60,0,30,0.65) 0%,#000 70%)" }}>
      <SkipHint />
      {/* Split screen effect */}
      {(phase==="split") && (
        <>
          <div className="absolute left-0 top-0 bottom-0" style={{width:"50%",background:"rgba(0,0,0,0.8)",animation:"bsSplitL 0.5s ease-out forwards"}} />
          <div className="absolute right-0 top-0 bottom-0" style={{width:"50%",background:"rgba(0,0,0,0.8)",animation:"bsSplitR 0.5s ease-out forwards"}} />
        </>
      )}
      {/* Broken hearts */}
      {phase==="hold" && [...Array(8)].map((_,i)=>(
        <span key={i} style={{position:"absolute",left:`${(i*12.5)%93}%`,top:"-20px",
          fontSize:`${14+(i%3)*8}px`,
          animation:`bsHeart ${1.3+i*0.13}s linear ${i*0.09}s infinite`}}>💔</span>
      ))}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <img src="/images/breakup-season-pixel.png" alt="Breakup Season"
          style={{ width:"clamp(230px,38vw,320px)", imageRendering:"pixelated", objectFit:"contain",
            animation: phase==="enter" ? "bsEnter 0.4s ease-out forwards"
              : phase==="split" ? "bsSplat 0.5s ease-out forwards"
              : phase==="hold" ? "bsSad 3s ease-in-out infinite" : "none",
            filter:phase==="hold"?"drop-shadow(0 0 20px rgba(200,0,80,0.6)) saturate(0.8)":"none",
          }}
        />
        {phase==="hold" && (
          <div style={{textAlign:"center"}}>
            <div className="px-8 py-5" style={{background:"rgba(10,0,5,0.97)",border:"1px solid rgba(200,0,80,0.6)",boxShadow:"0 0 40px rgba(160,0,60,0.25)"}}>
              <div className="text-[9px] tracking-[0.5em] uppercase mb-2" style={{color:"rgba(220,0,90,0.6)"}}>Personal Life</div>
              <div className="font-black text-2xl tracking-widest uppercase" style={{color:"#cc0050",textShadow:"0 0 25px rgba(200,0,80,0.9)"}}>Breakup Season</div>
              <div className="text-xs tracking-[0.2em] uppercase mt-1.5" style={{color:"rgba(255,255,255,0.25)"}}>Off-pitch troubles affecting performance</div>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes bsEnter{0%{opacity:0;transform:scale(0.6)}100%{opacity:1;transform:scale(1)}}@keyframes bsSplat{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}@keyframes bsSad{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(5px) rotate(-0.5deg)}}@keyframes bsHeart{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(110vh) rotate(180deg);opacity:0}}@keyframes bsSplitL{0%{transform:translateX(0)}100%{transform:translateX(-100%)}}@keyframes bsSplitR{0%{transform:translateX(0)}100%{transform:translateX(100%)}}`}</style>
    </div>
  );
}

// ============================================
// FREE TRANSFER — player walks off into fog
// ============================================
export function FreeTransferAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter"|"hold"|"walkoff"|"exit">("enter");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"),    700);
    const t2 = setTimeout(() => setPhase("walkoff"), 2800);
    const t3 = setTimeout(() => setPhase("exit"),    3600);
    const t4 = setTimeout(() => onDone(),            4300);
    return () => { clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);clearTimeout(t4); };
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[999] pointer-events-auto overflow-hidden flex items-center justify-center"
      onClick={() => onDone()}
      style={{cursor:"pointer", opacity:phase==="exit"?0:1, transition:phase==="exit"?"opacity 0.8s ease-in":"opacity 0.4s",
        background:"radial-gradient(ellipse at 30% 50%,rgba(15,15,30,0.7) 0%,#000 70%)" }}>
      <SkipHint />
      {/* Fog layers */}
      {phase==="hold" && (
        <>
          <div className="absolute bottom-0 left-0 right-0" style={{height:"40%",background:"linear-gradient(0deg,rgba(80,80,120,0.12) 0%,transparent 100%)",animation:"ftFog 4s ease-in-out infinite alternate"}} />
          <div className="absolute bottom-0 right-0" style={{width:"50%",height:"60%",background:"radial-gradient(ellipse at 80% 100%,rgba(100,100,150,0.1) 0%,transparent 70%)",animation:"ftFog2 3s ease-in-out infinite alternate"}} />
        </>
      )}
      {/* Footstep dots trail */}
      {phase==="hold" && [...Array(6)].map((_,i)=>(
        <div key={i} className="absolute rounded-full" style={{
          width:"6px",height:"6px",
          left:`${15+i*9}%`,bottom:"25%",
          background:`rgba(120,140,200,${0.5-i*0.07})`,
          animation:`ftDot ${1.5+i*0.2}s ease-in-out ${i*0.15}s infinite`,
        }} />
      ))}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <img src="/images/free-transfer-pixel.png" alt="Free Transfer"
          style={{ width:"clamp(190px,30vw,260px)", imageRendering:"pixelated", objectFit:"contain",
            animation: phase==="enter" ? "ftIn 0.7s cubic-bezier(0.22,1,0.36,1) forwards"
              : phase==="hold" ? "ftWait 2s ease-in-out infinite"
              : phase==="walkoff" ? "ftWalk 0.8s ease-in forwards" : "none",
            filter:phase==="hold"?"drop-shadow(0 0 16px rgba(120,140,200,0.5)) grayscale(0.3)":"none",
            transition:"filter 0.5s",
          }}
        />
        {(phase==="hold") && (
          <div style={{textAlign:"center"}}>
            <div className="px-8 py-5" style={{background:"rgba(3,3,8,0.97)",border:"1px solid rgba(100,120,200,0.5)",boxShadow:"0 0 30px rgba(80,100,180,0.2)"}}>
              <div className="text-[9px] tracking-[0.5em] uppercase mb-2" style={{color:"rgba(120,140,220,0.6)"}}>Contract Expired</div>
              <div className="font-black text-2xl tracking-widest uppercase" style={{color:"#7888cc",textShadow:"0 0 20px rgba(100,120,200,0.8)"}}>Free Transfer</div>
              <div className="text-xs tracking-[0.2em] uppercase mt-1.5" style={{color:"rgba(255,255,255,0.25)"}}>Player leaving for nothing</div>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes ftIn{0%{opacity:0;transform:translateX(-60px)}60%{opacity:1;transform:translateX(4px)}100%{opacity:1;transform:translateX(0)}}@keyframes ftWait{0%,100%{transform:translateX(0)}50%{transform:translateX(5px)}}@keyframes ftWalk{0%{opacity:1;transform:translateX(0)}100%{opacity:0;transform:translateX(150px)}}@keyframes ftFog{0%{opacity:0.5}100%{opacity:1}}@keyframes ftFog2{0%{transform:translateX(0)}100%{transform:translateX(-20px)}}@keyframes ftDot{0%,100%{transform:scale(1);opacity:0.5}50%{transform:scale(1.4);opacity:1}}`}</style>
    </div>
  );
}

// ============================================
// MAJOR INJURY — heartbeat flatline
// ============================================
export function MajorInjuryAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter"|"alarm"|"hold"|"exit">("enter");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("alarm"), 300);
    const t2 = setTimeout(() => setPhase("hold"),  900);
    const t3 = setTimeout(() => setPhase("exit"),  3400);
    const t4 = setTimeout(() => onDone(),          4100);
    return () => { clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);clearTimeout(t4); };
  }, [onDone]);
  const beats = [0,5,2,20,-15,8,0,3,1,20,-12,6,0,2,0,5,20,-14,7,0];
  const pts = beats.map((v,i)=>`${(i/(beats.length-1))*280},${35-(v/22)*28}`).join(" ");
  return (
    <div className="fixed inset-0 z-[999] pointer-events-auto overflow-hidden flex items-center justify-center"
      onClick={() => onDone()}
      style={{cursor:"pointer", opacity:phase==="exit"?0:1, transition:phase==="exit"?"opacity 0.7s ease-in":"opacity 0.3s",
        background:"#000", animation:phase==="alarm"?"miAlarm 0.3s steps(2) 3":"none" }}>
      <SkipHint />
      <div className="absolute inset-0" style={{background:phase==="hold"?"radial-gradient(ellipse at center,rgba(70,0,0,0.7) 0%,rgba(0,0,0,0.97) 65%)":"rgba(0,0,0,0.9)",transition:"background 0.6s"}} />
      {/* Heartbeat monitor */}
      {(phase==="alarm"||phase==="hold") && (
        <div className="absolute top-8 left-0 right-0 flex justify-center" style={{zIndex:3}}>
          <div style={{background:"rgba(0,0,0,0.95)",border:"1px solid rgba(255,0,0,0.6)",padding:"8px 16px",minWidth:"320px"}}>
            <div className="text-[9px] tracking-widest uppercase mb-1" style={{color:"rgba(255,0,0,0.7)",animation:"miRedBlink 0.5s steps(1) infinite"}}>
              ⚠️ CRITICAL INJURY ALERT
            </div>
            <svg width="280" height="50" style={{display:"block"}}>
              <polyline points={pts} fill="none" stroke="#ff2200" strokeWidth="2.5"
                style={{filter:"drop-shadow(0 0 5px #ff2200)",animation:phase==="alarm"?"miBeat 0.5s ease-in-out 3":"none"}} />
            </svg>
          </div>
        </div>
      )}
      <div className="relative z-10 flex flex-col items-center gap-4 mt-16">
        <img src="/images/major-injury-pixel.png" alt="Major Injury"
          style={{ width:"clamp(230px,38vw,320px)", imageRendering:"pixelated", objectFit:"contain",
            animation: phase==="enter" ? "miEnter 0.9s cubic-bezier(0.22,1,0.36,1) forwards"
              : phase==="alarm" ? "miShake 0.3s ease-in-out 3"
              : phase==="hold" ? "miBreath 3s ease-in-out infinite" : "none",
            filter:phase==="hold"?"drop-shadow(0 0 24px rgba(255,0,0,0.7)) drop-shadow(0 0 50px rgba(200,0,0,0.3))":"none",
          }}
        />
        {phase==="hold" && (
          <div style={{textAlign:"center"}}>
            <div className="px-9 py-5" style={{background:"rgba(8,0,0,0.97)",border:"1px solid rgba(255,0,0,0.7)",boxShadow:"0 0 50px rgba(200,0,0,0.35)"}}>
              <div className="text-[9px] tracking-[0.5em] uppercase mb-2" style={{color:"rgba(255,80,80,0.6)"}}>Emergency</div>
              <div className="font-black text-2xl tracking-widest uppercase" style={{color:"#ff2222",textShadow:"0 0 25px rgba(255,0,0,0.9)"}}>Major Injury</div>
              <div className="text-xs tracking-[0.2em] uppercase mt-1.5" style={{color:"rgba(255,255,255,0.25)"}}>Long-term absence expected</div>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes miEnter{0%{opacity:0;transform:translateY(50px) scale(0.7)}60%{opacity:1;transform:translateY(-5px) scale(1.04)}100%{opacity:1;transform:translateY(0) scale(1)}}@keyframes miShake{0%,100%{transform:translateX(0)}33%{transform:translateX(-8px)}66%{transform:translateX(8px)}}@keyframes miBreath{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}@keyframes miAlarm{0%,100%{background:#000}50%{background:rgba(150,0,0,0.3)}}@keyframes miRedBlink{0%,100%{opacity:1}50%{opacity:0}}@keyframes miBeat{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.3)}}`}</style>
    </div>
  );
}

export function YousefCardAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"black"|"glitch"|"reveal"|"hold"|"exit">("black");
  const [glitchText, setGlitchText] = useState("LOADING...");

  useEffect(() => {
    const glitchTexts = ["7GE", "???", "7GE", "LEGEND", "7GE", "DEV", "7GE"];
    let gi = 0;
    const glitchInt = setInterval(() => {
      setGlitchText(glitchTexts[gi % glitchTexts.length]);
      gi++;
    }, 120);

    const t1 = setTimeout(() => { clearInterval(glitchInt); setPhase("glitch"); }, 300);
    const t2 = setTimeout(() => setPhase("reveal"),  1200);
    const t3 = setTimeout(() => setPhase("hold"),    2400);
    const t4 = setTimeout(() => setPhase("exit"),    6000);
    const t5 = setTimeout(() => onDone(),            6700);
    return () => {
      clearInterval(glitchInt);
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5);
    };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden pointer-events-auto"
      onClick={() => onDone()}
      style={{cursor:"pointer",
        opacity: phase === "exit" ? 0 : 1,
        transition: phase === "exit" ? "opacity 0.7s ease-in" : "none",
        background: "#000",
      }}
    >

      {/* ── BIG 7GE BACKGROUND TEXT ── */}
      <div
        className="absolute inset-0 flex items-center justify-center select-none"
        style={{ zIndex: 0 }}
      >
        <span
          className="font-black"
          style={{
            fontSize: "clamp(200px, 40vw, 380px)",
            color: "transparent",
            WebkitTextStroke: phase === "hold"
              ? "1px rgba(212,175,55,0.12)"
              : "1px rgba(212,175,55,0.04)",
            letterSpacing: "0.05em",
            transition: "WebkitTextStroke 1s ease",
            animation: phase === "hold" ? "bgTextPulse 4s ease-in-out infinite" : "none",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          7GE
        </span>
      </div>

      {/* ── SCAN LINES ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
          zIndex: 1,
        }}
      />

      {/* ── GLITCH PHASE ── */}
      {(phase === "glitch") && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 3 }}
        >
          <span
            className="font-black tracking-widest"
            style={{
              fontSize: "clamp(60px, 12vw, 120px)",
              color: "#D4AF37",
              textShadow: "4px 0 #ff0000, -4px 0 #0000ff, 0 0 30px rgba(212,175,55,0.9)",
              animation: "glitchMove 0.15s steps(1) infinite",
            }}
          >
            {glitchText}
          </span>
        </div>
      )}

      {/* ── GOLD BEAMS ── */}
      {(phase === "reveal" || phase === "hold") && (
        <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 2 }}>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                width: "1px",
                height: "100vh",
                top: 0,
                left: `${5 + i * 8}%`,
                background: `linear-gradient(180deg,
                  transparent 0%,
                  rgba(212,175,55,${0.06 + (i % 3) * 0.04}) 30%,
                  rgba(212,175,55,${0.1 + (i % 3) * 0.05}) 50%,
                  rgba(212,175,55,${0.06 + (i % 3) * 0.04}) 70%,
                  transparent 100%)`,
                animation: `beamWave ${3 + i * 0.4}s ease-in-out ${i * 0.15}s infinite alternate`,
                transformOrigin: "center center",
              }}
            />
          ))}
        </div>
      )}

      {/* ── FLOATING 7GE PARTICLES ── */}
      {phase === "hold" && (
        <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 2 }}>
          {["7","G","E","7","G","E","7","G","E","7"].map((char, i) => (
            <span
              key={i}
              className="absolute font-black"
              style={{
                left: `${(i * 10.5) % 90}%`,
                bottom: `${(i * 7) % 30}%`,
                fontSize: `${10 + (i % 4) * 6}px`,
                color: `rgba(212,175,55,${0.15 + (i % 3) * 0.1})`,
                animation: `charFloat ${3 + i * 0.35}s ease-in-out ${i * 0.2}s infinite alternate`,
              }}
            >
              {char}
            </span>
          ))}
        </div>
      )}

      {/* ── GOLD PARTICLES RISE ── */}
      {(phase === "reveal" || phase === "hold") && (
        <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 2 }}>
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${2 + (i % 3)}px`,
                height: `${2 + (i % 3)}px`,
                left: `${(i * 6.3) % 94}%`,
                bottom: "5%",
                background: "#D4AF37",
                boxShadow: "0 0 4px rgba(212,175,55,0.8)",
                animation: `particleRise ${2 + i * 0.2}s ease-out ${i * 0.1}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* ── RINGS ── */}
      {phase === "hold" && (
        <>
          {[280, 380, 480].map((size, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                border: `1px solid rgba(212,175,55,${0.25 - i * 0.06})`,
                animation: `ringRotate ${8 + i * 4}s linear infinite ${i % 2 === 0 ? "" : "reverse"}`,
                zIndex: 2,
              }}
            />
          ))}
        </>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="relative flex flex-col items-center gap-5" style={{ zIndex: 10 }}>

        <SkipHint />

        {/* Portrait */}
        <div
          style={{
            opacity: phase === "black" || phase === "glitch" ? 0 : 1,
            animation: phase === "reveal"
              ? "portraitReveal 1.2s cubic-bezier(0.22,1,0.36,1) forwards"
              : phase === "hold"
              ? "portraitFloat 3.5s ease-in-out infinite"
              : "none",
            transition: "opacity 0.4s ease",
          }}
        >
          <img
            src="/images/yousef-pixel.png"
            alt="Yousef"
            style={{
              width: "clamp(130px, 18vw, 180px)",
              height: "auto",
              imageRendering: "pixelated",
              objectFit: "contain",
              filter: phase === "hold"
                ? "drop-shadow(0 0 20px rgba(212,175,55,1)) drop-shadow(0 0 40px rgba(212,175,55,0.6)) drop-shadow(0 0 80px rgba(212,175,55,0.3))"
                : "drop-shadow(0 0 8px rgba(212,175,55,0.4))",
              transition: "filter 0.6s ease",
            }}
          />
        </div>

        {/* Badge */}
        <div
          style={{
            opacity: phase === "hold" ? 1 : 0,
            transform: phase === "hold" ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)",
            transition: "all 0.7s cubic-bezier(0.22,1,0.36,1) 0.2s",
            textAlign: "center",
          }}
        >
          <div
            className="px-10 py-6"
            style={{
              background: "linear-gradient(135deg, rgba(5,3,0,0.97), rgba(15,10,0,0.97))",
              border: "1px solid rgba(212,175,55,0.7)",
              boxShadow: "0 0 60px rgba(212,175,55,0.25), 0 0 120px rgba(212,175,55,0.08), inset 0 0 40px rgba(212,175,55,0.04)",
            }}
          >
            {/* Top line */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5))" }} />
              <span className="text-[9px] tracking-[0.5em] uppercase" style={{ color: "rgba(212,175,55,0.5)" }}>Creator</span>
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(212,175,55,0.5), transparent)" }} />
            </div>

            {/* Name */}
            <div
              className="font-black uppercase tracking-widest mb-1"
              style={{
                fontSize: "clamp(1.3rem, 3vw, 2rem)",
                color: "#D4AF37",
                textShadow: "0 0 30px rgba(212,175,55,1), 0 0 60px rgba(212,175,55,0.5)",
              }}
            >
              Yousef Alnuwasser
            </div>

            {/* Tag */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <span
                className="font-black text-sm px-3 py-1 tracking-widest"
                style={{
                  background: "rgba(212,175,55,0.12)",
                  border: "1px solid rgba(212,175,55,0.4)",
                  color: "#D4AF37",
                }}
              >
                7GE
              </span>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
              <span className="text-xs tracking-[0.25em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
                Independent Developer
              </span>
            </div>

            {/* Message */}
            <div
              className="text-xs leading-relaxed px-2 py-3 text-center"
              style={{
                color: "rgba(255,255,255,0.4)",
                borderTop: "1px solid rgba(212,175,55,0.1)",
                borderBottom: "1px solid rgba(212,175,55,0.1)",
              }}
            >
              شطور اشتريت المطور نفسه
              <span className="mx-2" style={{ color: "rgba(212,175,55,0.3)" }}>·</span>
              لاتنسى تدعم المشروع 😏
            </div>

            {/* Bottom line */}
            <div className="flex items-center gap-3 mt-4">
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.3))" }} />
              <span className="text-base">⭐</span>
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(212,175,55,0.3), transparent)" }} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bgTextPulse {
          0%, 100% { opacity: 0.7; }
          50%       { opacity: 1; }
        }
        @keyframes glitchMove {
          0%   { transform: translate(0,0) skewX(0deg); }
          20%  { transform: translate(-4px,2px) skewX(-3deg); }
          40%  { transform: translate(4px,-2px) skewX(3deg); }
          60%  { transform: translate(-2px,4px) skewX(-1deg); }
          80%  { transform: translate(2px,-4px) skewX(2deg); }
          100% { transform: translate(0,0) skewX(0deg); }
        }
        @keyframes beamWave {
          0%   { transform: scaleY(0.8) translateY(-10%); opacity: 0.4; }
          100% { transform: scaleY(1.2) translateY(10%);  opacity: 1; }
        }
        @keyframes charFloat {
          0%   { transform: translateY(0) rotate(0deg); opacity: 0.15; }
          100% { transform: translateY(-40px) rotate(10deg); opacity: 0.35; }
        }
        @keyframes particleRise {
          0%   { transform: translateY(0) scale(1);    opacity: 0.8; }
          100% { transform: translateY(-90vh) scale(0.3); opacity: 0; }
        }
        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes portraitReveal {
          0%   { opacity: 0; transform: scale(0.2) translateY(30px); filter: brightness(5) blur(8px); }
          50%  { opacity: 1; transform: scale(1.1) translateY(-6px); filter: brightness(1.5) blur(0); }
          75%  { transform: scale(0.97) translateY(2px); filter: brightness(1); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: brightness(1); }
        }
        @keyframes portraitFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          40%       { transform: translateY(-14px) scale(1.03); }
          70%       { transform: translateY(-5px) scale(1.01); }
        }
      `}</style>
    </div>
  );
}

// ============================================
// أضف أنيميشنات جديدة هنا
// ============================================

// ============================================
// ERIKSEN HEART ATTACK
// ============================================
// ============================================
// ERIKSEN HEART ATTACK
// Concept: ECG flatline — screen goes white then red crash
// ============================================
export function EriksenAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"black"|"flash"|"crash"|"hold"|"exit">("black");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("flash"),  200);
    const t2 = setTimeout(() => setPhase("crash"),  700);
    const t3 = setTimeout(() => setPhase("hold"),   1400);
    const t4 = setTimeout(() => setPhase("exit"),   4500);
    const t5 = setTimeout(() => onDone(),           5200);
    return () => { clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);clearTimeout(t4);clearTimeout(t5); };
  }, [onDone]);

  // ECG values — normal then flatline
  const ecgNormal = [0,5,2,8,30,-20,10,2,0,3,1,0,4,2,0,6,25,-18,8,0];
  const ecgFlat   = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  const ecg = phase === "hold" ? ecgFlat : ecgNormal;
  const maxV = 35;
  const pts = ecg.map((v,i) => `${(i/(ecg.length-1))*260},${40 - (v/maxV)*35}`).join(" ");

  return (
    <div className="fixed inset-0 z-[999] pointer-events-auto overflow-hidden"
      onClick={() => onDone()}
      style={{cursor:"pointer",
        background: phase==="flash" ? "#ffffff"
          : phase==="crash" ? "#cc0000"
          : phase==="hold" || phase==="exit" ? "#000" : "#000",
        transition: phase==="flash" ? "background 0.2s" : phase==="crash" ? "background 0.5s" : "background 0.8s ease",
        opacity: phase==="exit" ? 0 : 1,
      }}>

      <SkipHint />

      {/* Screen shake on crash */}
      <div className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ animation: phase==="crash" ? "ekgScreenShake 0.5s ease-out" : "none" }}>

        {/* Dark overlay after crash */}
        {(phase==="hold" || phase==="exit") && (
          <div className="absolute inset-0" style={{ background:"radial-gradient(ellipse at center, rgba(60,0,0,0.7) 0%, rgba(0,0,0,0.98) 70%)" }} />
        )}

        {/* ECG monitor frame */}
        {(phase==="crash" || phase==="hold") && (
          <div className="absolute top-8 left-0 right-0 flex justify-center" style={{ zIndex:3 }}>
            <div style={{ background:"rgba(0,0,0,0.9)", border:`1px solid ${phase==="hold"?"rgba(255,0,0,0.5)":"rgba(0,255,80,0.5)"}`, padding:"8px 16px", minWidth:"300px" }}>
              <div className="text-[9px] tracking-widest uppercase mb-1" style={{ color: phase==="hold" ? "#ff4444" : "#00ff50" }}>
                {phase==="hold" ? "⚠️ CARDIAC ARREST — FLATLINE" : "ECG MONITOR"}
              </div>
              <svg width="260" height="50" style={{ display:"block" }}>
                <polyline points={pts} fill="none"
                  stroke={phase==="hold" ? "#ff2222" : "#00ff50"}
                  strokeWidth="2"
                  style={{ filter: `drop-shadow(0 0 4px ${phase==="hold" ? "#ff2222" : "#00ff50"})` }}
                />
                {phase==="hold" && (
                  <circle cx="260" cy="40" r="3" fill="#ff2222"
                    style={{ animation:"ekgDot 0.8s ease-in-out infinite" }} />
                )}
              </svg>
            </div>
          </div>
        )}

        {/* Portrait */}
        <div className="relative z-10 flex flex-col items-center gap-5 mt-16">
          <img src="/images/eriksen-pixel.png" alt="Heart Attack"
            style={{
              width:"clamp(160px,26vw,220px)", imageRendering:"pixelated", objectFit:"contain",
              animation: phase==="crash" ? "ekgFall 0.7s cubic-bezier(0.22,1,0.36,1) forwards"
                : phase==="hold" ? "ekgLieDown 3s ease-in-out infinite" : "none",
              filter: phase==="hold" ? "grayscale(0.6) drop-shadow(0 0 20px rgba(255,0,0,0.6))"
                : phase==="crash" ? "brightness(2)" : "none",
              transition:"filter 0.5s ease",
              transform: phase==="hold" ? "rotate(90deg) translateX(20px)" : "none",
            }}
          />
          {phase==="hold" && (
            <div style={{ textAlign:"center", opacity:1 }}>
              <div className="px-10 py-5" style={{ background:"rgba(5,0,0,0.97)", border:"1px solid rgba(255,0,0,0.8)", boxShadow:"0 0 50px rgba(255,0,0,0.4), inset 0 0 30px rgba(255,0,0,0.05)" }}>
                <div className="text-[9px] tracking-[0.5em] uppercase mb-2" style={{ color:"rgba(255,100,100,0.6)" }}>CARDIAC ARREST</div>
                <div className="font-black text-3xl tracking-widest uppercase" style={{ color:"#ff1111", textShadow:"0 0 30px rgba(255,0,0,1), 0 0 60px rgba(255,0,0,0.5)" }}>Heart Attack</div>
                <div className="text-xs tracking-[0.2em] uppercase mt-2" style={{ color:"rgba(255,255,255,0.25)" }}>Player collapsed on the pitch</div>
                <div className="text-xs mt-1" style={{ color:"rgba(255,100,100,0.5)" }}>Value −65% · Out full season</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes ekgScreenShake{0%,100%{transform:translate(0)}15%{transform:translate(-12px,8px)}30%{transform:translate(12px,-8px)}45%{transform:translate(-8px,4px)}60%{transform:translate(8px,-4px)}75%{transform:translate(-4px,2px)}}
        @keyframes ekgFall{0%{opacity:0;transform:scale(0.5) translateY(-60px) rotate(0deg)}60%{opacity:1;transform:scale(1.05) translateY(6px) rotate(45deg)}100%{opacity:1;transform:rotate(90deg) translateX(20px)}}
        @keyframes ekgLieDown{0%,100%{transform:rotate(90deg) translateX(20px) scale(1)}50%{transform:rotate(90deg) translateX(20px) scale(1.02)}}
        @keyframes ekgDot{0%,100%{opacity:1}50%{opacity:0}}
      `}</style>
    </div>
  );
}

// ============================================
// DOPING BAN
// Concept: newspaper headlines flash + mugshot style
// ============================================
export function DopingBanAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter"|"flash"|"hold"|"exit">("enter");
  const [headline, setHeadline] = useState(0);
  const headlines = ["BANNED!", "DOPING!", "SCANDAL!", "SUSPENDED!", "BUSTED!"];
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("flash"), 300);
    const t2 = setTimeout(() => setPhase("hold"),  1200);
    const t3 = setTimeout(() => setPhase("exit"),  4200);
    const t4 = setTimeout(() => onDone(),          5000);
    const hi = setInterval(() => setHeadline(h => (h+1)%headlines.length), 200);
    setTimeout(() => clearInterval(hi), 1200);
    return () => { clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);clearTimeout(t4);clearInterval(hi); };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[999] pointer-events-auto overflow-hidden flex items-center justify-center"
      onClick={() => onDone()}
      style={{cursor:"pointer", opacity: phase==="exit"?0:1, transition:phase==="exit"?"opacity 0.8s":"none",
        background: phase==="flash" ? "#f5f0e0" : phase==="hold" ? "#0a0a0a" : "#000" }}>

      <SkipHint />

      {/* Newspaper flash */}
      {phase==="flash" && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex:5 }}>
          <div style={{ fontFamily:"serif", fontSize:"clamp(60px,12vw,100px)", fontWeight:900, color:"#1a1a1a",
            textAlign:"center", lineHeight:1, animation:"dopFlash 0.15s steps(1) infinite",
            textShadow:"4px 4px 0 rgba(0,0,0,0.2)" }}>
            {headlines[headline]}
          </div>
        </div>
      )}

      {phase==="hold" && (
        <>
          {/* Mugshot grid lines */}
          <div className="absolute inset-0" style={{ backgroundImage:"linear-gradient(rgba(0,80,150,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,80,150,0.04) 1px,transparent 1px)", backgroundSize:"30px 30px" }} />

          {/* Red BANNED stamp */}
          <div className="absolute" style={{ top:"12%", right:"8%", zIndex:5,
            border:"4px solid rgba(255,0,0,0.85)", padding:"6px 16px",
            transform:"rotate(-15deg)",
            color:"rgba(255,0,0,0.85)", fontWeight:900, fontSize:"clamp(20px,4vw,36px)",
            letterSpacing:"0.15em", animation:"dopStamp 0.4s cubic-bezier(0.22,1,0.36,1) forwards",
            textShadow:"0 0 10px rgba(255,0,0,0.5)" }}>
            BANNED
          </div>

          <div className="relative z-10 flex flex-col items-center gap-4">
            {/* Mugshot frame */}
            <div style={{ position:"relative", border:"3px solid #444", padding:"8px", background:"#111" }}>
              <img src="/images/doping-ban-pixel.png" alt="Doping Ban"
                style={{ width:"clamp(150px,24vw,200px)", imageRendering:"pixelated", objectFit:"contain",
                  filter:"grayscale(0.8) contrast(1.2)" }} />
              {/* Mugshot number bar */}
              <div style={{ background:"#222", borderTop:"1px solid #444", padding:"4px 8px",
                display:"flex", justifyContent:"space-between", marginTop:"4px" }}>
                {["0","0","7","4","2"].map((n,i) => (
                  <span key={i} style={{ color:"#888", fontSize:"14px", fontFamily:"monospace", fontWeight:700 }}>{n}</span>
                ))}
              </div>
            </div>

            <div style={{ textAlign:"center" }}>
              <div className="px-8 py-4" style={{ background:"rgba(0,5,15,0.98)", border:"1px solid rgba(0,100,255,0.5)", boxShadow:"0 0 40px rgba(0,80,200,0.2)" }}>
                <div className="text-[9px] tracking-[0.5em] uppercase mb-1" style={{ color:"rgba(80,120,255,0.6)" }}>WADA SUSPENSION</div>
                <div className="font-black text-2xl tracking-widest uppercase" style={{ color:"#4466ff", textShadow:"0 0 20px rgba(60,100,255,0.9)" }}>Doping Ban</div>
                <div className="text-xs tracking-[0.2em] uppercase mt-1.5" style={{ color:"rgba(255,255,255,0.25)" }}>Cannot sell or renew during suspension</div>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes dopFlash{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.7;transform:scale(1.05)}}
        @keyframes dopStamp{0%{transform:rotate(-15deg) scale(3);opacity:0}60%{transform:rotate(-15deg) scale(0.9);opacity:1}100%{transform:rotate(-15deg) scale(1);opacity:1}}
      `}</style>
    </div>
  );
}

// ============================================
// GIRLS MAGNET
// Concept: paparazzi camera flashes + spotlight
// ============================================
export function GirlsMagnetAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter"|"hold"|"exit">("enter");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"),  800);
    const t2 = setTimeout(() => setPhase("exit"),  4000);
    const t3 = setTimeout(() => onDone(),          4700);
    return () => { clearTimeout(t1);clearTimeout(t2);clearTimeout(t3); };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[999] pointer-events-auto overflow-hidden flex items-center justify-center"
      onClick={() => onDone()}
      style={{cursor:"pointer", opacity:phase==="exit"?0:1, transition:phase==="exit"?"opacity 0.8s ease-in":"opacity 0.3s",
        background:"#000" }}>

      <SkipHint />

      {/* Camera flashes */}
      {phase==="hold" && (
        <div className="absolute inset-0">
          {[...Array(8)].map((_,i) => (
            <div key={i} className="absolute inset-0" style={{
              background:"rgba(255,255,255,0.9)",
              animation:`gmFlash 2s steps(1) ${i*0.25}s infinite`,
              opacity:0,
            }} />
          ))}
        </div>
      )}

      {/* Spotlight beam from top */}
      {phase==="hold" && (
        <div className="absolute" style={{
          top:0, left:"50%", transform:"translateX(-50%)",
          width:"200px", height:"100vh",
          background:"linear-gradient(180deg, rgba(255,200,255,0.15) 0%, transparent 70%)",
          animation:"gmSpot 2s ease-in-out infinite alternate",
          clipPath:"polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
        }} />
      )}

      {/* Floating hearts */}
      {phase==="hold" && (
        <div className="absolute inset-0 overflow-hidden">
          {["💋","❤️","💕","💖","💗","💓"].map((em,i) => (
            <span key={i} style={{
              position:"absolute",
              left:`${15+(i*14)}%`, bottom:"-20px",
              fontSize:`${20+(i%3)*12}px`,
              animation:`gmHeart ${1.5+i*0.3}s ease-out ${i*0.15}s infinite`,
            }}>{em}</span>
          ))}
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-5"
        style={{ animation: phase==="enter" ? "gmReveal 0.8s cubic-bezier(0.22,1,0.36,1) forwards" : "none" }}>

        <img src="/images/girls-magnet-pixel.png" alt="Girls Magnet"
          style={{
            width:"clamp(160px,26vw,220px)", imageRendering:"pixelated", objectFit:"contain",
            animation: phase==="hold" ? "gmPose 3s ease-in-out infinite" : "none",
            filter: phase==="hold" ? "drop-shadow(0 0 30px rgba(255,150,200,0.9)) drop-shadow(0 0 60px rgba(255,80,180,0.4)) saturate(1.3)" : "none",
          }}
        />

        {phase==="hold" && (
          <div style={{ textAlign:"center" }}>
            <div className="px-10 py-5" style={{
              background:"linear-gradient(135deg,rgba(10,0,8,0.97),rgba(30,0,20,0.97))",
              border:"1px solid rgba(255,100,180,0.8)",
              boxShadow:"0 0 50px rgba(255,80,160,0.35), inset 0 0 30px rgba(255,80,160,0.05)" }}>
              <div className="text-[9px] tracking-[0.5em] uppercase mb-2" style={{ color:"rgba(255,150,200,0.6)" }}>CELEBRITY STATUS</div>
              <div className="font-black text-3xl tracking-widest uppercase" style={{ color:"#ff3080", textShadow:"0 0 30px rgba(255,60,140,1), 0 0 60px rgba(255,60,140,0.4)" }}>Girls Magnet</div>
              <div className="text-xs tracking-[0.2em] uppercase mt-2" style={{ color:"rgba(255,255,255,0.25)" }}>Marketing value +25% · Salary demands +30%</div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes gmFlash{0%,90%,100%{opacity:0}92%{opacity:0.6}95%{opacity:0}}
        @keyframes gmSpot{0%{transform:translateX(-50%) rotate(-5deg)}100%{transform:translateX(-50%) rotate(5deg)}}
        @keyframes gmHeart{0%{transform:translateY(0) scale(0.5);opacity:1}100%{transform:translateY(-100vh) scale(1.5);opacity:0}}
        @keyframes gmReveal{0%{opacity:0;transform:scale(0.5)}60%{opacity:1;transform:scale(1.08)}100%{opacity:1;transform:scale(1)}}
        @keyframes gmPose{0%,100%{transform:scale(1) rotate(0deg)}25%{transform:scale(1.04) rotate(-2deg)}75%{transform:scale(1.04) rotate(2deg)}}
      `}</style>
    </div>
  );
}

// ============================================
// RACIST ATTACK
// Concept: screen cracks + color drains + fist rises
// ============================================
export function RacistAttackAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"enter"|"crack"|"hold"|"fist"|"exit">("enter");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("crack"),  400);
    const t2 = setTimeout(() => setPhase("hold"),   1000);
    const t3 = setTimeout(() => setPhase("fist"),   3000);
    const t4 = setTimeout(() => setPhase("exit"),   4500);
    const t5 = setTimeout(() => onDone(),           5200);
    return () => { clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);clearTimeout(t4);clearTimeout(t5); };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[999] pointer-events-auto overflow-hidden flex items-center justify-center"
      onClick={() => onDone()}
      style={{cursor:"pointer",
        opacity:phase==="exit"?0:1, transition:phase==="exit"?"opacity 0.8s ease-in":"none",
        background: phase==="crack" ? "#1a0800"
          : phase==="hold" || phase==="fist" ? "#050200" : "#000",
      }}>

      <SkipHint />

      {/* Crack overlay */}
      {(phase==="crack" || phase==="hold") && (
        <div className="absolute inset-0" style={{ zIndex:2,
          backgroundImage:"radial-gradient(ellipse at 40% 40%, transparent 40%, rgba(0,0,0,0.8) 80%)",
          animation:"raCrack 0.6s ease-out forwards" }} />
      )}

      {/* Noise texture */}
      {phase==="hold" && (
        <div className="absolute inset-0" style={{ zIndex:1,
          backgroundImage:"repeating-linear-gradient(0deg,rgba(255,255,255,0.02) 0,rgba(255,255,255,0.02) 1px,transparent 1px,transparent 4px)",
          animation:"raNoise 0.1s steps(1) infinite" }} />
      )}

      {/* Crying tears */}
      {(phase==="hold" || phase==="fist") && (
        <div className="absolute inset-0 overflow-hidden" style={{ zIndex:3 }}>
          {[...Array(6)].map((_,i) => (
            <div key={i} className="absolute rounded-full" style={{
              width:`${4+(i%3)*3}px`, height:`${4+(i%3)*3}px`,
              left:`${20+(i*12)}%`, top:"30%",
              background:"rgba(100,160,255,0.7)",
              animation:`raTear ${1+i*0.2}s ease-in ${i*0.1}s infinite`,
            }} />
          ))}
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center gap-5"
        style={{ animation:phase==="crack"?"raShake 0.5s ease-out":"none" }}>

        <img src="/images/racism-attack-pixel.png" alt="Racist Attack"
          style={{
            width:"clamp(160px,26vw,220px)", imageRendering:"pixelated", objectFit:"contain",
            filter: phase==="hold" ? "grayscale(0.7) brightness(0.8) drop-shadow(0 0 15px rgba(100,60,30,0.5))"
              : phase==="fist" ? "grayscale(0) brightness(1.2) drop-shadow(0 0 20px rgba(255,160,60,0.6))" : "none",
            animation: phase==="crack" ? "raSlump 0.6s ease-out forwards"
              : phase==="fist" ? "raRise 0.8s cubic-bezier(0.22,1,0.36,1) forwards" : "none",
            transition:"filter 0.8s ease",
          }}
        />

        {(phase==="hold" || phase==="fist") && (
          <div style={{ textAlign:"center", opacity:1 }}>
            <div className="px-8 py-5" style={{
              background:"rgba(5,2,0,0.97)",
              border:`1px solid ${phase==="fist" ? "rgba(255,160,60,0.7)" : "rgba(100,60,30,0.5)"}`,
              boxShadow:`0 0 40px ${phase==="fist" ? "rgba(255,140,40,0.25)" : "rgba(80,40,10,0.2)"}`,
              transition:"all 0.8s ease" }}>
              <div className="text-[9px] tracking-[0.5em] uppercase mb-2" style={{ color: phase==="fist" ? "rgba(255,180,60,0.7)" : "rgba(180,100,50,0.5)" }}>
                {phase==="fist" ? "NO SURRENDER" : "RACIAL ABUSE"}
              </div>
              <div className="font-black text-2xl tracking-widest uppercase" style={{
                color: phase==="fist" ? "#ff9020" : "#8a4020",
                textShadow: phase==="fist" ? "0 0 24px rgba(255,140,40,0.9)" : "0 0 15px rgba(150,70,30,0.5)" }}>
                {phase==="fist" ? "Stand Strong" : "Racist Attack"}
              </div>
              <div className="text-xs tracking-[0.2em] uppercase mt-1.5" style={{ color:"rgba(255,255,255,0.2)" }}>
                {phase==="fist" ? "Bounce back coming — stronger than ever" : "Value −20% · Performance affected 2 seasons"}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes raCrack{0%{opacity:0}100%{opacity:1}}
        @keyframes raShake{0%,100%{transform:translate(0)}20%{transform:translate(-10px,5px)}40%{transform:translate(10px,-5px)}60%{transform:translate(-6px,3px)}80%{transform:translate(6px,-3px)}}
        @keyframes raSlump{0%{transform:translateY(-20px)}100%{transform:translateY(5px) rotate(-2deg)}}
        @keyframes raRise{0%{transform:rotate(-2deg) translateY(5px)}60%{transform:rotate(2deg) translateY(-8px) scale(1.05)}100%{transform:rotate(0) translateY(0) scale(1)}}
        @keyframes raTear{0%{transform:translateY(0);opacity:0.8}100%{transform:translateY(60vh);opacity:0}}
        @keyframes raNoise{0%{opacity:0.3}50%{opacity:0.6}100%{opacity:0.3}}
      `}</style>
    </div>
  );
}

// ============================================
// CLUB LEGEND
// Concept: stadium statue reveal, crowd roar effect
// ============================================
export function ClubLegendAnimation({ onDone }: AnimProps) {
  const [phase, setPhase] = useState<"dark"|"walk"|"pedestal"|"unveil"|"hold"|"exit">("dark");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("walk"),     500);
    const t2 = setTimeout(() => setPhase("pedestal"), 1500);
    const t3 = setTimeout(() => setPhase("unveil"),   2200);
    const t4 = setTimeout(() => setPhase("hold"),     3000);
    const t5 = setTimeout(() => setPhase("exit"),     7000);
    const t6 = setTimeout(() => onDone(),             7700);
    return () => { clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);clearTimeout(t4);clearTimeout(t5);clearTimeout(t6); };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[999] pointer-events-auto overflow-hidden"
      onClick={() => onDone()}
      style={{ cursor:"pointer", opacity:phase==="exit"?0:1, transition:phase==="exit"?"opacity 1.2s ease-in":"opacity 0.4s",
        background:"#000" }}>
<SkipHint />

      {/* ── Cinematic bars ── */}
      <div className="absolute top-0 left-0 right-0 z-20" style={{height:"clamp(45px,7vh,72px)",background:"#000"}} />
      <div className="absolute bottom-0 left-0 right-0 z-20" style={{height:"clamp(45px,7vh,72px)",background:"#000"}} />

      {/* ── Stadium sky ── */}
      <div className="absolute inset-0" style={{
        background: phase==="hold"||phase==="unveil"
          ? "radial-gradient(ellipse at 50% 30%, rgba(30,20,0,0.9) 0%, rgba(5,3,0,1) 60%, #000 100%)"
          : "radial-gradient(ellipse at 50% 30%, rgba(8,5,0,0.9) 0%, #000 70%)",
        transition:"background 2s ease",
      }} />

      {/* ── Stadium crowd silhouette ── */}
      {(phase==="pedestal"||phase==="unveil"||phase==="hold") && (
        <div className="absolute bottom-0 left-0 right-0 z-2" style={{
          height:"30%",
          background:"linear-gradient(0deg, rgba(5,3,0,0.95) 0%, transparent 100%)",
          backgroundImage:"repeating-linear-gradient(90deg,rgba(212,175,55,0.015) 0,rgba(212,175,55,0.015) 2px,transparent 2px,transparent 12px)",
        }} />
      )}

      {/* ── Multiple spotlights ── */}
      {(phase==="unveil"||phase==="hold") && ["-30%","50%","130%"].map((left,i)=>(
        <div key={i} className="absolute z-3" style={{
          top:0, left, transform:"translateX(-50%)",
          width:"clamp(120px,18vw,200px)", height:"100vh",
          background:`linear-gradient(180deg, rgba(255,220,100,${0.12+i*0.04}) 0%, rgba(212,175,55,0.03) 50%, transparent 75%)`,
          clipPath:"polygon(20% 0%,80% 0%,100% 100%,0% 100%)",
          animation:`clSpot${i} ${3+i*0.5}s ease-in-out ${i*0.3}s infinite alternate`,
        }} />
      ))}

      {/* ── Gold confetti ── */}
      {phase==="hold" && [...Array(22)].map((_,i)=>(
        <div key={i} className="absolute z-6" style={{
          width:`${3+(i%3)*2}px`, height:`${8+(i%4)*5}px`,
          left:`${(i*4.8)%96}%`, top:"-20px",
          background:`hsl(${42+(i%15)*3},80%,${52+i%18}%)`,
          borderRadius:"1px",
          animation:`clConf ${2+i*0.12}s linear ${i*0.07}s infinite`,
        }} />
      ))}

      {/* ── Ambient gold particles ── */}
      {(phase==="hold") && [...Array(14)].map((_,i)=>(
        <div key={i} className="absolute rounded-full z-5" style={{
          width:`${1+(i%3)}px`, height:`${1+(i%3)}px`,
          left:`${(i*7.2)%92}%`, bottom:"5%",
          background:"rgba(212,175,55,0.8)",
          boxShadow:"0 0 4px rgba(212,175,55,0.6)",
          animation:`clDust ${2.5+i*0.2}s ease-out ${i*0.15}s infinite`,
        }} />
      ))}

      {/* ── Expanding rings ── */}
      {phase==="hold" && [200,330,460,590].map((size,i)=>(
        <div key={i} className="absolute rounded-full z-4" style={{
          width:`${size}px`, height:`${size}px`,
          left:"50%", top:"45%", transform:"translate(-50%,-50%)",
          border:`1px solid rgba(212,175,55,${0.5-i*0.1})`,
          animation:`clRingExpand ${3+i*0.6}s ease-out ${i*0.4}s infinite`,
        }} />
      ))}

      {/* ── Main content ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">

        {/* Pedestal */}
        {(phase==="pedestal"||phase==="unveil"||phase==="hold") && (
          <div style={{
            position:"relative",
            marginBottom:"-4px",
            animation:"clPedestalRise 0.8s cubic-bezier(0.22,1,0.36,1) forwards",
          }}>
            {/* Top slab */}
            <div style={{
              width:"clamp(120px,18vw,170px)", height:"12px",
              background:"linear-gradient(180deg,#D4AF37,#8B6914)",
              boxShadow:"0 4px 20px rgba(212,175,55,0.5), 0 0 40px rgba(212,175,55,0.2)",
              margin:"0 auto",
            }} />
            {/* Column */}
            <div style={{
              width:"clamp(80px,12vw,110px)", height:"clamp(30px,5vw,50px)",
              background:"linear-gradient(180deg,#b8960a,#6b4f08)",
              margin:"0 auto",
              boxShadow:"0 0 20px rgba(180,140,0,0.3)",
            }} />
            {/* Base */}
            <div style={{
              width:"clamp(130px,20vw,180px)", height:"10px",
              background:"linear-gradient(180deg,#8B6914,#4a3508)",
              margin:"0 auto",
            }} />
          </div>
        )}

        {/* Portrait */}
        <div style={{
          opacity: phase==="dark"||phase==="walk" ? 0 : 1,
          transition:"opacity 0.5s ease",
          animation: phase==="pedestal" ? "clStatueRise 0.9s cubic-bezier(0.22,1,0.36,1) forwards"
            : phase==="unveil" ? "clUnveil 0.8s cubic-bezier(0.22,1,0.36,1) forwards"
            : phase==="hold" ? "clFloat 4s ease-in-out infinite" : "none",
        }}>
          <img src="/images/club-legend-pixel.png" alt="Club Legend"
            style={{
              width:"clamp(160px,26vw,220px)",
              imageRendering:"pixelated", objectFit:"contain",
              filter: phase==="hold"
                ? "drop-shadow(0 0 30px rgba(212,175,55,1)) drop-shadow(0 0 60px rgba(212,175,55,0.6)) drop-shadow(0 0 100px rgba(255,220,80,0.3)) sepia(0.2) saturate(1.2)"
                : "drop-shadow(0 0 10px rgba(212,175,55,0.3))",
              transition:"filter 0.8s ease",
            }}
          />
        </div>

        {/* Walk-in silhouette */}
        {phase==="walk" && (
          <div className="absolute" style={{
            animation:"clWalkIn 1s ease-out forwards",
            bottom:"30%", opacity:0,
          }}>
            <div style={{width:"60px",height:"80px",background:"rgba(212,175,55,0.3)",clipPath:"polygon(30% 0%,70% 0%,100% 100%,0% 100%)",filter:"blur(4px)"}} />
          </div>
        )}

        {/* Award card */}
        {phase==="hold" && (
          <div style={{
            textAlign:"center", marginTop:"clamp(12px,2vw,20px)",
            animation:"clCardIn 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s both",
          }}>
            <div style={{
              background:"linear-gradient(135deg,rgba(3,2,0,0.98),rgba(12,8,0,0.98))",
              border:"1px solid rgba(212,175,55,0.9)",
              boxShadow:"0 0 60px rgba(212,175,55,0.4), 0 0 120px rgba(212,175,55,0.15), inset 0 0 30px rgba(212,175,55,0.04)",
              padding:"clamp(14px,2vw,20px) clamp(24px,4vw,44px)",
            }}>
              <div className="flex items-center gap-3 mb-3">
                <div style={{flex:1,height:"1px",background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.6))"}} />
                <span className="text-[9px] tracking-[0.6em] uppercase" style={{color:"rgba(212,175,55,0.5)"}}>Eternal</span>
                <div style={{flex:1,height:"1px",background:"linear-gradient(90deg,rgba(212,175,55,0.6),transparent)"}} />
              </div>
              <div className="font-black tracking-widest uppercase"
                style={{ fontSize:"clamp(1.5rem,4vw,2.5rem)", color:"#D4AF37",
                  textShadow:"0 0 30px rgba(212,175,55,1), 0 0 60px rgba(212,175,55,0.6), 0 0 100px rgba(255,220,80,0.3)",
                  letterSpacing:"0.12em" }}>
                Club Legend
              </div>
              <div className="flex items-center gap-3 mt-3">
                <div style={{flex:1,height:"1px",background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.3))"}} />
                <span style={{color:"rgba(212,175,55,0.4)",fontSize:"10px"}}>✦</span>
                <div style={{flex:1,height:"1px",background:"linear-gradient(90deg,rgba(212,175,55,0.3),transparent)"}} />
              </div>
              <div className="text-xs tracking-[0.25em] uppercase mt-2" style={{color:"rgba(255,255,255,0.2)"}}>
                Forever loyal · Accepts any contract
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes clWalkIn       {0%{opacity:0;transform:translateX(80px)}100%{opacity:0.6;transform:translateX(0)}}
        @keyframes clPedestalRise {0%{opacity:0;transform:translateY(40px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes clStatueRise   {0%{opacity:0;transform:translateY(30px) scale(0.7)}60%{opacity:1;transform:translateY(-6px) scale(1.06)}100%{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes clUnveil       {0%{filter:brightness(3) blur(4px);transform:scale(1.15)}100%{filter:drop-shadow(0 0 30px rgba(212,175,55,1)) drop-shadow(0 0 60px rgba(212,175,55,0.6));transform:scale(1)}}
        @keyframes clFloat        {0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-16px) scale(1.02)}}
        @keyframes clCardIn       {0%{opacity:0;transform:translateY(20px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes clRingExpand   {0%{transform:translate(-50%,-50%) scale(0.3);opacity:0.7}100%{transform:translate(-50%,-50%) scale(2.5);opacity:0}}
        @keyframes clDust         {0%{transform:translateY(0);opacity:0.8}100%{transform:translateY(-90vh);opacity:0}}
        @keyframes clConf         {0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
        @keyframes clSpot0        {0%{transform:translateX(-50%) rotate(-8deg)}100%{transform:translateX(-50%) rotate(-2deg)}}
        @keyframes clSpot1        {0%{transform:translateX(-50%) rotate(-4deg)}100%{transform:translateX(-50%) rotate(4deg)}}
        @keyframes clSpot2        {0%{transform:translateX(-50%) rotate(2deg)}100%{transform:translateX(-50%) rotate(8deg)}}
      `}</style>
    </div>
  );
}


// ============================================
// أضف أنيميشنات جديدة هنا
// ============================================