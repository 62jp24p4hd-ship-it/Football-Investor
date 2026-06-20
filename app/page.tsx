"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  GamePlayer, Player, GameMode, BudgetMode, EventType,
  AuctionState, InvestorOfferState, RewardChoice, StealChallenge,
  SeasonEvent, NewsItem, ContractNegotiation, OwnedPlayer,
  RewardCard, DevEventId, SeasonEvent as SeasonEventType,
} from "./game/types";

// Game engines
import { buildAllBasePlayers, getSecretPlayers } from "./game/playerDatabase";
import { generateSeasonPlayerPool } from "./game/playerGenerator";
import { getCurrentValue, guaranteeAffordablePlayer, applyLeaguePricing, reapplyLeaguePricingToOwnedSquad, calculateLeaguePlayerPrice } from "./game/valueEngine";
import { getSeasonStats } from "./game/statsEngine";
import { createNegotiation, createRenewalNegotiation, updateOffer, isRejected, finalizeContract, getRecommendedSalary } from "./game/contractEngine";
import { getEligibleCards, unlockCard, useFreezeCard, useTripleCard, executeStealSwap, emptyCards } from "./game/rewardCardEngine";
import { createRandomSeasonEvent, createVersusSeasonEvents, forcedPositiveEvent, forcedNegativeEvent, forcedMarketEvent, createEventChoiceOptions, forcedSpecificEvent, triggerFlorentinoPerezEvent, triggerBobPaisleyDisaster, triggerFastFoodAddiction, triggerBreakupSeason, triggerCasinoNight, triggerOneSeasonWonder, triggerYouTubeViral, triggerDreamSeason, triggerLockerRoomDrama, triggerEriksenHeartAttack, triggerDopingBan, triggerGirlsMagnet, triggerRacistAttack, triggerClubLegend, checkTournamentEvents, triggerWorldCup, triggerEuro, triggerChampionsLeague } from "./game/eventEngine";
import { createInvestorOffer, acceptInvestorOffer, rejectInvestorOffer } from "./game/investorOfferEngine";
import { createAuctionState, startBiddingPhase, placeBid as placeBidEngine, surrenderAuction, shouldAuctionEnd, finishAuction, tickAuctionTimer, getAuctionStartNews } from "./game/auctionEngine";
import { autoSellAllPlayers, calculateNetWorth, resetSeasonChances } from "./game/economyEngine";
import { setupNewSeason, buildInitialState, getFirstTurn, validateGameStart } from "./game/gameSetup";
import { generateSponsorshipOffer, shouldReceiveSponsorshipOffer, addSponsorshipToPlayer, createSponsorshipNews } from "./game/sponsorshipEngine";
import { createTransferNews, createSaleNews, createFreezeCardNews, createTripleBuyNews, createStealCardNews, createGeneratedClassNews } from "./game/newsEngine";
import { shuffle, randomId, pickRandom } from "./game/helpers";
import { saveGame, loadGame, deleteSave, hasSave } from "./game/saveSystem";
import type { SaveData } from "./game/saveSystem";
import { singleCanNextSeason } from "./game/singleMode";
import { versusCanNextSeason } from "./game/versusMode";
import { FORMATION_433, GAME_END_SEASON, GAME_START_SEASON, BUDGET_SETTINGS, ALL_POSITIONS } from "./game/constants";
import {
  initializeLeagueSeason, playRound, isTransferMarketOpen, getUserNextFixture,
  isInTransferWindow, getTransferWindowChances, TOTAL_ROUNDS, getMatchPreview,
  getTopScorers, getTopAssists, getTopCleanSheets, getBestPlayerOfSeason, calculateUserStrength,
} from "./game/leagueEngine";
import type { LeagueState, MatchEvent, MatchPreview, LeaguePlayerStat } from "./game/leagueEngine";

const LEAGUE_MAX_PURCHASE_CHANCES = 14; // hard cap, club owner mode only — any bonus chances beyond this are ignored
const LEAGUE_REQUIRED_SQUAD_SIZE = 11;
const LEAGUE_FIXED_STARTING_BUDGET = 150; // stored in millions, matching BUDGET_SETTINGS scale (e.g. 30 = €30M)

// Components
import StartScreen from "./components/StartScreen";
import LeagueSelectionScreen, { type LeagueId } from "./components/LeagueSelectionScreen";
import TopBar from "./components/TopBar";
import Formation from "./components/Formation";
import TeamPanel from "./components/TeamPanel";
import NewsFeed from "./components/NewsFeed";
import PlayerSelectionModal from "./components/PlayerSelectionModal";
import ContractModal from "./components/ContractModal";
import OwnedPlayerModal from "./components/OwnedPlayerModal";
import RewardModal from "./components/RewardModal";
import EventChoiceModal from "./components/EventChoiceModal";
import InvestorOfferModal from "./components/InvestorOfferModal";
import AuctionModal from "./components/AuctionModal";
import StatisticsModal from "./components/StatisticsModal";
import EndGameModal from "./components/EndGameModal";
import DeveloperPanel from "./components/DeveloperPanel";
import HowToPlayModal from "./components/HowToPlayModal";
import LeagueStandings from "./components/LeagueStandings";
import OtherLeaguesModal from "./components/OtherLeaguesModal";
import MatchSummaryModal from "./components/MatchSummaryModal";
import MatchPreviewModal from "./components/MatchPreviewModal";
import LeagueStatsModal from "./components/LeagueStatsModal";
import LeagueChampionAnimation from "./components/LeagueChampionAnimation";
import { FlorentinoEntrance, AclInjuryAnimation, SaudiOfferAnimation, GoatSigningAnimation, GoldenBootAnimation, BallonDorAnimation, FastFoodAnimation, YouTubeViralAnimation, GoldenBoyAnimation, RecordTransferAnimation, WonderkidAnimation, BobPaisleyAnimation, HotMarketAnimation, OneSeasonWonderAnimation, CasinoNightAnimation, MarketCrashAnimation, FailedTransferAnimation, BenchWarmerAnimation, BreakupSeasonAnimation, FreeTransferAnimation, MajorInjuryAnimation, EriksenAnimation, DopingBanAnimation, GirlsMagnetAnimation, RacistAttackAnimation, ClubLegendAnimation, KonamiCodeAnimation, WorldCupAnimation, EuroAnimation, ChampionsLeagueAnimation } from "./animations/index";

// ============================================
// MAIN GAME PAGE
// ============================================

