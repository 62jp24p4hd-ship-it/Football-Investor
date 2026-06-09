"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  GamePlayer, Player, GameMode, BudgetMode, EventType,
  AuctionState, InvestorOfferState, RewardChoice, StealChallenge,
  SeasonEvent, NewsItem, ContractNegotiation, OwnedPlayer,
  RewardCard, DevEventId, SeasonEvent as SeasonEventType,
} from "./game/types";

// Game engines
import { buildAllBasePlayers, getSecretPlayers } from "./game/playerDatabase";
import { generateSeasonPlayerPool } from "./game/playerGenerator";
import { getCurrentValue, guaranteeAffordablePlayer } from "./game/valueEngine";
import { getSeasonStats } from "./game/statsEngine";
import { createNegotiation, createRenewalNegotiation, updateOffer, isRejected, finalizeContract } from "./game/contractEngine";
import { getEligibleCards, unlockCard, useFreezeCard, useTripleCard, executeStealSwap, emptyCards } from "./game/rewardCardEngine";
import { createRandomSeasonEvent, forcedPositiveEvent, forcedNegativeEvent, forcedMarketEvent, createEventChoiceOptions, forcedSpecificEvent, triggerFlorentinoPerezEvent, triggerBobPaisleyDisaster, triggerFastFoodAddiction, triggerBreakupSeason, triggerCasinoNight, triggerOneSeasonWonder, triggerYouTubeViral, triggerDreamSeason, triggerLockerRoomDrama } from "./game/eventEngine";
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

// Components
import StartScreen from "./components/StartScreen";
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
  const [devSeasonUnlocked, setDevSeasonUnlocked] = useState(false);
  const [devSeasonClicks, setDevSeasonClicks] = useState(0);

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
    const withGuarantee = guaranteeAffordablePlayer(picked, budget, season);

    // أضف GOAT في المنتصف (index 2) فقط لو موجود
    if (goatForSeason) {
      const result = [...withGuarantee];
      result.splice(2, 0, goatForSeason);
      return result.slice(0, 5);
    }

    return withGuarantee;
  }, [selectedSlot, season, gamePlayers, allPlayers, activePlayerIndex, easterUnlocked]);

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
    mode: GameMode; budgetMode: BudgetMode; team1Name: string; team2Name: string;
    eventsEnabled: boolean; eventType: EventType; timerSeconds: number | null;
    gameLengthMode: "classic" | "infinite"; negativeBudgetEndsGame: boolean; easterUnlocked: boolean;
  }) {
    setMode(config.mode);
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

    setGamePlayers(gps);
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

    const newOwned: OwnedPlayer = {
      player: negotiation.player,
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
      return {
        ...p,
        budget: p.budget + sellPrice,
        purchaseChances: p.purchaseChances + extraChance,
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
    if (next >= 20) { setShowDeveloperPanel(true); }
  }

  function handleDevEvent(eventId: DevEventId) {
    if (eventId === "legendaryAuction") { triggerLegendaryAuction(); return; }
    if (eventId === "florentinoPerez") {
      const result = triggerFlorentinoPerezEvent(gamePlayers, activePlayerIndex, season);
      setGamePlayers(result.updatedPlayers);
      addNewsItems(result.newsItems);
      return;
    }
    if (eventId === "bobPaisleyDisaster") {
      const result = triggerBobPaisleyDisaster(gamePlayers, activePlayerIndex, season);
      setGamePlayers(result.updatedPlayers);
      addNewsItems(result.newsItems);
      return;
    }
    if (eventId === "fastFoodAddiction") {
      const result = triggerFastFoodAddiction(gamePlayers, activePlayerIndex, season);
      setGamePlayers(result.updatedPlayers);
      addNewsItems(result.newsItems);
      return;
    }
    if (eventId === "breakupSeason") {
      const result = triggerBreakupSeason(gamePlayers, activePlayerIndex, season);
      setGamePlayers(result.updatedPlayers);
      addNewsItems(result.newsItems);
      return;
    }
    if (eventId === "casinoNight") {
      const result = triggerCasinoNight(gamePlayers, activePlayerIndex, season);
      setGamePlayers(result.updatedPlayers);
      addNewsItems(result.newsItems);
      return;
    }
    if (eventId === "oneSeasonWonder") {
      const result = triggerOneSeasonWonder(gamePlayers, activePlayerIndex, season);
      setGamePlayers(result.updatedPlayers);
      addNewsItems(result.newsItems);
      return;
    }
    if (eventId === "youTubeViral") {
      const result = triggerYouTubeViral(gamePlayers, activePlayerIndex, season);
      setGamePlayers(result.updatedPlayers);
      addNewsItems(result.newsItems);
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
      return;
    }
    const positive = ["ballonDor", "goldenBoy", "goldenBoot", "wonderkid", "saudiOffer", "recordTransfer"].includes(eventId);
    const result = forcedSpecificEvent(eventId, season, gamePlayers, activePlayerIndex);
    setGamePlayers(result.updatedPlayers);
    addNewsItems(result.newsItems);
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
  // TURN & SEASON
  // ============================================

  function endVersusTurn(updatedList?: GamePlayer[]) {
    setTimerActive(false);
    if (timerSeconds !== null) setTimer(timerSeconds);
    if (turnIndex === 0) { setTurnIndex(1); return; }
    setTurnIndex(0);
    nextSeason(updatedList);
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
    const eventResult = eventsEnabled
      ? createRandomSeasonEvent(newSeason, setupResult.updatedPlayers)
      : { event: null, updatedPlayers: setupResult.updatedPlayers, newsItems: [] };

    setSeason(newSeason);
    setTurnIndex(0);
    setPendingSlot(null);
    setSelectedSlot("");
    setTimerActive(false);
    setSeasonEvent(eventResult.event);
    setGamePlayers(eventResult.updatedPlayers);
    if (timerSeconds !== null) setTimer(timerSeconds);

    addNewsItems([
      ...setupResult.retirementNews,
      ...setupResult.salaryNews,
      ...setupResult.sponsorshipNews,
      setupResult.seasonNews,
      ...eventResult.newsItems,
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

  if (!started) {
    return <StartScreen onStart={startGame} onContinue={handleLoadSave} />;
  }

  const hasModal = !!(auctionState || investorOffer || negotiation);
  const canNextSeason = mode === "single"
    ? singleCanNextSeason(gamePlayers, devSeasonUnlocked, pendingSlot, hasModal)
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
        onNextSeason={() => nextSeason()}
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
            </div>
            {/* News — 1 col */}
            <div className="xl:col-span-1 min-h-[700px]">
              <NewsFeed news={news} seasonEvent={seasonEvent} />
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
              <NewsFeed news={news} seasonEvent={seasonEvent} />
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

    </main>
  );
}