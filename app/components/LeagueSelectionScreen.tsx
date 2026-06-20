"use client";

import { useState } from "react";

// ============================================
// LEAGUE SELECTION SCREEN
// يظهر بعد Start Game في طور Club Owner
// ============================================

export type LeagueId = "premier_league" | "bundesliga" | "la_liga" | "serie_a" | "ligue_1" | "saudi_league" | "portuguese_league" | "eredivisie" | "super_lig" | "championship" | "bundesliga2" | "segunda" | "serie_b" | "ligue_2";

export type LeagueInfo = {
  id: LeagueId;
  name: string;
  country: string;
  flag: string;
  budget: number;
  available: boolean;
  color: string;
  teams: string[];
  logo: string;
  tier?: 1 | 2;
  parentLeague?: string;
};

export const LEAGUES: LeagueInfo[] = [
  {
    id: "premier_league",
    name: "Premier League",
    country: "England",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    budget: 150,
    available: true,
    color: "#3d195b",
    logo: "/images/league-premier.png",
    teams: [
      "Arsenal","Aston Villa","Bournemouth","Brentford","Brighton",
      "Chelsea","Coventry City","Crystal Palace","Everton","Fulham",
      "Hull City","Ipswich Town","Leeds United","Liverpool","Manchester City",
      "Manchester United","Newcastle United","Nottingham Forest","Sunderland","Tottenham Hotspur",
    ],
  },
  {
    id: "championship",
    name: "Championship",
    country: "England",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    budget: 80,
    available: true,
    color: "#5c2d8a",
    logo: "/images/league-championship.png",
    tier: 2,
    parentLeague: "premier_league",
    teams: [
      "Birmingham City","Blackburn Rovers","Bolton Wanderers","Bristol City","Burnley",
      "Cardiff City","Charlton Athletic","Derby County","Lincoln City","Middlesbrough",
      "Millwall","Norwich City","Portsmouth","Preston North End","Queens Park Rangers",
      "Sheffield United","Southampton","Stoke City","Swansea City","Watford",
      "West Bromwich Albion","West Ham United","Wolverhampton Wanderers","Wrexham",
    ],
  },
  {
    id: "bundesliga",
    name: "Bundesliga",
    country: "Germany",
    flag: "🇩🇪",
    budget: 130,
    available: true,
    color: "#d00000",
    logo: "/images/league-bundesliga.png",
    teams: [
      "Bayer Leverkusen","Bayern Munich","Borussia Dortmund","RB Leipzig","VfB Stuttgart",
      "Eintracht Frankfurt","TSG Hoffenheim","FC Heidenheim","Werder Bremen","SC Freiburg",
      "FC Augsburg","VfL Wolfsburg","Borussia Mönchengladbach","Mainz 05","VfL Bochum",
      "Union Berlin","FC St. Pauli","Holstein Kiel",
    ],
  },
  {
    id: "bundesliga2",
    name: "Bundesliga 2",
    country: "Germany",
    flag: "🇩🇪",
    budget: 70,
    available: true,
    color: "#a00000",
    logo: "/images/league-bundesliga2.png",
    tier: 2,
    parentLeague: "bundesliga",
    teams: [
      "Hamburger SV","Schalke 04","Hertha BSC","FC Köln","Fortuna Düsseldorf",
      "Hannover 96","SC Paderborn","Karlsruher SC","1. FC Nürnberg","1. FC Kaiserslautern",
      "Greuther Fürth","Magdeburg","Eintracht Braunschweig","Elversberg","Darmstadt 98",
      "Preußen Münster","SSV Ulm","Jahn Regensburg",
    ],
  },
  {
    id: "la_liga",
    name: "La Liga",
    country: "Spain",
    flag: "🇪🇸",
    budget: 140,
    available: true,
    color: "#ee8700",
    logo: "/images/league-laliga.png",
    teams: [
      "Barcelona","Real Madrid","Villarreal","Atlético Madrid","Real Betis",
      "Celta Vigo","Getafe","Rayo Vallecano","Valencia","Real Sociedad",
      "Espanyol","Athletic Bilbao","Sevilla","Deportivo Alavés","Elche",
      "Levante","Osasuna","Mallorca","Girona","Real Oviedo",
    ],
  },
  {
    id: "segunda",
    name: "Segunda División",
    country: "Spain",
    flag: "🇪🇸",
    budget: 75,
    available: true,
    color: "#c8a800",
    logo: "/images/league-segunda.png",
    tier: 2,
    parentLeague: "la_liga",
    teams: [
      "Real Zaragoza","Sporting Gijón","Tenerife","Real Oviedo","Racing Santander",
      "Levante","Eibar","Elche","Albacete","Burgos",
      "Cartagena","Eldense","Huesca","Mirandés","Racing Ferrol",
      "Castellón","Deportivo La Coruña","Málaga","Córdoba","Almería",
      "Granada","Cádiz",
    ],
  },
  {
    id: "serie_a",
    name: "Serie A",
    country: "Italy",
    flag: "🇮🇹",
    budget: 120,
    available: true,
    color: "#0066cc",
    logo: "/images/league-seriea.png",
    teams: [
      "AC Milan","Inter Milan","Juventus","Napoli","AS Roma",
      "Lazio","Atalanta","Fiorentina","Bologna","Torino",
      "Udinese","Genoa","Cagliari","Lecce","Hellas Verona",
      "Empoli","Monza","Como","Parma","Venezia",
    ],
  },
  {
    id: "serie_b",
    name: "Serie B",
    country: "Italy",
    flag: "🇮🇹",
    budget: 65,
    available: true,
    color: "#004a99",
    logo: "/images/league-serieb.png",
    tier: 2,
    parentLeague: "serie_a",
    teams: [
      "Sassuolo","Salernitana","Frosinone","Palermo","Cremonese",
      "Sampdoria","Brescia","Pisa","Catanzaro","Modena",
      "Bari","Spezia","Cosenza","Südtirol","Reggiana",
      "Cittadella","Cesena","Mantova","Juve Stabia","Carrarese",
    ],
  },
  {
    id: "saudi_league",
    name: "Saudi Pro League",
    country: "Saudi Arabia",
    flag: "🇸🇦",
    budget: 200,
    available: true,
    color: "#006c35",
    logo: "/images/league-saudi.png",
    teams: [
      "Al Nassr","Al Hilal","Al Ahli","Al Ittihad","Al Shabab",
      "Al Qadsiah","Al Taawoun","Al Ettifaq","Al Fateh","Al Fayha",
      "Al Khaleej","Al Riyadh","Damac FC","Al Okhdood","Al Kholood",
      "Al Hazem","NEOM SC","Al Najma",
    ],
  },
  {
    id: "portuguese_league",
    name: "Primeira Liga",
    country: "Portugal",
    flag: "🇵🇹",
    budget: 100,
    available: true,
    color: "#006600",
    logo: "/images/league-portugal.png",
    teams: [
      "Sporting CP","FC Porto","SL Benfica","SC Braga","Vitória de Guimarães",
      "Famalicão","Moreirense","Arouca","Estoril Praia","Gil Vicente",
      "Rio Ave","Santa Clara","Nacional","Casa Pia","Estrela da Amadora",
      "Alverca","Tondela","AVS Futebol SAD",
    ],
  },
  {
    id: "eredivisie",
    name: "Eredivisie",
    country: "Netherlands",
    flag: "🇳🇱",
    budget: 90,
    available: true,
    color: "#ff6600",
    logo: "/images/league-eredivisie.png",
    teams: [
      "Ajax","PSV Eindhoven","Feyenoord","AZ Alkmaar","FC Twente",
      "FC Utrecht","Sparta Rotterdam","NEC Nijmegen","Go Ahead Eagles","Fortuna Sittard",
      "SC Heerenveen","FC Groningen","PEC Zwolle","Almere City","Heracles Almelo",
      "RKC Waalwijk","Willem II","NAC Breda",
    ],
  },
  {
    id: "super_lig",
    name: "Süper Lig",
    country: "Turkey",
    flag: "🇹🇷",
    budget: 95,
    available: true,
    color: "#e30a17",
    logo: "/images/league-superlig.png",
    teams: [
      "Galatasaray","Fenerbahçe","Beşiktaş","Trabzonspor","İstanbul Başakşehir",
      "Göztepe","Samsunspor","Çaykur Rizespor","Konyaspor","Alanyaspor",
      "Kocaelispor","Gaziantep FK","Kasımpaşa","Gençlerbirliği","Eyüpspor",
      "Amedspor","Çorum FK","Erzurumspor FK",
    ],
  },
  {
    id: "ligue_1",
    name: "Ligue 1",
    country: "France",
    flag: "🇫🇷",
    budget: 110,
    available: true,
    color: "#002395",
    logo: "/images/league-ligue1.png",
    teams: [
      "Paris Saint-Germain","Marseille","Monaco","Lyon","Lille",
      "Lens","Nice","Rennes","Brest","Toulouse",
      "Strasbourg","Lorient","Paris FC","Angers","Le Havre",
      "Auxerre","Nantes","Metz",
    ],
  },
  {
    id: "ligue_2",
    name: "Ligue 2",
    country: "France",
    flag: "🇫🇷",
    budget: 60,
    available: true,
    color: "#001e96",
    logo: "/images/league-ligue2.png",
    tier: 2,
    parentLeague: "ligue_1",
    teams: [
      "FC Metz","FC Nantes","AS Saint-Étienne","Montpellier Hérault SC","Stade de Reims",
      "Clermont Foot 63","FC Sochaux-Montbéliard","En Avant Guingamp","Dijon FCO","Grenoble Foot 38",
      "US Boulogne CO","AS Nancy Lorraine","Red Star FC","Stade Lavallois Mayenne FC","Rodez AF",
      "Pau FC","FC Annecy","USL Dunkerque",
    ],
  },
];