export default function Home() {
  // ── Game config ──────────────────────────
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState<GameMode>("single");
  const [gameLengthMode, setGameLengthMode] = useState<"classic" | "infinite">("classic");
  const [budgetMode, setBudgetMode] = useState<BudgetMode>("balanced");
  const [eventsEnabled, setEventsEnabled] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState<number | null>(15);
  const [negativeBudgetEndsGame, setNegativeBudgetEndsGame] = useState(true);

  // ── Game state ────────────────────────────
  const [season, setSeason] = useState(GAME_START_SEASON);
  const [turnIndex, setTurnIndex] = useState(0);
  const [gamePlayers, setGamePlayers] = useState<GamePlayer[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [seasonEvent, setSeasonEvent] = useState<SeasonEvent | null>(null);

  // ── Player pools ──────────────────────────
  const [basePlayers, setBasePlayers] = useState<Player[]>([]);
  const [easterUnlocked, setEasterUnlocked] = useState<boolean>(() => {
    try { return localStorage.getItem("fi_easter_unlocked") === "1"; } catch { return false; }
  });
  const [generatedBySeason, setGeneratedBySeason] = useState<Record<number, Player[]>>({});

  // ── UI state ──────────────────────────────
  const [selectedSlot, setSelectedSlot] = useState("");
  const [pendingSlot, setPendingSlot] = useState<string | null>(null);
  const [timer, setTimer] = useState(15);
  const [timerActive, setTimerActive] = useState(false);
  const [message, setMessage] = useState("");
  const [seasonSecretClicks, setSeasonSecretClicks] = useState(0);
  const [showDeveloperPanel, setShowDeveloperPanel] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showFlorentinoAnim, setShowFlorentinoAnim] = useState(false);
  const [showAclAnim, setShowAclAnim] = useState(false);
  const [showSaudiAnim, setShowSaudiAnim] = useState(false);
  const [showGoldenBootAnim, setShowGoldenBootAnim] = useState(false);
  const [showBallonDorAnim, setShowBallonDorAnim] = useState(false);
  const [showFastFoodAnim, setShowFastFoodAnim] = useState(false);
  const [showYouTubeAnim, setShowYouTubeAnim] = useState(false);
  const [showGoldenBoyAnim, setShowGoldenBoyAnim] = useState(false);
  const [showRecordTransferAnim, setShowRecordTransferAnim] = useState(false);
  const [showWonderkidAnim, setShowWonderkidAnim] = useState(false);
  const [showBobPaisleyAnim, setShowBobPaisleyAnim] = useState(false);
  const [showHotMarketAnim, setShowHotMarketAnim] = useState(false);
  const [showOneSeasonWonderAnim, setShowOneSeasonWonderAnim] = useState(false);
  const [showCasinoNightAnim, setShowCasinoNightAnim] = useState(false);
  const [showMarketCrashAnim, setShowMarketCrashAnim] = useState(false);
  const [showFailedTransferAnim, setShowFailedTransferAnim] = useState(false);
  const [showBenchWarmerAnim, setShowBenchWarmerAnim] = useState(false);
  const [showBreakupSeasonAnim, setShowBreakupSeasonAnim] = useState(false);
  const [showFreeTransferAnim, setShowFreeTransferAnim] = useState(false);
  const [showMajorInjuryAnim, setShowMajorInjuryAnim] = useState(false);
  const [showEriksenAnim, setShowEriksenAnim] = useState(false);
  const [showDopingBanAnim, setShowDopingBanAnim] = useState(false);
  const [showGirlsMagnetAnim, setShowGirlsMagnetAnim] = useState(false);
  const [showRacistAttackAnim, setShowRacistAttackAnim] = useState(false);
  const [showClubLegendAnim, setShowClubLegendAnim] = useState(false);
  const [goatSignedPlayer, setGoatSignedPlayer] = useState<string | null>(null);
  const [showWorldCupAnim, setShowWorldCupAnim] = useState(false);
  const [showEuroAnim, setShowEuroAnim] = useState(false);
  const [showChampionsLeagueAnim, setShowChampionsLeagueAnim] = useState(false);
  const [tournamentNationality, setTournamentNationality] = useState<string>("");
  const [devSeasonUnlocked, setDevSeasonUnlocked] = useState(false);
  const [devSeasonClicks, setDevSeasonClicks] = useState(0);
  const [singlePlayerStyle, setSinglePlayerStyle] = useState<"investor" | "clubOwner">("investor");
  const [showLeagueSelection, setShowLeagueSelection] = useState(false);
  const [pendingConfig, setPendingConfig] = useState<{
    mode: GameMode; singlePlayerStyle?: "investor" | "clubOwner"; budgetMode: BudgetMode;
    team1Name: string; team2Name: string; eventsEnabled: boolean; eventType: EventType;
    timerSeconds: number | null; gameLengthMode: "classic" | "infinite";
    negativeBudgetEndsGame: boolean; easterUnlocked: boolean;
  } | null>(null);
  const [selectedLeagueId, setSelectedLeagueId] = useState<LeagueId>("premier_league");
  const [selectedClubName, setSelectedClubName] = useState<string | null>(null);

  // ── 18-Team Domestic League (Single Mode Beta) ──
  const [leagueState, setLeagueState] = useState<LeagueState | null>(null);
  const [otherLeagues, setOtherLeagues] = useState<Record<string, LeagueState>>({});
  const [showOtherLeagues, setShowOtherLeagues] = useState(false);
  const leagueTotalRounds = leagueState?.totalRounds ?? (selectedLeagueId === "bundesliga" || selectedLeagueId === "ligue_1" ? 34 : 38);
  const leagueNameMap: Record<string, string> = {
    premier_league: "Premier League",
    bundesliga: "Bundesliga",
    la_liga: "La Liga",
    serie_a: "Serie A",
    ligue_1: "Ligue 1",
    saudi_league: "Saudi Pro League",
    portuguese_league: "Primeira Liga",
    eredivisie: "Eredivisie",
    super_lig: "Süper Lig",
  };
  const leagueLogoMap: Record<string, string> = {
    premier_league: "/images/league-premier.png",
    bundesliga: "/images/league-bundesliga.png",
    la_liga: "/images/league-laliga.png",
    serie_a: "/images/league-seriea.png",
    ligue_1: "/images/league-ligue1.png",
    saudi_league: "/images/league-saudi.png",
    portuguese_league: "/images/league-portugal.png",
    eredivisie: "/images/league-eredivisie.png",
    super_lig: "/images/league-superlig.png",
  };
  const [leagueEnabled, setLeagueEnabled] = useState(false); // toggled true once user starts a league season
  const [matchSummary, setMatchSummary] = useState<{
    round: number;
    userTeamName: string;
    opponentName: string;
    userIsHome: boolean;
    homeGoals: number;
    awayGoals: number;
    events: MatchEvent[];
  } | null>(null);
  const [matchPreview, setMatchPreview] = useState<MatchPreview | null>(null);
  const [showLeagueStats, setShowLeagueStats] = useState(false);
  const [leagueChampionAnim, setLeagueChampionAnim] = useState<{
    championName: string;
    isUserChampion: boolean;
    bestPlayerName: string | null;
    bestPlayerTeam: string | null;
    bestPlayerGoals: number;
    bestPlayerAssists: number;
  } | null>(null);

  // ── Konami Code ───────────────────────────
  const [showKonamiAnim, setShowKonamiAnim] = useState(false);
  const [konamiUsed, setKonamiUsed] = useState(false);
  const konamiSequence = useRef<string[]>([]);
  const KONAMI_CODE = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight"];

  // ── Modals ────────────────────────────────
  const [negotiation, setNegotiation] = useState<ContractNegotiation | null>(null);
  const [selectedOwned, setSelectedOwned] = useState<{ playerIndex: number; ownedIndex: number } | null>(null);
  const [rewardChoice, setRewardChoice] = useState<RewardChoice | null>(null);
  const [stealChallenge, setStealChallenge] = useState<StealChallenge | null>(null);
  const [eventChoice, setEventChoice] = useState<{ option1: SeasonEventType; option2: SeasonEventType; playerIndex: number } | null>(null);
  const [investorOffer, setInvestorOffer] = useState<InvestorOfferState | null>(null);
  const [auctionState, setAuctionState] = useState<AuctionState | null>(null);

  // ── Derived ───────────────────────────────
  const activePlayerIndex = mode === "versus" ? turnIndex : 0;
  const activePlayer = gamePlayers[activePlayerIndex];
  const isFrozen = activePlayer?.frozenSeason === season;

  const marketMultiplier = 1; // القيم تتحدث مباشرة في currentValue بدل multiplier

  // ── All players pool ─────────────────────
  const allPlayers = useMemo<Player[]>(() => {
    const base = easterUnlocked ? [...basePlayers, ...getSecretPlayers()] : basePlayers;
    const gen = Object.values(generatedBySeason).flat();
    return [...base, ...gen];
  }, [basePlayers, easterUnlocked, generatedBySeason]);

  // ── Options for selected slot ─────────────
  const slotOptions = useMemo<Player[]>(() => {
    if (!selectedSlot) return [];
    const ownedNames = new Set(gamePlayers.flatMap((gp) => gp.owned.map((o) => o.player.name)));

    // GOAT لهذا الموسم فقط لو easter unlocked وموقعه يطابق الـ slot المختار
    const goatForSeason = easterUnlocked
      ? getSecretPlayers().find(p =>
          p.availableSeason === season &&
          p.position === selectedSlot &&          // ← position filter
          !ownedNames.has(p.name)
        )
      : null;

    // اللاعبون العاديون فقط (بدون secret)
    const normalPool = allPlayers.filter(
      (p) => p.position === selectedSlot &&
             p.availableSeason === season &&
             !ownedNames.has(p.name) &&
             !p.secret                            // ← exclude GOATs from normal pool
    );
    const picked = shuffle(normalPool).slice(0, goatForSeason ? 4 : 5);
    const budget = gamePlayers[activePlayerIndex]?.budget ?? 0;
    const withGuarantee =
      mode === "single" && singlePlayerStyle === "clubOwner"
        ? applyLeaguePricing(picked, season)
        : guaranteeAffordablePlayer(picked, budget, season);

    // أضف GOAT في المنتصف (index 2) فقط لو موجود
    if (goatForSeason) {
      const result = [...withGuarantee];
      result.splice(2, 0, goatForSeason);
      return result.slice(0, 5);
    }

    return withGuarantee;
  }, [selectedSlot, season, gamePlayers, allPlayers, activePlayerIndex, easterUnlocked, mode, singlePlayerStyle]);

  // ── Init base players ─────────────────────
  useEffect(() => {
    if (basePlayers.length > 0) return;
    setBasePlayers(buildAllBasePlayers());
  }, [basePlayers.length]);





  // ── Generate infinite mode players ────────
  useEffect(() => {
    if (gameLengthMode !== "infinite" || season <= 2028) return;
    if (generatedBySeason[season]) return;
    const pool = generateSeasonPlayerPool(season);
    setGeneratedBySeason((prev) => ({ ...prev, [season]: pool }));
    addNewsItems([createGeneratedClassNews(season)]);
  }, [season, gameLengthMode]);

  // ── Timer countdown ───────────────────────
  useEffect(() => {
    if (!started || !timerActive || !selectedSlot || timerSeconds === null || showEndModal) return;
    if (timer <= 0) { autoPick(); return; }
    const t = setTimeout(() => setTimer((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, timerActive, selectedSlot, started, showEndModal]);

  // ── Auction timer ─────────────────────────
  useEffect(() => {
    if (!auctionState) return;
    if (auctionState.timer <= 0) {
      if (auctionState.phase === "preview") {
        setAuctionState(startBiddingPhase(auctionState, season, gamePlayers));
        return;
      }
      if (auctionState.phase === "bidding") {
        handleFinishAuction();
        return;
      }
    }
    if (shouldAuctionEnd(auctionState, gamePlayers.length)) {
      handleFinishAuction();
      return;
    }
    const t = setTimeout(() => setAuctionState((prev) => prev ? tickAuctionTimer(prev) : prev), 1000);
    return () => clearTimeout(t);
  }, [auctionState]);

  // ── Contract timer ────────────────────────
  useEffect(() => {
    if (!negotiation) return;
    if (negotiation.timer <= 0) {
      notify("⏰ Negotiation timed out — chance lost");
      spendPurchaseChance(activePlayerIndex);
      setNegotiation(null);
      return;
    }
    const t = setTimeout(() => {
      setNegotiation((prev) => prev ? { ...prev, timer: prev.timer - 1 } : prev);
    }, 1000);
    return () => clearTimeout(t);
  }, [negotiation?.timer]);

  // ── Konami Code Listener ─────────────────────
  useEffect(() => {
    if (!started || mode !== "single" || konamiUsed) return;

    function handleKeyDown(e: KeyboardEvent) {
      const arrowKeys = ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"];
      if (!arrowKeys.includes(e.key)) return;
      konamiSequence.current = [...konamiSequence.current, e.key].slice(-8);
      if (konamiSequence.current.join(",") === KONAMI_CODE.join(",")) {
        konamiSequence.current = [];
        e.preventDefault();
        setShowKonamiAnim(true);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [started, mode, konamiUsed]);

  // ── Enter / Space Shortcut ───────────────────
  // Press 1: Next Game, Press 2: Start Game (MatchPreview), Press 3: Close modal
  useEffect(() => {
    if (!started || mode !== "single" || singlePlayerStyle !== "clubOwner") return;

    function handleShortcut(e: KeyboardEvent) {
      if (e.key !== "Enter" && e.key !== " ") return;
      // Don't fire if user is typing in an input
      if ((e.target as HTMLElement).tagName === "INPUT" || (e.target as HTMLElement).tagName === "TEXTAREA") return;
      e.preventDefault();

      // If match preview modal is open → Start Game
      if (matchPreview) {
        confirmPlayLeagueGame();
        return;
      }

      // If match summary modal is open → close it
      if (matchSummary) {
        setMatchSummary(null);
        return;
      }

      // Otherwise → Next Game / Start Season / Next Season
      handleMainSeasonButtonClick();
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [started, mode, singlePlayerStyle, matchPreview, matchSummary, leagueState, leagueEnabled]);

  // ============================================
  // HELPERS
  // ============================================

  function notify(text: string) {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  }

  // ── Save / Load ───────────────────────────
  function handleSave() {
    const data: SaveData = {
      version: 1,
      savedAt: new Date().toISOString(),
      season, turnIndex, mode, gameLengthMode,
      budgetMode, eventsEnabled, eventType: "all",
      timerSeconds, negativeBudgetEndsGame,
      gamePlayers, news: news.slice(-30), // آخر 30 خبر فقط
      seasonEvent,
    };
    saveGame(data);
    notify("💾 Game saved!");
  }

  function handleLoadSave() {
    const data = loadGame();
    if (!data) return notify("No save found");
    setSeason(data.season);
    setTurnIndex(data.turnIndex);
    setMode(data.mode);
    setGameLengthMode(data.gameLengthMode);
    setBudgetMode(data.budgetMode as any);
    setEventsEnabled(data.eventsEnabled);
    setTimerSeconds(data.timerSeconds);
    setNegativeBudgetEndsGame(data.negativeBudgetEndsGame);
    setGamePlayers(data.gamePlayers);
    setNews(data.news ?? []);
    setSeasonEvent(data.seasonEvent);
    setStarted(true);
    notify("✅ Game loaded!");
  }

  function addNewsItems(items: NewsItem[]) {
    setNews((prev) => [...items, ...prev]);
  }

  function addNewsItem(item: NewsItem) {
    setNews((prev) => [item, ...prev]);
  }

  function spendPurchaseChance(playerIndex: number) {
    setGamePlayers((prev) =>
      prev.map((gp, i) =>
        i === playerIndex ? { ...gp, purchaseChances: gp.purchaseChances - 1 } : gp
      )
    );
  }

  function currentValue(player: Player): number {
    return getCurrentValue(player, season, marketMultiplier);
  }

  function getOwnedItem(playerIndex: number, ownedIndex: number): OwnedPlayer | null {
    return gamePlayers[playerIndex]?.owned[ownedIndex] ?? null;
  }

  // ============================================
  // START GAME
  // ============================================

  function startGame(config: {
    mode: GameMode; singlePlayerStyle?: "investor" | "clubOwner"; budgetMode: BudgetMode; team1Name: string; team2Name: string;
    eventsEnabled: boolean; eventType: EventType; timerSeconds: number | null;
    gameLengthMode: "classic" | "infinite"; negativeBudgetEndsGame: boolean; easterUnlocked: boolean;
  }) {
    setMode(config.mode);
    setSinglePlayerStyle(config.singlePlayerStyle ?? "investor");
    // Club Owner: show league selection screen before starting
    if (config.mode === "single" && config.singlePlayerStyle === "clubOwner") {
      // Store config temporarily and show league selection
      setPendingConfig(config);
      setShowLeagueSelection(true);
      return;
    }
    setBudgetMode(config.budgetMode);
    setGameLengthMode(config.gameLengthMode);
    setEventsEnabled(config.eventsEnabled);
    setTimerSeconds(config.timerSeconds);
    setNegativeBudgetEndsGame(config.negativeBudgetEndsGame);
    if (config.easterUnlocked) setEasterUnlocked(true);
    if (config.timerSeconds !== null) setTimer(config.timerSeconds);

    // AI mode uses "versus" internally but with AI as player 2
    const { gamePlayers: gps, news: startNews } = buildInitialState(
      config.budgetMode, config.team1Name, config.team2Name, config.mode
    );

    // Club Owner mode always starts with a fixed budget and the full purchase-chance cap
    const finalGps =
      config.mode === "single" && config.singlePlayerStyle === "clubOwner"
        ? gps.map(gp => ({
            ...gp,
            budget: LEAGUE_FIXED_STARTING_BUDGET,
            purchaseChances: LEAGUE_MAX_PURCHASE_CHANCES,
          }))
        : gps;

    setGamePlayers(finalGps);
    setNews(startNews);
    setSeason(GAME_START_SEASON);
    setTurnIndex(getFirstTurn(config.mode));
    setSeasonEvent(null);
    setStarted(true);
  }

  // ============================================
  // CONTINUE START GAME (after league/club selection)
  // ============================================

  function continueStartGame(config: {
    mode: GameMode; singlePlayerStyle?: "investor" | "clubOwner"; budgetMode: BudgetMode;
    team1Name: string; team2Name: string; eventsEnabled: boolean; eventType: EventType;
    timerSeconds: number | null; gameLengthMode: "classic" | "infinite";
    negativeBudgetEndsGame: boolean; easterUnlocked: boolean;
  }, clubName: string, leagueBudget: number) {
    setBudgetMode(config.budgetMode);
    setGameLengthMode(config.gameLengthMode);
    setEventsEnabled(config.eventsEnabled);
    setTimerSeconds(config.timerSeconds);
    setNegativeBudgetEndsGame(config.negativeBudgetEndsGame);
    if (config.easterUnlocked) setEasterUnlocked(true);
    if (config.timerSeconds !== null) setTimer(config.timerSeconds);

    const { gamePlayers: gps, news: startNews } = buildInitialState(
      config.budgetMode, clubName, config.team2Name, config.mode
    );

    // Use the league budget for the selected league
    const finalGps = gps.map(gp => ({
      ...gp,
      name: clubName,
      budget: leagueBudget,
      purchaseChances: LEAGUE_MAX_PURCHASE_CHANCES,
    }));

    setGamePlayers(finalGps);
    setNews(startNews);
    setSeason(GAME_START_SEASON);
    setTurnIndex(getFirstTurn(config.mode));
    setSeasonEvent(null);
    setStarted(true);
  }

  // ============================================
  // SLOT SELECTION
  // ============================================

  function handleSlotClick(slot: string) {
    if (isFrozen) return notify("🧊 You are frozen this season");
    if (mode === "single" && leagueEnabled && leagueState && !isTransferMarketOpen(leagueState)) {
      return notify("🔒 Transfer market is closed during the league season (opens Rounds 18-21)");
    }
    if (!activePlayer || activePlayer.purchaseChances <= 0) return notify("No purchase chances remaining");
    if (pendingSlot && pendingSlot !== slot) return notify("Finish current selection first");
    if (activePlayer.owned.find((o) => o.slot === slot)) return;

    setSelectedOwned(null);
    setPendingSlot(slot);
    setSelectedSlot(slot);
    if (timerSeconds !== null) { setTimer(timerSeconds); setTimerActive(true); }
  }

  function closePlayerSelection() {
    setSelectedSlot("");
    setTimerActive(false);
    // In single mode, closing without buying should clear the pendingSlot
    // (the purchase chance was not spent, slot returns to available)
    if (mode === "single") {
      setPendingSlot(null);
    }
  }

  // ============================================
  // BUY PLAYER → START CONTRACT NEGOTIATION
  // ============================================

  function handleBuyPlayer(player: Player) {
    const gp = gamePlayers[activePlayerIndex];
    if (!gp || isFrozen) return;
    if (gp.purchaseChances <= 0) return notify("No purchase chances remaining");

    const value = currentValue(player);
    if (gp.budget < value) return notify("Insufficient budget");

    const neg = createNegotiation(player, selectedSlot, value);
    setNegotiation(neg);
    setSelectedSlot("");
    setTimerActive(false);
  }

  function handleContractUpdate(neg: ContractNegotiation) {
    setNegotiation(neg);
  }

  function handleContractSign() {
    if (!negotiation) return;
    if (isRejected(negotiation)) return notify("Player rejected the offer");

    const gp = gamePlayers[activePlayerIndex];
    const contract = finalizeContract(negotiation, season);
    const value = currentValue(negotiation.player);

    // Renewal: update contract only, no budget deduction
    if (negotiation.isRenewal) {
      const updatedPlayers = gamePlayers.map((p, i) => {
        if (i !== activePlayerIndex) return p;
        return {
          ...p,
          budget: p.budget - contract.salary,
          owned: p.owned.map((o) =>
            o.slot === negotiation.slot
              ? {
                  ...o,
                  contract,
                  // حذف Casino effect بعد التجديد الناجح
                  activeEffects: (o.activeEffects ?? []).filter(e => e.id !== "casino"),
                }
              : o
          ),
        };
      });
      setGamePlayers(updatedPlayers);
      addNewsItem({
        id: Date.now(),
        season,
        title: `📝 Contract Renewed — ${negotiation.player.name}`,
        description: `${negotiation.player.name} signed a new ${contract.duration}-year deal. Salary: €${contract.salary}M/yr`,
        tone: "good",
      });
      setNegotiation(null);
      notify(`✅ ${negotiation.player.name} contract renewed!`);
      return;
    }

    if (gp.budget < value) return notify("Insufficient budget");

    // Zero out stats for the buy season — player just joined, no stats yet
    const playerWithZeroFirstSeason: typeof negotiation.player = {
      ...negotiation.player,
      statsBySeason: {
        ...(negotiation.player.statsBySeason ?? {}),
        [season]: {
          ...(negotiation.player.statsBySeason?.[season] ?? {}),
          season,
          games: 0,
          goals: 0,
          assists: 0,
          cleanSheets: 0,
          yellowCards: 0,
          redCards: 0,
          rating: negotiation.player.statsBySeason?.[season]?.rating ?? 70,
          value,
        },
      },
    };

    const newOwned: OwnedPlayer = {
      player: playerWithZeroFirstSeason,
      slot: negotiation.slot,
      buySeason: season,
      buyPrice: value,
      currentValue: value,
      budgetAtBuy: gp.budget,
      contract,
      sponsorships: [],
    };

    const updatedPlayers = gamePlayers.map((p, i) => {
      if (i !== activePlayerIndex) return p;
      return {
        ...p,
        budget: p.budget - value,
        purchaseChances: p.purchaseChances - 1,
        owned: [...p.owned.filter((o) => o.slot !== negotiation.slot), newOwned],
      };
    });

    setGamePlayers(updatedPlayers);
    addNewsItem(createTransferNews(season, negotiation.player.name, gp.name, value, contract));
    setNegotiation(null);
    setPendingSlot(null);
    notify(`✅ ${negotiation.player.name} signed!`);

    // GOAT animation — fires for secret/easter egg players
    if (negotiation.player.secret) {
      setTimeout(() => setGoatSignedPlayer(negotiation.player.name), 300);
    }

    // Check sponsorship
    if (shouldReceiveSponsorshipOffer(value)) {
      const sponsorship = generateSponsorshipOffer(value, season);
      const afterSponsorship = addSponsorshipToPlayer(
        updatedPlayers[activePlayerIndex], negotiation.player.name, sponsorship
      );
      setGamePlayers((prev) => prev.map((gp2, i) => i === activePlayerIndex ? afterSponsorship : gp2));
      addNewsItem(createSponsorshipNews(season, negotiation.player.name, gp.name, sponsorship));
    }

    if (mode === "versus") endVersusTurn(updatedPlayers);
  }

  function handleContractCancel() {
    spendPurchaseChance(activePlayerIndex);
    setPendingSlot(null);
    setNegotiation(null);
    notify("Contract cancelled — chance spent");
    if (mode === "versus") endVersusTurn();
  }

  // ============================================
  // SELL PLAYER
  // ============================================

  function handleSellPlayer() {
    if (!selectedOwned) return;
    if (mode === "single" && leagueEnabled && leagueState && !isTransferMarketOpen(leagueState)) {
      return notify("🔒 Transfer market is closed during the league season (opens Rounds 18-21)");
    }
    const { playerIndex, ownedIndex } = selectedOwned;
    const gp = gamePlayers[playerIndex];
    const item = gp.owned[ownedIndex];
    if (!item) return;

    const sellPrice = (item.currentValue && item.currentValue > 0)
      ? item.currentValue
      : item.buyPrice;
    const profit = sellPrice - item.buyPrice;

    const updatedPlayers = gamePlayers.map((p, i) => {
      if (i !== playerIndex) return p;
      const extraChance = p.soldBonusUsedThisSeason ? 0 : 1;
      const rawNewChances = p.purchaseChances + extraChance;
      const cappedChances =
        mode === "single" && singlePlayerStyle === "clubOwner"
          ? Math.min(rawNewChances, LEAGUE_MAX_PURCHASE_CHANCES)
          : rawNewChances;
      return {
        ...p,
        budget: p.budget + sellPrice,
        purchaseChances: cappedChances,
        soldBonusUsedThisSeason: true,
        owned: p.owned.filter((_, idx) => idx !== ownedIndex),
        sold: [{
          owner: p.name, name: item.player.name, buySeason: item.buySeason,
          sellSeason: season, buyPrice: item.buyPrice, sellPrice, profit,
          position: item.player.position,
        }, ...p.sold],
      };
    });

    setGamePlayers(updatedPlayers);
    setSelectedOwned(null);
    addNewsItem(createSaleNews(season, item.player.name, gp.name, sellPrice, profit));
    notify(`💰 ${item.player.name} sold for €${sellPrice}M`);

    // Reward cards — فقط في طور versus
    if (mode === "versus") {
      const eligibleCards = getEligibleCards(gp, sellPrice);
      if (eligibleCards.length > 0) {
        setRewardChoice({ playerIndex, cards: eligibleCards });
      }
    }
  }

  function handleKeepPlayer() {
    setSelectedOwned(null);
  }

  function handleRenewPlayer() {
    if (!selectedOwned) return;
    const { playerIndex, ownedIndex } = selectedOwned;
    const gp = gamePlayers[playerIndex];
    const item = gp.owned[ownedIndex];
    if (!item) return;
    const value = item.currentValue ?? currentValue(item.player);
    const renewal = createRenewalNegotiation(item, value);

    // Casino Night — يرفع متطلبات الراتب
    const casinoEffect = (item.activeEffects ?? []).find(e => e.id === "casino");
    if (casinoEffect?.salaryDemandMultiplier) {
      const boostedSalary = Math.round(renewal.requiredSalary * casinoEffect.salaryDemandMultiplier);
      renewal.requiredSalary = boostedSalary;
      renewal.playerCounterMessage = `🎰 I was at the casino last night... I need €${boostedSalary}M/yr now.`;
    }

    // Club Legend — يقبل أي عرض
    if (item.isClubLegend) {
      renewal.requiredSalary = 1;
      renewal.satisfaction = 100;
      renewal.playerCounterMessage = `👑 It is an honor to stay. I accept any offer you give.`;
    }

    setNegotiation(renewal);
    setSelectedOwned(null);
  }

  // ============================================
  // REWARD CARDS
  // ============================================

  function handleChooseReward(card: RewardCard) {
    if (!rewardChoice) return;
    const updated = unlockCard(gamePlayers[rewardChoice.playerIndex], card);
    setGamePlayers((prev) => prev.map((gp, i) => i === rewardChoice.playerIndex ? updated : gp));
    setRewardChoice(null);
    notify(`🎴 ${card} card unlocked!`);
  }

  function handleUseCard(playerIndex: number, card: RewardCard) {
    if (card === "freeze") {
      if (mode !== "versus") return notify("Freeze card only works in versus mode");
      const updated = useFreezeCard(gamePlayers, playerIndex, season);
      setGamePlayers(updated);
      const enemyIndex = playerIndex === 0 ? 1 : 0;
      addNewsItem(createFreezeCardNews(season, gamePlayers[playerIndex].name, gamePlayers[enemyIndex].name));
      notify("🧊 Opponent frozen next season!");
    }
    if (card === "triple") {
      const updated = useTripleCard(gamePlayers, playerIndex);
      setGamePlayers(updated);
      addNewsItem(createTripleBuyNews(season, gamePlayers[playerIndex].name));
      notify("⚡ Triple buy activated for next season!");
    }
    if (card === "steal") {
      if (mode !== "versus") return notify("Steal card only works in versus mode");
      setGamePlayers((prev) => prev.map((gp, i) =>
        i === playerIndex ? { ...gp, cards: { ...gp.cards, steal: { unlocked: true, used: true, cooldownUntil: null } } } : gp
      ));
      setStealChallenge({ userIndex: playerIndex, success: false, ownIndex: null, enemyIndex: null });
    }
  }

  function handleStealSwap() {
    if (!stealChallenge || stealChallenge.ownIndex === null || stealChallenge.enemyIndex === null) return;
    const updated = executeStealSwap(gamePlayers, stealChallenge.userIndex, stealChallenge.ownIndex, stealChallenge.enemyIndex);
    const enemyIndex = stealChallenge.userIndex === 0 ? 1 : 0;
    const playerGiven = gamePlayers[stealChallenge.userIndex].owned[stealChallenge.ownIndex]?.player.name ?? "";
    const playerReceived = gamePlayers[enemyIndex].owned[stealChallenge.enemyIndex]?.player.name ?? "";
    setGamePlayers(updated);
    addNewsItem(createStealCardNews(season, gamePlayers[stealChallenge.userIndex].name, playerGiven, playerReceived));
    setStealChallenge(null);
    notify("🕵️ Players swapped!");
  }

  // ============================================
  // EVENT CHOICE
  // ============================================

  function handleEventChoice(event: SeasonEventType) {
    setEventChoice(null);
    notify(`✨ ${event.title} applied!`);
  }

  // ============================================
  // INVESTOR OFFER
  // ============================================

  function triggerInvestorOffer() {
    const offer = createInvestorOffer(allPlayers, season, gamePlayers);
    if (!offer) return;
    setInvestorOffer(offer);
  }

  function handleAcceptOffer() {
    if (!investorOffer) return;
    const { updatedPlayers, newsItem } = acceptInvestorOffer(investorOffer, gamePlayers, activePlayerIndex, season);
    setGamePlayers(updatedPlayers);
    addNewsItem(newsItem);
    setInvestorOffer(null);
    notify(`✅ Offer accepted!`);
  }

  function handleRejectOffer() {
    if (!investorOffer) return;
    addNewsItem(rejectInvestorOffer(investorOffer, season));
    setInvestorOffer(null);
    notify("Offer rejected");
  }

  // ============================================
  // AUCTION
  // ============================================

  function triggerLegendaryAuction() {
    // المزايدات فقط في versus وai
    if (mode === "single") return;
    const state = createAuctionState(allPlayers, season, gamePlayers);
    if (!state) return notify("No auction players available");
    setAuctionState(state);
    addNewsItem(getAuctionStartNews(season));
  }

  function handleBid(playerIndex: number) {
    if (!auctionState) return;
    const gp = gamePlayers[playerIndex];
    const nextBid = auctionState.currentBid + 5;
    if (gp.budget < nextBid) return notify("Insufficient budget");
    setAuctionState(placeBidEngine(auctionState, playerIndex));
  }

  function handleSurrender(playerIndex: number) {
    if (!auctionState) return;
    setAuctionState(surrenderAuction(auctionState, playerIndex));
  }

  function handleFinishAuction() {
    if (!auctionState) return;
    const { updatedPlayers, newsItem } = finishAuction(auctionState, gamePlayers, season);
    setGamePlayers(updatedPlayers);
    addNewsItem(newsItem);
    setAuctionState(null);
  }

  // ============================================
  // DEVELOPER PANEL
  // ============================================

  function handleSeasonClick() {
    const next = seasonSecretClicks + 1;
    setSeasonSecretClicks(next);
    if (next >= 20) { setShowDeveloperPanel(true); setSeasonSecretClicks(0); }
  }

  function handleDevEvent(eventId: DevEventId) {
    if (eventId === "legendaryAuction") { triggerLegendaryAuction(); return; }
    if (eventId === "florentinoPerez") {
      const result = triggerFlorentinoPerezEvent(gamePlayers, activePlayerIndex, season);
      setGamePlayers(result.updatedPlayers);
      addNewsItems(result.newsItems);
      setShowFlorentinoAnim(true);
      return;
    }
    if (eventId === "bobPaisleyDisaster") {
      const result = triggerBobPaisleyDisaster(gamePlayers, activePlayerIndex, season);
      setGamePlayers(result.updatedPlayers);
      addNewsItems(result.newsItems);
      setShowBobPaisleyAnim(true);
      return;
    }
    if (eventId === "fastFoodAddiction") {
      const result = triggerFastFoodAddiction(gamePlayers, activePlayerIndex, season);
      setGamePlayers(result.updatedPlayers);
      addNewsItems(result.newsItems);
      setShowFastFoodAnim(true);
      return;
    }
    if (eventId === "breakupSeason") {
      const result = triggerBreakupSeason(gamePlayers, activePlayerIndex, season);
      setGamePlayers(result.updatedPlayers);
      addNewsItems(result.newsItems);
      setShowBreakupSeasonAnim(true);
      return;
    }
    if (eventId === "casinoNight") {
      const result = triggerCasinoNight(gamePlayers, activePlayerIndex, season);
      setGamePlayers(result.updatedPlayers);
      addNewsItems(result.newsItems);
      setShowCasinoNightAnim(true);
      return;
    }
    if (eventId === "oneSeasonWonder") {
      const result = triggerOneSeasonWonder(gamePlayers, activePlayerIndex, season);
      setGamePlayers(result.updatedPlayers);
      addNewsItems(result.newsItems);
      setShowOneSeasonWonderAnim(true);
      return;
    }
    if (eventId === "youTubeViral") {
      const result = triggerYouTubeViral(gamePlayers, activePlayerIndex, season);
      setGamePlayers(result.updatedPlayers);
      addNewsItems(result.newsItems);
      setShowYouTubeAnim(true);
      return;
    }
    if (eventId === "dreamSeason") {
      const result = triggerDreamSeason(gamePlayers, activePlayerIndex, season);
      setGamePlayers(result.updatedPlayers);
      addNewsItems(result.newsItems);
      return;
    }
    if (eventId === "lockerRoomDrama") {
      const result = triggerLockerRoomDrama(gamePlayers, activePlayerIndex, season);
      setGamePlayers(result.updatedPlayers);
      addNewsItems(result.newsItems);
      return;
    }
    if (eventId === "investorOffer") { triggerInvestorOffer(); return; }
    if (eventId === "sponsorshipOffer") {
      const gp = gamePlayers[activePlayerIndex];
      if (gp.owned.length === 0) return notify("No owned players");
      const item = pickRandom(gp.owned);
      const s = generateSponsorshipOffer(currentValue(item.player), season);
      const updated = addSponsorshipToPlayer(gp, item.player.name, s);
      setGamePlayers((prev) => prev.map((p, i) => i === activePlayerIndex ? updated : p));
      addNewsItem(createSponsorshipNews(season, item.player.name, gp.name, s));
      return;
    }
    if (["hotMarket", "marketCrash"].includes(eventId)) {
      const result = forcedMarketEvent(season, gamePlayers, eventId === "hotMarket");
      if (result.event) {
        setSeasonEvent(result.event);
        // طبّق التغيير الثابت على currentValue لكل اللاعبين
        const min = result.event.flatMarketChangeMin ?? (eventId === "hotMarket" ? 10 : -25);
        const max = result.event.flatMarketChangeMax ?? (eventId === "hotMarket" ? 25 : -10);
        setGamePlayers(prev => prev.map(gp => ({
          ...gp,
          owned: gp.owned.map(item => {
            const change = min + Math.random() * (max - min);
            const newVal = Math.max(1, Math.round((item.currentValue || item.buyPrice) + change));
            return { ...item, currentValue: newVal };
          }),
        })));
      }
      addNewsItems(result.newsItems);
      if (eventId === "hotMarket")   setShowHotMarketAnim(true);
      if (eventId === "marketCrash") setShowMarketCrashAnim(true);
      return;
    }
    const positive = ["ballonDor", "goldenBoy", "goldenBoot", "wonderkid", "saudiOffer", "recordTransfer"].includes(eventId);
    const result = forcedSpecificEvent(eventId, season, gamePlayers, activePlayerIndex);
    setGamePlayers(result.updatedPlayers);
    addNewsItems(result.newsItems);
    if (eventId === "aclInjury")   setShowAclAnim(true);
    if (eventId === "saudiOffer")  setShowSaudiAnim(true);
    if (eventId === "goldenBoot")  setShowGoldenBootAnim(true);
    if (eventId === "ballonDor")   setShowBallonDorAnim(true);
    if (eventId === "goldenBoy")   setShowGoldenBoyAnim(true);
    if (eventId === "recordTransfer") setShowRecordTransferAnim(true);
    if (eventId === "wonderkid")      setShowWonderkidAnim(true);
    if ((eventId as string) === "fastFoodAddiction") setShowFastFoodAnim(true);
    if ((eventId as string) === "youTubeViral") setShowYouTubeAnim(true);
    if (eventId === "failedTransfer") setShowFailedTransferAnim(true);
    if (eventId === "benchWarmer")    setShowBenchWarmerAnim(true);
    if (eventId === "freeTransfer")   setShowFreeTransferAnim(true);
    if (eventId === "majorInjury")         setShowMajorInjuryAnim(true);
    if (eventId === "eriksenHeartAttack") { const r = triggerEriksenHeartAttack(gamePlayers, activePlayerIndex, season); setGamePlayers(r.updatedPlayers); addNewsItems(r.newsItems); setShowEriksenAnim(true); return; }
    if (eventId === "dopingBan")          { const r = triggerDopingBan(gamePlayers, activePlayerIndex, season); setGamePlayers(r.updatedPlayers); addNewsItems(r.newsItems); setShowDopingBanAnim(true); return; }
    if (eventId === "girlsMagnet")        { const r = triggerGirlsMagnet(gamePlayers, activePlayerIndex, season); setGamePlayers(r.updatedPlayers); addNewsItems(r.newsItems); setShowGirlsMagnetAnim(true); return; }
    if (eventId === "racistAttack")       { const r = triggerRacistAttack(gamePlayers, activePlayerIndex, season); setGamePlayers(r.updatedPlayers); addNewsItems(r.newsItems); setShowRacistAttackAnim(true); return; }
    if (eventId === "clubLegend")         { const r = triggerClubLegend(gamePlayers, activePlayerIndex, season); setGamePlayers(r.updatedPlayers); addNewsItems(r.newsItems); setShowClubLegendAnim(true); return; }
    if (eventId === "worldCup") {
      const r = triggerWorldCup(gamePlayers, activePlayerIndex, season);
      setGamePlayers(r.updatedPlayers);
      if (r.newsItems.length > 0) addNewsItems(r.newsItems);
      const nat = r.newsItems[0]?.description.match(/with (.+?)!/)?.[1] ?? "";
      setTournamentNationality(nat);
      setShowWorldCupAnim(true);
      return;
    }
    if (eventId === "euro") {
      const r = triggerEuro(gamePlayers, activePlayerIndex, season);
      setGamePlayers(r.updatedPlayers);
      if (r.newsItems.length > 0) addNewsItems(r.newsItems);
      const nat = r.newsItems[0]?.description.match(/with (.+?)!/)?.[1] ?? "";
      setTournamentNationality(nat);
      setShowEuroAnim(true);
      return;
    }
    if (eventId === "championsLeague") {
      const r = triggerChampionsLeague(gamePlayers, activePlayerIndex, season);
      setGamePlayers(r.updatedPlayers);
      if (r.newsItems.length > 0) addNewsItems(r.newsItems);
      setShowChampionsLeagueAnim(true);
      return;
    }
  }

  // ============================================
  // AUTO PICK
  // ============================================

  function autoPick() {
    if (!selectedSlot || !activePlayer) return;
    const affordable = slotOptions.filter((p) => currentValue(p) <= activePlayer.budget);
    if (affordable.length === 0) {
      closePlayerSelection();
      setPendingSlot(null);
      if (mode === "versus") endVersusTurn();
      return;
    }
    handleBuyPlayer(pickRandom(affordable));
  }

  // ============================================
  // LEAGUE SYSTEM (18-Team Domestic League)
  // ============================================

  function handleStartLeagueSeason() {
    if (mode !== "single" || singlePlayerStyle !== "clubOwner") return;
    if (pendingSlot) return notify("Finish current player selection first");
    if (auctionState) return notify("An auction is in progress");
    if (investorOffer) return notify("An investor offer is pending");
    if (negotiation) return notify("A contract negotiation is in progress");

    const userGp = gamePlayers[0];
    if (!userGp || userGp.owned.length < LEAGUE_REQUIRED_SQUAD_SIZE) {
      return notify(
        `⚠️ You need a full starting XI (${LEAGUE_REQUIRED_SQUAD_SIZE} players) before starting the season. (${userGp?.owned.length ?? 0}/${LEAGUE_REQUIRED_SQUAD_SIZE})`
      );
    }
    const filledSlots = new Set(userGp.owned.map(o => o.slot));
    const missingPositions = ALL_POSITIONS.filter(pos => !filledSlots.has(pos));
    if (missingPositions.length > 0) {
      return notify(`⚠️ Missing positions: ${missingPositions.join(", ")}`);
    }

    const userTeamName = gamePlayers[0]?.name || "Your Team";
    const ownedPlayerNames = (gamePlayers[0]?.owned ?? []).map(o => o.player.name);
    const newLeague = initializeLeagueSeason(basePlayers, season, userTeamName, ownedPlayerNames, selectedLeagueId);
    // Mark as actively started (round 0 -> about to play round 1)
    setLeagueState({ ...newLeague, seasonPhase: "playing" });
    setLeagueEnabled(true);

    // Initialize other leagues (all except user's current league)
    const ALL_LEAGUE_IDS = ["premier_league", "bundesliga", "la_liga", "serie_a", "ligue_1"];
    const newOtherLeagues: Record<string, LeagueState> = {};
    for (const lid of ALL_LEAGUE_IDS) {
      if (lid === selectedLeagueId) continue;
      const otherLeague = initializeLeagueSeason(basePlayers, season, `AI_${lid}`, [], lid);
      newOtherLeagues[lid] = { ...otherLeague, seasonPhase: "playing" };
    }
    setOtherLeagues(newOtherLeagues);

    notify("🏆 Season has begun! Press Next Game to play Round 1.");
  }

  function handlePlayLeagueGame() {
    if (!leagueState || mode !== "single" || singlePlayerStyle !== "clubOwner") return;
    if (pendingSlot) return notify("Finish current player selection first");
    if (auctionState) return notify("An auction is in progress");
    if (investorOffer) return notify("An investor offer is pending");
    if (negotiation) return notify("A contract negotiation is in progress");

    const preview = getMatchPreview(leagueState, gamePlayers, 0, season);
    if (!preview) return notify("No upcoming fixture found");
    setMatchPreview(preview);
  }

  function confirmPlayLeagueGame() {
    if (!leagueState) return;
    setMatchPreview(null);

    const result = playRound(leagueState, gamePlayers, 0, season);
    setLeagueState(result.updatedLeague);
    let postRoundPlayers = result.updatedGamePlayers;
    if (result.newsItems.length > 0) addNewsItems(result.newsItems);

    // Simulate the same round in all other leagues
    if (Object.keys(otherLeagues).length > 0) {
      const updatedOtherLeagues: Record<string, LeagueState> = {};
      for (const [lid, otherLeague] of Object.entries(otherLeagues)) {
        if (otherLeague.seasonPhase === "finished") {
          updatedOtherLeagues[lid] = otherLeague;
          continue;
        }
        const otherResult = playRound(otherLeague, [{ name: `AI_${lid}`, budget: 0, owned: [], purchaseChances: 0, sellChances: 0 } as any], 0, season);
        updatedOtherLeagues[lid] = otherResult.updatedLeague;
      }
      setOtherLeagues(updatedOtherLeagues);
    }

    // Random season events can still fire during league rounds, but less often than
    // the normal investor mode between-season events (8% chance per round here).
    if (eventsEnabled && Math.random() < 0.08) {
      const randomEventResult = createRandomSeasonEvent(season, postRoundPlayers);
      postRoundPlayers = randomEventResult.updatedPlayers;
      if (randomEventResult.newsItems.length > 0) addNewsItems(randomEventResult.newsItems);
      if (randomEventResult.event) {
        setSeasonEvent(randomEventResult.event);
        notify(`✨ ${randomEventResult.event.title}`);
      }
      // Special full-screen animations — full list, matching the normal between-season flow exactly
      const leagueEventNews = randomEventResult.newsItems;
      if (leagueEventNews.some(n => n.title.includes("Florentino"))) {
        setTimeout(() => setShowFlorentinoAnim(true), 400);
      }
      if (leagueEventNews.some(n => n.title.includes("ACL"))) {
        setTimeout(() => setShowAclAnim(true), 400);
      }
      if (leagueEventNews.some(n => n.title.includes("Saudi"))) {
        setTimeout(() => setShowSaudiAnim(true), 400);
      }
      if (leagueEventNews.some(n => n.title.includes("Golden Boot"))) {
        setTimeout(() => setShowGoldenBootAnim(true), 400);
      }
      if (leagueEventNews.some(n => n.title.includes("Ballon"))) {
        setTimeout(() => setShowBallonDorAnim(true), 400);
      }
      if (leagueEventNews.some(n => n.title.includes("Golden Boy"))) {
        setTimeout(() => setShowGoldenBoyAnim(true), 400);
      }
      if (leagueEventNews.some(n => n.title.includes("Record Transfer"))) {
        setTimeout(() => setShowRecordTransferAnim(true), 400);
      }
      if (leagueEventNews.some(n => n.title.includes("Wonderkid"))) {
        setTimeout(() => setShowWonderkidAnim(true), 400);
      }
      if (leagueEventNews.some(n => n.title.includes("Bob Paisley") || n.title.includes("Paisley"))) {
        setTimeout(() => setShowBobPaisleyAnim(true), 400);
      }
      if (leagueEventNews.some(n => n.title.includes("Hot Market") || n.title.includes("Hot Transfer"))) {
        setTimeout(() => setShowHotMarketAnim(true), 400);
      }
      if (leagueEventNews.some(n => n.title.includes("Market Crash"))) {
        setTimeout(() => setShowMarketCrashAnim(true), 400);
      }
      if (leagueEventNews.some(n => n.title.includes("One Season Wonder"))) {
        setTimeout(() => setShowOneSeasonWonderAnim(true), 400);
      }
      if (leagueEventNews.some(n => n.title.includes("Casino"))) {
        setTimeout(() => setShowCasinoNightAnim(true), 400);
      }
      if (leagueEventNews.some(n => n.title.includes("Failed Transfer"))) {
        setTimeout(() => setShowFailedTransferAnim(true), 400);
      }
      if (leagueEventNews.some(n => n.title.includes("Bench Warmer"))) {
        setTimeout(() => setShowBenchWarmerAnim(true), 400);
      }
      if (leagueEventNews.some(n => n.title.includes("Breakup"))) {
        setTimeout(() => setShowBreakupSeasonAnim(true), 400);
      }
      if (leagueEventNews.some(n => n.title.includes("Free Transfer"))) {
        setTimeout(() => setShowFreeTransferAnim(true), 400);
      }
      if (leagueEventNews.some(n => n.title.includes("Major Injury"))) {
        setTimeout(() => setShowMajorInjuryAnim(true), 400);
      }
      if (leagueEventNews.some(n => n.title.includes("Heart Attack"))) {
        setTimeout(() => setShowEriksenAnim(true), 400);
      }
      if (leagueEventNews.some(n => n.title.includes("Doping Ban"))) {
        setTimeout(() => setShowDopingBanAnim(true), 400);
      }
      if (leagueEventNews.some(n => n.title.includes("Girls Magnet"))) {
        setTimeout(() => setShowGirlsMagnetAnim(true), 400);
      }
      if (leagueEventNews.some(n => n.title.includes("Racist Attack"))) {
        setTimeout(() => setShowRacistAttackAnim(true), 400);
      }
      if (leagueEventNews.some(n => n.title.includes("Club Legend"))) {
        setTimeout(() => setShowClubLegendAnim(true), 400);
      }
      if (leagueEventNews.some(n => n.title.includes("Fast Food") || n.title.includes("Food"))) {
        setTimeout(() => setShowFastFoodAnim(true), 400);
      }
      if (leagueEventNews.some(n => n.title.includes("YouTube") || n.title.includes("Viral"))) {
        setTimeout(() => setShowYouTubeAnim(true), 400);
      }
    }

    setGamePlayers(postRoundPlayers);

    if (result.userMatch) {
      const { fixture, opponent, result: matchResult } = result.userMatch;
      const userIsHome = fixture.homeId === "user";
      setMatchSummary({
        round: fixture.round,
        userTeamName: gamePlayers[0]?.name || "Your Team",
        opponentName: opponent.name,
        userIsHome,
        homeGoals: fixture.homeGoals!,
        awayGoals: fixture.awayGoals!,
        events: matchResult.events,
      });
    }

    if (result.updatedLeague.seasonPhase === "finished") {
      if (result.prizeMoneyAwarded > 0) {
        notify(`🏁 Season complete! You earned €${result.prizeMoneyAwarded}M in prize money. Press Next Season to continue.`);
      } else {
        notify("🏁 Premier League season complete! Press Next Season to continue.");
      }

      const championRow = result.updatedLeague.standings[0];
      const best = getBestPlayerOfSeason(result.updatedLeague, basePlayers);
      setTimeout(() => {
        setLeagueChampionAnim({
          championName: championRow?.teamName ?? "Unknown",
          isUserChampion: !!championRow?.isUser,
          bestPlayerName: best?.stat.playerName ?? null,
          bestPlayerTeam: best?.stat.teamName ?? null,
          bestPlayerGoals: best?.stat.goals ?? 0,
          bestPlayerAssists: best?.stat.assists ?? 0,
        });
      }, 600);
    } else if (result.updatedLeague.seasonPhase === "transfer") {
      notify(`🔄 Round ${result.updatedLeague.currentRound} played. Transfer window is now open (Rounds 18-21)!`);
    } else {
      notify(`⚽ Round ${result.updatedLeague.currentRound} played.`);
    }
  }

  function getLeagueButtonLabel(): string | undefined {
    if (mode !== "single" || singlePlayerStyle !== "clubOwner") return undefined;
    if (!leagueEnabled || !leagueState) return "Start Season";
    if (leagueState.seasonPhase === "finished") return "Next Season";
    return "Next Game";
  }

  function handleMainSeasonButtonClick() {
    if (mode !== "single" || singlePlayerStyle !== "clubOwner") {
      nextSeason();
      return;
    }
    if (!leagueEnabled || !leagueState) {
      handleStartLeagueSeason();
      return;
    }
    if (leagueState.seasonPhase === "finished") {
      // Reset league for the next cycle and proceed to normal season transition
      setLeagueEnabled(false);
      setLeagueState(null);
      setMatchSummary(null);
      nextSeason();
      return;
    }
    handlePlayLeagueGame();
  }

  // Boost purchase/sell chances exactly once when entering the transfer window (rounds 18-21)
  const transferWindowBoostApplied = useRef<number | null>(null);
  useEffect(() => {
    if (!leagueState || mode !== "single") return;
    if (leagueState.seasonPhase !== "transfer") return;
    if (leagueState.currentRound < 18 || leagueState.currentRound > 21) return;
    if (transferWindowBoostApplied.current === leagueState.currentRound) return;
    if (leagueState.currentRound !== 18) return; // boost applied once, at window opening

    transferWindowBoostApplied.current = leagueState.currentRound;
    const boost = getTransferWindowChances();
    setGamePlayers(prev => prev.map((gp, idx) =>
      idx === 0
        ? {
            ...gp,
            purchaseChances: Math.min(
              gp.purchaseChances + boost.purchaseChances,
              LEAGUE_MAX_PURCHASE_CHANCES
            ),
            sellChances: gp.sellChances + boost.sellChances,
          }
        : gp
    ));
  }, [leagueState?.currentRound, leagueState?.seasonPhase, mode]);

  // ============================================
  // TURN & SEASON
  // ============================================

  function endVersusTurn(updatedList?: GamePlayer[]) {
    setTimerActive(false);
    if (timerSeconds !== null) setTimer(timerSeconds);
    if (turnIndex === 0) { setTurnIndex(1); return; }
    setTurnIndex(0);
    nextSeason(updatedList);
  }

  // Auto-sign a random full XI for Club Owner mode (debugging/testing shortcut).
  // Picks one random eligible player per position from the current season's
  // pool, prices them with the league's rating-based scale, and builds a
  // basic contract for each so the user can jump straight into Start Season.
  function autoSignFullSquadForClubOwner() {
    const userGp = gamePlayers[0];
    if (!userGp) return;

    const alreadyOwnedSlots = new Set(userGp.owned.map(o => o.slot));
    const newOwned: OwnedPlayer[] = [];
    const goats = getSecretPlayers(); // one legendary GOAT per position, spread across different eras/seasons

    for (const pos of ALL_POSITIONS) {
      if (alreadyOwnedSlots.has(pos)) continue; // keep any player already in that slot

      const chosen = goats.find(p => p.position === pos);
      if (!chosen) continue; // no GOAT exists for this position in the database

      // GOATs keep their own original season (their era), not the league's
      // current season — that's what makes them legendary all-time picks.
      const goatSeason = chosen.availableSeason;

      const price = calculateLeaguePlayerPrice(chosen.rating ?? 95);
      const salary = getRecommendedSalary(price);

      newOwned.push({
        player: {
          ...chosen,
          statsBySeason: {
            ...(chosen.statsBySeason ?? {}),
            [season]: chosen.statsBySeason?.[goatSeason] ?? {
              season, games: 0, goals: 0, assists: 0, cleanSheets: 0,
              yellowCards: 0, redCards: 0, rating: chosen.rating ?? 95, value: price,
            },
          },
        },
        slot: pos,
        buySeason: season,
        buyPrice: price,
        currentValue: price,
        budgetAtBuy: userGp.budget,
        contract: {
          salary,
          duration: 3,
          satisfaction: 75,
          requiredSalary: salary,
          startSeason: season,
          endSeason: season + 3,
        },
        sponsorships: [],
      });
    }

    setGamePlayers(prev =>
      prev.map((gp, idx) => idx === 0 ? { ...gp, owned: [...gp.owned, ...newOwned] } : gp)
    );
    notify(`⚡ Legendary XI assembled! Signed ${newOwned.length} GOAT(s) to your squad!`);
  }

  function nextSeason(listOverride?: GamePlayer[]) {
    if (pendingSlot) return notify("Finish current player selection first");
    if (auctionState) return notify("An auction is in progress");
    if (investorOffer) return notify("An investor offer is pending");
    if (negotiation) return notify("A contract negotiation is in progress");

    const currentList = listOverride ?? gamePlayers;

    // فحص الميزانية السالبة — تنتهي اللعبة فقط لو الإعداد مفعّل
    const brokePlayers = currentList.filter(gp => gp.budget < 0);
    if (negativeBudgetEndsGame && brokePlayers.length > 0) {
      if (mode === "single") {
        // الطور الفردي — تنتهي اللعبة مباشرة
        notify("💸 Bankrupt! Game Over.");
        setTimeout(() => finishGame(currentList), 800);
        return;
      } else {
        // طور versus — الخاسر هو اللاعب بالميزانية السالبة
        const loserIndex = currentList.findIndex(gp => gp.budget < 0);
        const winnerIndex = loserIndex === 0 ? 1 : 0;
        const winner = currentList[winnerIndex];
        const loser = currentList[loserIndex];
        addNewsItem({
          id: Date.now(),
          season,
          title: `💸 Bankruptcy — ${loser.name} is Eliminated!`,
          description: `${loser.name} ran out of money. ${winner.name} wins the game!`,
          tone: "bad",
        });
        notify(`💸 ${loser.name} is bankrupt! ${winner.name} wins!`);
        setTimeout(() => finishGame(currentList), 1500);
        return;
      }
    }

    if (gameLengthMode === "classic" && season >= GAME_END_SEASON) {
      finishGame(currentList);
      return;
    }

    const newSeason = season + 1;
    const setupResult = setupNewSeason(newSeason, currentList, mode);

    // Club Owner mode: the normal season-growth system above just regenerated
    // squad player values using the standard game economy, which inflates
    // them far beyond the fixed €150M league budget. Re-price owned players
    // back to the league's rating-based scale so squad worth stays realistic.
    if (mode === "single" && singlePlayerStyle === "clubOwner") {
      setupResult.updatedPlayers = setupResult.updatedPlayers.map((gp, idx) =>
        idx === 0 ? reapplyLeaguePricingToOwnedSquad(gp, newSeason) : gp
      );
    }

    // Versus: إيفنت منفصل لكل لاعب | Single: إيفنت مشترك
    let eventPlayers = setupResult.updatedPlayers;
    let eventNewsItems: NewsItem[] = [];

    if (eventsEnabled) {
      if (mode === "versus") {
        const versusResult = createVersusSeasonEvents(newSeason, setupResult.updatedPlayers);
        eventPlayers = versusResult.updatedPlayers;
        eventNewsItems = versusResult.newsItems;
      } else {
        const singleResult = createRandomSeasonEvent(newSeason, setupResult.updatedPlayers);
        eventPlayers = singleResult.updatedPlayers;
        eventNewsItems = singleResult.newsItems;
        setSeasonEvent(singleResult.event);
        // Florentino animation — fires when any news title contains his name
        if (singleResult.newsItems.some(n => n.title.includes("Florentino"))) {
          setTimeout(() => setShowFlorentinoAnim(true), 400);
        }
        if (singleResult.newsItems.some(n => n.title.includes("ACL"))) {
          setTimeout(() => setShowAclAnim(true), 400);
        }
        if (singleResult.newsItems.some(n => n.title.includes("Saudi"))) {
          setTimeout(() => setShowSaudiAnim(true), 400);
        }
        if (singleResult.newsItems.some(n => n.title.includes("Golden Boot"))) {
          setTimeout(() => setShowGoldenBootAnim(true), 400);
        }
        if (singleResult.newsItems.some(n => n.title.includes("Ballon"))) {
          setTimeout(() => setShowBallonDorAnim(true), 400);
        }
        if (singleResult.newsItems.some(n => n.title.includes("Golden Boy"))) {
          setTimeout(() => setShowGoldenBoyAnim(true), 400);
        }
        if (singleResult.newsItems.some(n => n.title.includes("Record Transfer"))) {
          setTimeout(() => setShowRecordTransferAnim(true), 400);
        }
        if (singleResult.newsItems.some(n => n.title.includes("Wonderkid"))) {
          setTimeout(() => setShowWonderkidAnim(true), 400);
        }
        if (singleResult.newsItems.some(n => n.title.includes("Bob Paisley") || n.title.includes("Paisley"))) {
          setTimeout(() => setShowBobPaisleyAnim(true), 400);
        }
        if (singleResult.newsItems.some(n => n.title.includes("Hot Market") || n.title.includes("Hot Transfer"))) {
          setTimeout(() => setShowHotMarketAnim(true), 400);
        }
        if (singleResult.newsItems.some(n => n.title.includes("Market Crash"))) {
          setTimeout(() => setShowMarketCrashAnim(true), 400);
        }
        if (singleResult.newsItems.some(n => n.title.includes("One Season Wonder"))) {
          setTimeout(() => setShowOneSeasonWonderAnim(true), 400);
        }
        if (singleResult.newsItems.some(n => n.title.includes("Casino"))) {
          setTimeout(() => setShowCasinoNightAnim(true), 400);
        }
        if (singleResult.newsItems.some(n => n.title.includes("Failed Transfer"))) {
          setTimeout(() => setShowFailedTransferAnim(true), 400);
        }
        if (singleResult.newsItems.some(n => n.title.includes("Bench Warmer"))) {
          setTimeout(() => setShowBenchWarmerAnim(true), 400);
        }
        if (singleResult.newsItems.some(n => n.title.includes("Breakup"))) {
          setTimeout(() => setShowBreakupSeasonAnim(true), 400);
        }
        if (singleResult.newsItems.some(n => n.title.includes("Free Transfer"))) {
          setTimeout(() => setShowFreeTransferAnim(true), 400);
        }
        if (singleResult.newsItems.some(n => n.title.includes("Major Injury"))) {
          setTimeout(() => setShowMajorInjuryAnim(true), 400);
        }
        if (singleResult.newsItems.some(n => n.title.includes("Heart Attack"))) {
          setTimeout(() => setShowEriksenAnim(true), 400);
        }
        if (singleResult.newsItems.some(n => n.title.includes("Doping Ban"))) {
          setTimeout(() => setShowDopingBanAnim(true), 400);
        }
        if (singleResult.newsItems.some(n => n.title.includes("Girls Magnet"))) {
          setTimeout(() => setShowGirlsMagnetAnim(true), 400);
        }
        if (singleResult.newsItems.some(n => n.title.includes("Racist Attack"))) {
          setTimeout(() => setShowRacistAttackAnim(true), 400);
        }
        if (singleResult.newsItems.some(n => n.title.includes("Club Legend"))) {
          setTimeout(() => setShowClubLegendAnim(true), 400);
        }
        if (singleResult.newsItems.some(n => n.title.includes("Fast Food") || n.title.includes("Food"))) {
          setTimeout(() => setShowFastFoodAnim(true), 400);
        }
        if (singleResult.newsItems.some(n => n.title.includes("YouTube") || n.title.includes("Viral"))) {
          setTimeout(() => setShowYouTubeAnim(true), 400);
        }
      }
    }

    // Tournament events check
    const tournamentResult = checkTournamentEvents(eventPlayers, newSeason);
    eventPlayers = tournamentResult.updatedPlayers;
    if (tournamentResult.newsItems.length > 0) {
      eventNewsItems = [...eventNewsItems, ...tournamentResult.newsItems];
      // Trigger animations based on tournament news
      tournamentResult.newsItems.forEach(n => {
        if (n.title.includes("World Cup")) {
          const nat = n.description.match(/with (.+?)!/)?.[1] ?? "";
          setTournamentNationality(nat);
          setTimeout(() => setShowWorldCupAnim(true), 600);
        }
        if (n.title.includes("Euro Champion")) {
          const nat = n.description.match(/with (.+?)!/)?.[1] ?? "";
          setTournamentNationality(nat);
          setTimeout(() => setShowEuroAnim(true), 600);
        }
        if (n.title.includes("Champions League Winner")) {
          setTimeout(() => setShowChampionsLeagueAnim(true), 600);
        }
      });
    }

    setSeason(newSeason);
    setTurnIndex(0);
    setPendingSlot(null);
    setSelectedSlot("");
    setTimerActive(false);
    setGamePlayers(eventPlayers);
    if (timerSeconds !== null) setTimer(timerSeconds);

    addNewsItems([
      ...setupResult.retirementNews,
      ...setupResult.salaryNews,
      ...setupResult.sponsorshipNews,
      setupResult.seasonNews,
      ...eventNewsItems,
    ]);

    // Random investor offer in single mode
    if (mode === "single" && Math.random() < 0.25) {
      setTimeout(() => triggerInvestorOffer(), 600);
    }

    // Random auction
    if (Math.random() < 0.15) {
      setTimeout(() => triggerLegendaryAuction(), 1200);
    }
  }

  function finishGame(listOverride?: GamePlayer[]) {
    const list = listOverride ?? gamePlayers;
    const finalPlayers = list.map((gp) => autoSellAllPlayers(gp, season));
    setGamePlayers(finalPlayers);
    setShowEndModal(true);
  }

  function handleDevSeasonClick() {
    const next = devSeasonClicks + 1;
    setDevSeasonClicks(next);
    if (next >= 20) {
      setDevSeasonUnlocked(true);
      notify("🔓 Dev Mode: Season navigation unlocked!");
    }
  }

  function handleSkipTurn() {
    if (mode !== "versus") return;
    // فقط ينتقل للتشكيلة الثانية بدون الانتقال للموسم
    setTurnIndex(prev => prev === 0 ? 1 : 0);
    notify("Turn skipped ⏭");
  }

  // ============================================
  // RESTART
  // ============================================

  function restartGame() {
    setStarted(false);
    setShowEndModal(false);
    setSeason(GAME_START_SEASON);
    setTurnIndex(0);
    setGamePlayers([]);
    setNews([]);
    setSeasonEvent(null);
    setSelectedSlot("");
    setPendingSlot(null);
    setNegotiation(null);
    setSelectedOwned(null);
    setRewardChoice(null);
    setStealChallenge(null);
    setEventChoice(null);
    setInvestorOffer(null);
    setAuctionState(null);
    setShowDeveloperPanel(false);
    setSeasonSecretClicks(0);
    setTimerActive(false);
  }

  // ============================================
  // RENDER: START SCREEN
  // ============================================

  if (showLeagueSelection && pendingConfig) {
    return (
      <LeagueSelectionScreen
        onSelect={(leagueId: LeagueId, teamName: string, budget: number) => {
          setSelectedLeagueId(leagueId);
          setSelectedClubName(teamName);
          setShowLeagueSelection(false);
          // Now actually start the game with the selected club
          const cfg = { ...pendingConfig };
          setPendingConfig(null);
          // Continue startGame logic with club info
          continueStartGame(cfg, teamName, budget);
        }}
        onBack={() => {
          setShowLeagueSelection(false);
          setPendingConfig(null);
        }}
      />
    );
  }

  if (!started && !showLeagueSelection) {
    return <StartScreen onStart={startGame} onContinue={handleLoadSave} />;
  }

  const hasModal = !!(auctionState || investorOffer || negotiation);
  const canNextSeason = mode === "single"
    ? (leagueEnabled && leagueState && leagueState.seasonPhase !== "finished"
        ? !pendingSlot && !hasModal
        : singleCanNextSeason(gamePlayers, devSeasonUnlocked, pendingSlot, hasModal))
    : versusCanNextSeason(gamePlayers, devSeasonUnlocked, pendingSlot, hasModal);

  // ============================================
  // RENDER: GAME
  // ============================================

  return (
    <main className="min-h-screen bg-[#060a0f] text-white">

      {/* Toast message */}
      {message && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-zinc-900 border border-yellow-500/50 px-5 py-3 rounded-none z-[100] text-sm font-bold shadow-xl">
          {message}
        </div>
      )}

      {/* Top Bar */}
      <TopBar
        season={season}
        mode={mode}
        gameLengthMode={gameLengthMode}
        budgetMode={budgetMode}
        activePlayerIndex={activePlayerIndex}
        gamePlayers={gamePlayers}
        timerSeconds={timerSeconds}
        timer={timer}
        pendingSlot={pendingSlot}
        onNextSeason={handleMainSeasonButtonClick}
        nextSeasonButtonLabel={getLeagueButtonLabel()}
        leagueRound={leagueEnabled && leagueState ? leagueState.currentRound : undefined}
        leagueTotalRounds={leagueState?.totalRounds ?? TOTAL_ROUNDS}
        onSeasonClick={handleSeasonClick}
        onFinishGame={() => finishGame()}
        onSave={handleSave}
        onSecretClick={() => {
          const next = devSeasonClicks + 1;
          setDevSeasonClicks(next);
          if (next >= 20) {
            setDevSeasonUnlocked(true);
            notify("🔓 Season navigation unlocked!");
          }
        }}
        canNextSeason={canNextSeason}
      />

      {/* Main layout */}
      <div className="max-w-[1600px] mx-auto px-4 py-4">
        {mode === "single" ? (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
            {/* Formation — 2 cols */}
            <div className="xl:col-span-2">
              {singlePlayerStyle === "clubOwner" && (
                <div className="flex items-center justify-between mb-2 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700">
                  <span className="text-xs text-slate-400 font-medium">Squad Average</span>
                  <span className="text-lg font-black text-emerald-300">
                    {calculateUserStrength(gamePlayers[0], season).toFixed(1)}
                  </span>
                </div>
              )}
              <Formation
                gamePlayer={gamePlayers[0]}
                playerIndex={0}
                season={season}
                isActive={true}
                pendingSlot={pendingSlot}
                marketMultiplier={marketMultiplier}
                onSlotClick={handleSlotClick}
                onOwnedClick={(pi, oi) => setSelectedOwned({ playerIndex: pi, ownedIndex: oi })}
              />
            </div>
            {/* Team Panel — 1 col */}
            <div className="xl:col-span-1">
              <TeamPanel
                gamePlayer={gamePlayers[0]}
                playerIndex={0}
                season={season}
                marketMultiplier={marketMultiplier}
                isActive={true}
                mode={mode}
                onUseCard={handleUseCard}
                onShowStats={() => setShowStats(true)}
                onSkipTurn={handleSkipTurn}
              />
              {leagueEnabled && leagueState && (
                <>
                  <LeagueStandings
                    standings={leagueState.standings}
                    currentRound={leagueState.currentRound}
                    totalRounds={leagueState?.totalRounds ?? TOTAL_ROUNDS}
                    leagueName={leagueNameMap[selectedLeagueId]}
                    leagueLogo={leagueLogoMap[selectedLeagueId]}
                  />
                  <button
                    onClick={() => setShowLeagueStats(true)}
                    className="w-full mt-2 py-2 rounded-xl text-xs font-semibold bg-slate-800/60 border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    ⚽ Top Scorers · 🅰️ Assists · 🧤 Clean Sheets
                  </button>
                  {Object.keys(otherLeagues).length > 0 && (
                    <button
                      onClick={() => setShowOtherLeagues(true)}
                      className="w-full mt-2 py-2 rounded-xl text-xs font-semibold bg-slate-800/60 border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
                    >
                      🌍 Other Leagues
                    </button>
                  )}
                </>
              )}
            </div>
            {/* News — 1 col */}
            <div className="xl:col-span-1 min-h-[700px]">
              <NewsFeed news={news} seasonEvent={seasonEvent} season={season} />
            </div>
          </div>
        ) : (
          /* Versus: 2 formations side by side + news on right */
          <div className="grid grid-cols-1 xl:grid-cols-7 gap-4">
            {/* Left formation + panel */}
            <div className="xl:col-span-2 flex flex-col gap-3">
              <Formation
                gamePlayer={gamePlayers[0]}
                playerIndex={0}
                season={season}
                isActive={0 === activePlayerIndex}
                pendingSlot={0 === activePlayerIndex ? pendingSlot : null}
                marketMultiplier={marketMultiplier}
                isVersus={true}
                onSlotClick={handleSlotClick}
                onOwnedClick={(pi, oi) => setSelectedOwned({ playerIndex: pi, ownedIndex: oi })}
              />
              <TeamPanel
                gamePlayer={gamePlayers[0]}
                playerIndex={0}
                season={season}
                marketMultiplier={marketMultiplier}
                isActive={0 === activePlayerIndex}
                mode={mode}
                onUseCard={handleUseCard}
                onShowStats={() => setShowStats(true)}
                onSkipTurn={handleSkipTurn}
              />
            </div>
            {/* Right formation + panel */}
            <div className="xl:col-span-2 flex flex-col gap-3">
              {gamePlayers[1] && (
                <>
                  <Formation
                    gamePlayer={gamePlayers[1]}
                    playerIndex={1}
                    season={season}
                    isActive={1 === activePlayerIndex}
                    pendingSlot={1 === activePlayerIndex ? pendingSlot : null}
                    marketMultiplier={marketMultiplier}
                    isVersus={true}
                    onSlotClick={handleSlotClick}
                    onOwnedClick={(pi, oi) => setSelectedOwned({ playerIndex: pi, ownedIndex: oi })}
                  />
                  <TeamPanel
                    gamePlayer={gamePlayers[1]}
                    playerIndex={1}
                    season={season}
                    marketMultiplier={marketMultiplier}
                    isActive={1 === activePlayerIndex}
                    mode={mode}
                    onUseCard={handleUseCard}
                    onShowStats={() => setShowStats(true)}
                    onSkipTurn={handleSkipTurn}
                  />
                </>
              )}
            </div>
            {/* News — 3 cols wide */}
            <div className="xl:col-span-3 min-h-[800px]">
              <NewsFeed news={news} seasonEvent={seasonEvent} season={season} />
            </div>
          </div>
        )}
      </div>

      {/* ── MODALS ── */}

      {selectedSlot && slotOptions.length >= 0 && !negotiation && (
        <PlayerSelectionModal
          slot={selectedSlot}
          options={slotOptions}
          activePlayer={activePlayer}
          season={season}
          timer={timer}
          timerSeconds={timerSeconds}
          marketMultiplier={marketMultiplier}
          onBuy={handleBuyPlayer}
          onClose={closePlayerSelection}
        />
      )}

      {negotiation && (
        <ContractModal
          negotiation={negotiation}
          season={season}
          onUpdate={handleContractUpdate}
          onSign={handleContractSign}
          onCancel={handleContractCancel}
        />
      )}

      {selectedOwned !== null && getOwnedItem(selectedOwned.playerIndex, selectedOwned.ownedIndex) && (
        <OwnedPlayerModal
          owned={getOwnedItem(selectedOwned.playerIndex, selectedOwned.ownedIndex)!}
          ownerName={gamePlayers[selectedOwned.playerIndex]?.name ?? ""}
          season={season}
          marketMultiplier={marketMultiplier}
          canSell={gamePlayers[selectedOwned.playerIndex]?.sellChances > 0}
          onSell={handleSellPlayer}
          onKeep={handleKeepPlayer}
          onRenew={handleRenewPlayer}
        />
      )}

      {rewardChoice && (
        <RewardModal
          cards={rewardChoice.cards}
          playerName={gamePlayers[rewardChoice.playerIndex]?.sold[0]?.name ?? ""}
          sellPrice={gamePlayers[rewardChoice.playerIndex]?.sold[0]?.sellPrice ?? 0}
          onChoose={handleChooseReward}
        />
      )}

      {investorOffer && (
        <InvestorOfferModal
          offer={investorOffer}
          activePlayer={activePlayer}
          season={season}
          onAccept={handleAcceptOffer}
          onReject={handleRejectOffer}
        />
      )}

      {auctionState && mode !== "single" && (
        <AuctionModal
          state={auctionState}
          gamePlayers={gamePlayers}
          season={season}
          marketMultiplier={marketMultiplier}
          onBid={handleBid}
          onSurrender={handleSurrender}
        />
      )}

      {showStats && (
        <StatisticsModal
          gamePlayers={gamePlayers}
          season={season}
          marketMultiplier={marketMultiplier}
          onClose={() => setShowStats(false)}
        />
      )}

      {showHowToPlay && (
        <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
      )}

      {/* Florentino Pérez Boss Entrance */}
      {showFlorentinoAnim && (
        <FlorentinoEntrance onDone={() => setShowFlorentinoAnim(false)} />
      )}

      {/* ACL Injury Animation */}
      {showAclAnim && (
        <AclInjuryAnimation onDone={() => setShowAclAnim(false)} />
      )}

      {showSaudiAnim && (
        <SaudiOfferAnimation onDone={() => setShowSaudiAnim(false)} />
      )}

      {/* GOAT Signing — Easter Egg players */}
      {goatSignedPlayer && (
        <GoatSigningAnimation
          playerName={goatSignedPlayer}
          onDone={() => setGoatSignedPlayer(null)}
        />
      )}

      {showGoldenBootAnim && (
        <GoldenBootAnimation onDone={() => setShowGoldenBootAnim(false)} />
      )}

      {showBallonDorAnim && (
        <BallonDorAnimation onDone={() => setShowBallonDorAnim(false)} />
      )}

      {showGoldenBoyAnim && (
        <GoldenBoyAnimation onDone={() => setShowGoldenBoyAnim(false)} />
      )}

      {showRecordTransferAnim && (
        <RecordTransferAnimation onDone={() => setShowRecordTransferAnim(false)} />
      )}

      {showWonderkidAnim && (
        <WonderkidAnimation onDone={() => setShowWonderkidAnim(false)} />
      )}

      {showBobPaisleyAnim && (
        <BobPaisleyAnimation onDone={() => setShowBobPaisleyAnim(false)} />
      )}

      {showHotMarketAnim && (
        <HotMarketAnimation onDone={() => setShowHotMarketAnim(false)} />
      )}

      {showOneSeasonWonderAnim && (
        <OneSeasonWonderAnimation onDone={() => setShowOneSeasonWonderAnim(false)} />
      )}

      {showCasinoNightAnim && (
        <CasinoNightAnimation onDone={() => setShowCasinoNightAnim(false)} />
      )}

      {showMarketCrashAnim && (
        <MarketCrashAnimation onDone={() => setShowMarketCrashAnim(false)} />
      )}

      {showFailedTransferAnim && (
        <FailedTransferAnimation onDone={() => setShowFailedTransferAnim(false)} />
      )}

      {showBenchWarmerAnim && (
        <BenchWarmerAnimation onDone={() => setShowBenchWarmerAnim(false)} />
      )}

      {showBreakupSeasonAnim && (
        <BreakupSeasonAnimation onDone={() => setShowBreakupSeasonAnim(false)} />
      )}

      {showFreeTransferAnim && (
        <FreeTransferAnimation onDone={() => setShowFreeTransferAnim(false)} />
      )}

      {showMajorInjuryAnim && (
        <MajorInjuryAnimation onDone={() => setShowMajorInjuryAnim(false)} />
      )}
      {showEriksenAnim && <EriksenAnimation onDone={() => setShowEriksenAnim(false)} />}
      {showDopingBanAnim && <DopingBanAnimation onDone={() => setShowDopingBanAnim(false)} />}
      {showGirlsMagnetAnim && <GirlsMagnetAnimation onDone={() => setShowGirlsMagnetAnim(false)} />}
      {showRacistAttackAnim && <RacistAttackAnimation onDone={() => setShowRacistAttackAnim(false)} />}
      {showClubLegendAnim && <ClubLegendAnimation onDone={() => setShowClubLegendAnim(false)} />}

      {showFastFoodAnim && (
        <FastFoodAnimation onDone={() => setShowFastFoodAnim(false)} />
      )}

      {showYouTubeAnim && (
        <YouTubeViralAnimation onDone={() => setShowYouTubeAnim(false)} />
      )}

      {showEndModal && (
        <EndGameModal
          gamePlayers={gamePlayers}
          season={season}
          mode={mode}
          onRestart={restartGame}
        />
      )}

      {showDeveloperPanel && (
        <DeveloperPanel
          onTrigger={(id) => handleDevEvent(id)}
          onClose={() => setShowDeveloperPanel(false)}
        />
      )}

      {/* Steal challenge overlay */}
      {stealChallenge && stealChallenge.success && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0f14] border border-purple-500/40 rounded-3xl w-full max-w-2xl p-6">
            <h2 className="text-2xl font-black text-white text-center mb-6">🕵️ Choose Players to Swap</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Your Player</div>
                {gamePlayers[stealChallenge.userIndex].owned.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setStealChallenge({ ...stealChallenge, ownIndex: i })}
                    className={`w-full text-left p-2.5 rounded-none mb-1.5 text-sm transition-all ${
                      stealChallenge.ownIndex === i ? "bg-blue-700 text-white" : "bg-white/5 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    {item.player.name} — {item.slot}
                  </button>
                ))}
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Opponent's Player</div>
                {gamePlayers[stealChallenge.userIndex === 0 ? 1 : 0].owned.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setStealChallenge({ ...stealChallenge, enemyIndex: i })}
                    className={`w-full text-left p-2.5 rounded-none mb-1.5 text-sm transition-all ${
                      stealChallenge.enemyIndex === i ? "bg-red-700 text-white" : "bg-white/5 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    {item.player.name} — {item.slot}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStealChallenge(null)} className="flex-1 py-3 rounded-none border border-white/10 text-gray-400 font-bold">Cancel</button>
              <button
                onClick={handleStealSwap}
                disabled={stealChallenge.ownIndex === null || stealChallenge.enemyIndex === null}
                className="flex-1 py-3 rounded-none bg-purple-700 hover:bg-purple-600 text-white font-black disabled:bg-white/5 disabled:text-gray-600 transition-all"
              >
                Confirm Swap
              </button>
            </div>
          </div>
        </div>
      )}

      {showWorldCupAnim && (
        <WorldCupAnimation
          nationality={tournamentNationality}
          onDone={() => setShowWorldCupAnim(false)}
        />
      )}

      {showEuroAnim && (
        <EuroAnimation
          nationality={tournamentNationality}
          onDone={() => setShowEuroAnim(false)}
        />
      )}

      {showChampionsLeagueAnim && (
        <ChampionsLeagueAnimation
          onDone={() => setShowChampionsLeagueAnim(false)}
        />
      )}

      {showKonamiAnim && (
        <KonamiCodeAnimation
          onDone={() => {
            setShowKonamiAnim(false);
            setKonamiUsed(true);
            if (singlePlayerStyle === "clubOwner") {
              autoSignFullSquadForClubOwner();
            } else {
              setGamePlayers(prev =>
                prev.map(gp => ({ ...gp, budget: 99999 }))
              );
              notify("∞ Budget Unlocked!");
            }
          }}
        />
      )}

      {matchPreview && (
        <MatchPreviewModal
          round={matchPreview.round}
          userTeamName={gamePlayers[0]?.name || "Your Team"}
          opponentName={matchPreview.opponentName}
          userIsHome={matchPreview.userIsHome}
          userLineup={matchPreview.userLineup}
          opponentLineup={matchPreview.opponentLineup}
          userAverage={matchPreview.userAverage}
          opponentAverage={matchPreview.opponentAverage}
          onStart={confirmPlayLeagueGame}
          onClose={() => setMatchPreview(null)}
        />
      )}

      {matchSummary && (
        <MatchSummaryModal
          round={matchSummary.round}
          userTeamName={matchSummary.userTeamName}
          opponentName={matchSummary.opponentName}
          userIsHome={matchSummary.userIsHome}
          homeGoals={matchSummary.homeGoals}
          awayGoals={matchSummary.awayGoals}
          events={matchSummary.events}
          onClose={() => setMatchSummary(null)}
        />
      )}

      {showLeagueStats && leagueState && (
        <LeagueStatsModal
          topScorers={getTopScorers(leagueState)}
          topAssists={getTopAssists(leagueState)}
          topCleanSheets={getTopCleanSheets(leagueState)}
          onClose={() => setShowLeagueStats(false)}
        />
      )}

      {leagueChampionAnim && (
        <LeagueChampionAnimation
          championName={leagueChampionAnim.championName}
          isUserChampion={leagueChampionAnim.isUserChampion}
          bestPlayerName={leagueChampionAnim.bestPlayerName}
          bestPlayerTeam={leagueChampionAnim.bestPlayerTeam}
          bestPlayerGoals={leagueChampionAnim.bestPlayerGoals}
          bestPlayerAssists={leagueChampionAnim.bestPlayerAssists}
          onDone={() => setLeagueChampionAnim(null)}
        />
      )}

      {showOtherLeagues && Object.keys(otherLeagues).length > 0 && (
        <OtherLeaguesModal
          otherLeagues={otherLeagues}
          onClose={() => setShowOtherLeagues(false)}
        />
      )}
    </main>
  );
}