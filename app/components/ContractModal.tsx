"use client";

import { useState } from "react";
import type { ContractNegotiation } from "../game/types";
import {
  updateOffer, getNegotiationHint, willPlayerAccept,
  generatePlayerCounterOffer, getAcceptanceProbability
} from "../game/contractEngine";
import { getSatisfactionColor, nationalityFlag, positionBg } from "../game/helpers";
import { getSeasonStats } from "../game/statsEngine";

type Props = {
  negotiation: ContractNegotiation;
  season: number;
  onUpdate: (negotiation: ContractNegotiation) => void;
  onSign: () => void;
  onCancel: () => void;
};

const DURATION_OPTIONS = [1, 2, 3, 4, 5];

export default function ContractModal({ negotiation, season, onUpdate, onSign, onCancel }: Props) {
  const { player, offeredSalary, offeredDuration, satisfaction, requiredSalary, marketValue, playerCounterMessage } = negotiation;
  const stats = getSeasonStats(player, season);
  const age = player.startAge + (season - player.availableSeason);

  // المستثمر يحدد عرضه
  const [mySalary, setMySalary] = useState<number>(offeredSalary);
  const [myDuration, setMyDuration] = useState<number>(offeredDuration);
  const [counterMsg, setCounterMsg] = useState<string>(playerCounterMessage ?? `👋 My asking price is €${offeredSalary}M/yr for ${offeredDuration} years.`);
  const [negotiationDone, setNegotiationDone] = useState(false);
  const [result, setResult] = useState<"accepted" | "rejected" | null>(null);

  const acceptProb = getAcceptanceProbability(satisfaction);
  const satColor = getSatisfactionColor(satisfaction);

  // الراتب الموصى به بناءً على سعر الشراء
  const minSalary = Math.max(1, Math.round(marketValue * 0.05));
  const maxSalary = Math.round(marketValue * 0.30);

  function handleMakeOffer() {
    const updated = updateOffer(negotiation, mySalary, myDuration);
    onUpdate(updated);

    const sat = updated.satisfaction;

    // رفض تلقائي
    if (sat < 20) {
      setCounterMsg("❌ This is completely unacceptable. Negotiation over.");
      setResult("rejected");
      setNegotiationDone(true);
      return;
    }

    // قبول تلقائي
    if (sat >= 100) {
      setCounterMsg("✅ Perfect! I accept this offer!");
      setResult("accepted");
      setNegotiationDone(true);
      return;
    }

    // احتمال حسب نسبة الرضا
    const accepted = Math.random() < (sat / 100);
    if (accepted) {
      setCounterMsg(`✅ Deal! I accept. (${sat}% satisfaction)`);
      setResult("accepted");
      setNegotiationDone(true);
    } else {
      // رد اللاعب المضاد
      const counter = generatePlayerCounterOffer(updated);
      setCounterMsg(counter.message);
      setMySalary(counter.salary);
      setMyDuration(counter.duration);
    }
  }

  function handleSign() {
    if (result === "accepted") onSign();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)" }}>
      <div className="w-full max-w-lg rounded-none overflow-hidden shadow-2xl" style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)" }}>

        {/* Header */}
        <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between"
          style={{ background: "rgba(16,185,129,0.08)" }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{nationalityFlag(player.nationality)}</span>
            <div>
              <div className="font-black text-white text-lg">{player.name}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-xs font-black px-1.5 py-0.5 rounded-none ${positionBg(player.position)}`}>{player.position}</span>
                <span className="text-gray-400 text-xs">{age} years old</span>
                <span className="text-yellow-400 text-xs font-bold">€{marketValue}M</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Rating</div>
            <div className="text-2xl font-black text-white">{stats.rating}</div>
          </div>
        </div>

        {/* Player message bubble */}
        <div className="px-6 pt-4">
          <div className="rounded-none p-3 text-sm font-medium"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <span className="text-gray-300">{counterMsg}</span>
          </div>
        </div>

        {/* Satisfaction */}
        <div className="px-6 pt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 uppercase tracking-widest">Player Satisfaction</span>
            <span className="text-sm font-black" style={{ color: satColor }}>{satisfaction}%</span>
          </div>
          <div className="h-2 rounded-none overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div className="h-full transition-all duration-500" style={{ width: `${satisfaction}%`, background: satColor }} />
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {satisfaction < 20 ? "❌ Auto-reject" : satisfaction >= 100 ? "✅ Auto-accept" : `~${Math.round(acceptProb * 100)}% chance of acceptance`}
          </div>
        </div>

        {/* My Offer */}
        {!negotiationDone && (
          <div className="px-6 pt-4">
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">Your Counter Offer</div>

            {/* Salary slider */}
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-500">Salary / Year</span>
                <span className="text-sm font-black text-emerald-400">€{mySalary}M</span>
              </div>
              <input type="range" min={minSalary} max={maxSalary} step={1}
                value={mySalary} onChange={e => setMySalary(Number(e.target.value))}
                className="w-full accent-emerald-400" />
              <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                <span>Min €{minSalary}M</span>
                <span className="text-gray-500">Required ~€{requiredSalary}M</span>
                <span>Max €{maxSalary}M</span>
              </div>
            </div>

            {/* Duration */}
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-2">Contract Duration</div>
              <div className="grid grid-cols-5 gap-2">
                {DURATION_OPTIONS.map(d => (
                  <button key={d} onClick={() => setMyDuration(d)}
                    className="py-2 rounded-none font-black text-sm transition-all"
                    style={myDuration === d ? {
                      background: "rgba(16,185,129,0.2)", border: "1px solid #10b981", color: "#10b981"
                    } : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#6b7280" }}>
                    {d}yr
                  </button>
                ))}
              </div>
            </div>

            {/* Offer summary */}
            <div className="p-3 rounded-none mb-4 text-sm" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <span className="text-gray-400">Your offer: </span>
              <span className="text-white font-bold">€{mySalary}M/yr × {myDuration}yr = €{mySalary * myDuration}M total</span>
            </div>

            <button onClick={handleMakeOffer}
              className="w-full py-3 rounded-none font-black text-sm uppercase tracking-widest transition-all mb-2"
              style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "white", boxShadow: "0 4px 15px rgba(59,130,246,0.3)" }}>
              📤 Make Offer
            </button>
          </div>
        )}

        {/* Result actions */}
        <div className="px-6 pb-6 flex gap-3 mt-2">
          {result === "accepted" ? (
            <button onClick={handleSign}
              className="flex-1 py-3 rounded-none font-black text-sm uppercase transition-all"
              style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "white" }}>
              ✅ Sign Contract
            </button>
          ) : result === "rejected" ? (
            <button onClick={onCancel}
              className="flex-1 py-3 rounded-none font-black text-sm uppercase transition-all"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#6b7280" }}>
              Close
            </button>
          ) : (
            <button onClick={onCancel}
              className="flex-1 py-3 rounded-none font-black text-sm uppercase transition-all"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#6b7280" }}>
              Cancel
            </button>
          )}
        </div>

      </div>
    </div>
  );
}