type Props = {
  onSelect: (leagueId: LeagueId, teamName: string, budget: number) => void;
  onBack: () => void;
};

export default function LeagueSelectionScreen({ onSelect, onBack }: Props) {
  const [selectedLeague, setSelectedLeague] = useState<LeagueInfo | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  function handleLeagueClick(league: LeagueInfo) {
    if (!league.available) return;
    setSelectedLeague(league);
    setSelectedTeam(null);
    setConfirming(false);
  }

  function handleTeamClick(team: string) {
    setSelectedTeam(team);
    setConfirming(false);
  }

  function handleJoin() {
    if (!selectedLeague || !selectedTeam) return;
    if (!confirming) {
      setConfirming(true);
      return;
    }
    onSelect(selectedLeague.id, selectedTeam, selectedLeague.budget);
  }

  function handleChangeLeague() {
    setSelectedLeague(null);
    setSelectedTeam(null);
    setConfirming(false);
  }

  return (
    <main className="min-h-screen text-white flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "#050810" }}>

      {/* Background */}
      <div className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/images/start-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }} />
      <div className="absolute inset-0 z-[1]" style={{ background: "rgba(5,8,16,0.75)" }} />
      <div className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%)" }} />

      <div className="relative z-10 w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <button onClick={onBack}
            className="absolute left-0 top-0 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all hover:scale-105"
            style={{ color: "#6b7280", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", background: "rgba(255,255,255,0.05)" }}>
            ← Back
          </button>
          <div className="text-[10px] tracking-[0.4em] uppercase mb-2" style={{ color: "rgba(212,175,55,0.6)" }}>
            Club Owner Mode
          </div>
          <h1 className="font-black text-3xl uppercase tracking-widest" style={{ color: "#FFD54F", textShadow: "0 0 30px rgba(212,175,55,0.4)" }}>
            {selectedLeague ? "Choose Your Club" : "Select League"}
          </h1>
          {selectedLeague && (
            <div className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              {selectedLeague.flag} {selectedLeague.name} · €{selectedLeague.budget}M Budget
            </div>
          )}
        </div>

        {/* League Selection */}
        {!selectedLeague && (
          <div className="grid grid-cols-1 gap-3">
            {LEAGUES.map((league, idx) => (
              <button
                key={league.id}
                onClick={() => handleLeagueClick(league)}
                disabled={!league.available}
                className="relative w-full p-5 text-left overflow-hidden"
                style={{
                  background: league.available
                    ? `linear-gradient(135deg, rgba(${hexToRgb(league.color)},0.18), rgba(${hexToRgb(league.color)},0.06))`
                    : "rgba(17,24,39,0.4)",
                  border: league.available
                    ? `1.5px solid rgba(${hexToRgb(league.color)},0.6)`
                    : "1.5px solid rgba(255,255,255,0.06)",
                  borderRadius: "14px",
                  cursor: league.available ? "pointer" : "not-allowed",
                  opacity: league.available ? 1 : 0.45,
                  transform: "scale(1) translateY(0)",
                  transition: "all 0.2s cubic-bezier(0.22,1,0.36,1)",
                  boxShadow: league.available
                    ? `0 2px 12px rgba(${hexToRgb(league.color)},0.1)`
                    : "none",
                  animation: league.available ? `leagueCardIn 0.4s cubic-bezier(0.22,1,0.36,1) ${idx * 0.05}s both` : "none",
                }}
                onMouseEnter={e => {
                  if (!league.available) return;
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.transform = "scale(1.015) translateY(-2px)";
                  el.style.boxShadow = `0 8px 28px rgba(${hexToRgb(league.color)},0.3)`;
                  el.style.border = `1.5px solid rgba(${hexToRgb(league.color)},0.9)`;
                  el.style.background = `linear-gradient(135deg, rgba(${hexToRgb(league.color)},0.28), rgba(${hexToRgb(league.color)},0.1))`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.transform = "scale(1) translateY(0)";
                  el.style.boxShadow = league.available ? `0 2px 12px rgba(${hexToRgb(league.color)},0.1)` : "none";
                  el.style.border = league.available ? `1.5px solid rgba(${hexToRgb(league.color)},0.6)` : "1.5px solid rgba(255,255,255,0.06)";
                  el.style.background = league.available ? `linear-gradient(135deg, rgba(${hexToRgb(league.color)},0.18), rgba(${hexToRgb(league.color)},0.06))` : "rgba(17,24,39,0.4)";
                }}
                onMouseDown={e => { if (league.available) (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98) translateY(0)"; }}
                onMouseUp={e => { if (league.available) (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.015) translateY(-2px)"; }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
                      <img
                        src={league.logo}
                        alt={league.name}
                        style={{ width: "52px", height: "52px", objectFit: "contain", opacity: league.available ? 1 : 0.3 }}
                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    </div>
                    <div>
                      <div className="font-black text-lg tracking-wide" style={{ color: league.available ? "white" : "#4b5563" }}>
                        {league.name}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                        {league.country} · {league.teams.length || 20} Clubs
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {league.available ? (
                      <div>
                        <div className="font-black text-lg" style={{ color: "#FFD54F" }}>€{league.budget}M</div>
                        <div className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>Starting Budget</div>
                      </div>
                    ) : (
                      <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#4b5563" }}>
                        Coming Soon
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Team Selection */}
        {selectedLeague && (
          <>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {selectedLeague.teams.map(team => (
                <button
                  key={team}
                  onClick={() => handleTeamClick(team)}
                  className="p-3 text-left transition-all duration-150 font-bold text-sm"
                  style={selectedTeam === team ? {
                    background: `rgba(${hexToRgb(selectedLeague.color)},0.2)`,
                    border: `1.5px solid rgba(${hexToRgb(selectedLeague.color)},0.8)`,
                    borderRadius: "10px",
                    color: "white",
                    boxShadow: `0 0 16px rgba(${hexToRgb(selectedLeague.color)},0.3)`,
                  } : {
                    background: "rgba(17,24,39,0.6)",
                    border: "1.5px solid rgba(255,255,255,0.07)",
                    borderRadius: "10px",
                    color: "#6b7280",
                  }}
                  onMouseEnter={e => { if (selectedTeam !== team) (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)"; }}
                  onMouseLeave={e => { if (selectedTeam !== team) (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.07)"; }}
                >
                  {team}
                </button>
              ))}
            </div>

            {/* Change League */}
            <button onClick={handleChangeLeague}
              className="w-full py-2 mb-3 text-xs font-bold uppercase tracking-wider transition-all hover:scale-105"
              style={{ color: "#6b7280", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", background: "rgba(255,255,255,0.03)" }}>
              ← Change League
            </button>

            {/* Join Button */}
            <button
              onClick={handleJoin}
              disabled={!selectedTeam}
              className="w-full py-5 font-black text-base uppercase tracking-[0.2em] transition-all duration-200 relative overflow-hidden"
              style={selectedTeam ? {
                background: confirming
                  ? "linear-gradient(135deg, #10b981, #059669)"
                  : "linear-gradient(135deg, #b8960a 0%, #FFD54F 40%, #f0c030 60%, #b8960a 100%)",
                color: confirming ? "white" : "#111827",
                borderRadius: "12px",
                boxShadow: confirming
                  ? "0 8px 32px rgba(16,185,129,0.45)"
                  : "0 8px 32px rgba(255,213,79,0.45)",
                border: confirming
                  ? "1.5px solid #10b981"
                  : "1.5px solid rgba(255,213,79,0.8)",
              } : {
                background: "rgba(17,24,39,0.7)",
                color: "#374151",
                cursor: "not-allowed",
                borderRadius: "12px",
                border: "1.5px solid rgba(255,255,255,0.06)",
              }}
            >
              {!selectedTeam
                ? "Select a Club to Continue"
                : confirming
                ? `✅ Confirm — Take Over ${selectedTeam}`
                : `▶  Join ${selectedTeam}`}
            </button>

            {confirming && (
              <p className="text-center text-xs mt-3" style={{ color: "rgba(255,255,255,0.35)" }}>
                ⚠️ بعد الاختيار لا يمكن تغيير الدوري أو النادي إلا بلعبة جديدة
              </p>
            )}
          </>
        )}

      </div>
    </main>
  );
}

// Helper: convert hex to rgb string for rgba()
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "255,255,255";
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}