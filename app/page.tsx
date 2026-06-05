"use client";

import { useMemo, useState } from "react";

import type {
  AuctionState,
  BudgetMode,
  ContractOffer,
  EventChoiceState,
  EventType,
  GameLengthMode,
  GameMode,
  GamePlayer,
  InvestorOfferState,
  NewsItem,
  OwnedPlayer,
  Player,
  RewardCardType,
  SeasonEvent,
  Slot,
  TeamStarterState,
} from "./game/types";

import {
  CLASSIC_END_SEASON,
  START_SEASON,
} from "./game/constants";

import {
  createNewsItem,
  getOtherPlayerIndex,
  getSeasonStarter,
  slotToPosition,
} from "./game/helpers";

import {
  calculateAge,
  getPlayerValue,
} from "./game/valueEngine";

import {
  getSeasonStats,
} from "./game/statsEngine";

import {
  createContractOffer,
  updateContractOffer,
  willAcceptContract,
  acceptContract,
} from "./game/contractEngine";

import {
  tryGenerateSponsorship,
} from "./game/sponsorshipEngine";

import {
  applySalePurchaseBonus,
  canAdvanceSeason,
  getBankruptcyWinnerIndex,
  resetSeasonChances,
  applyAnnualEconomy,
} from "./game/economyEngine";

import {
  createEventChoiceOptions,
  applyEventToPlayer,
  applyRandomPlayerEventToOwner,
  createSharedMarketEvent,
} from "./game/eventEngine";

import {
  getEligibleRewardCards,
  unlockRewardCard,
  useRewardCard,
  reduceCardCooldowns,
} from "./game/rewardCardEngine";

import {
  createInvestorOfferState,
  canAffordInvestorOffer,
} from "./game/investorOfferEngine";

import {
  createAuctionPreviewState,
  startAuctionBidding,
  canAuctionBid,
  placeAuctionBid,
  surrenderAuction,
  finishAuctionByTimer,
} from "./game/auctionEngine";

import {
  createSinglePlayerSetup,
  createVersusSetup,
  createStarterState,
  updateSeasonStarter,
} from "./game/gameSetup";

import {
  getAllPlayers,
} from "./game/playerDatabase";

import {
  generateSelectionPool,
} from "./game/playerGenerator";

import StartScreen from "./components/StartScreen";
import TopBar from "./components/TopBar";
import TeamPanel from "./components/TeamPanel";
import Formation from "./components/Formation";
import PlayerSelectionModal from "./components/PlayerSelectionModal";
import ContractModal from "./components/ContractModal";
import OwnedPlayerModal from "./components/OwnedPlayerModal";
import RewardModal from "./components/RewardModal";
import EventChoiceModal from "./components/EventChoiceModal";
import InvestorOfferModal from "./components/InvestorOfferModal";
import AuctionModal from "./components/AuctionModal";
import NewsFeed from "./components/NewsFeed";
import StatisticsModal from "./components/StatisticsModal";
import EndGameModal from "./components/EndGameModal";
import DeveloperPanel, {
  DevEventId,
} from "./components/DeveloperPanel";
import HowToPlayModal from "./components/HowToPlayModal";

type SelectedOwnedState = {
  playerIndex: number;
  ownedIndex: number;
};

type ContractState = {
  player: Player;
  slot: Slot;
  playerIndex: number;
  marketValue: number;
  contract: ContractOffer;
};

type RewardState = {
  playerIndex: number;
  cards: RewardCardType[];
};

type ReplacementState = {
  ownerIndex: number;
  incomingPlayer: Player;
  price: number;
  candidates: OwnedPlayer[];
};

export default function Home() {

  const [mode, setMode] =
    useState<GameMode | null>(null);

  const [
    gameLengthMode,
    setGameLengthMode,
  ] =
    useState<GameLengthMode | null>(
      null
    );

  const [
    budgetMode,
    setBudgetMode,
  ] =
    useState<BudgetMode>(
      "balanced"
    );

  const [
    eventsEnabled,
    setEventsEnabled,
  ] =
    useState(true);

  const [
    eventType,
    setEventType,
  ] =
    useState<EventType>("all");

  const [
    selectedTime,
    setSelectedTime,
  ] =
    useState(15);

  const [
    teamOneName,
    setTeamOneName,
  ] =
    useState("Team 1");

  const [
    teamTwoName,
    setTeamTwoName,
  ] =
    useState("Team 2");

  const [
    started,
    setStarted,
  ] =
    useState(false);

  const [
    season,
    setSeason,
  ] =
    useState(START_SEASON);

  const [
    players,
    setPlayers,
  ] =
    useState<GamePlayer[]>([]);

  const [
    turnIndex,
    setTurnIndex,
  ] =
    useState(0);

  const [
    starterState,
    setStarterState,
  ] =
    useState<TeamStarterState | null>(
      null
    );

  const [
    message,
    setMessage,
  ] =
    useState("");

  const [
    showHowToPlay,
    setShowHowToPlay,
  ] =
    useState(false);

  const [
    showStats,
    setShowStats,
  ] =
    useState(false);

  const [
    showEndGame,
    setShowEndGame,
  ] =
    useState(false);

  const [
    showDeveloperPanel,
    setShowDeveloperPanel,
  ] =
    useState(false);

  const [
    seasonSecretClicks,
    setSeasonSecretClicks,
  ] =
    useState(0);

  const [
    news,
    setNews,
  ] =
    useState<NewsItem[]>([]);

  const [
    seasonEvent,
    setSeasonEvent,
  ] =
    useState<SeasonEvent | null>(null);

  const [
    selectedSlot,
    setSelectedSlot,
  ] =
    useState<Slot | null>(null);

  const [
    selectionOptions,
    setSelectionOptions,
  ] =
    useState<Player[]>([]);

  const [
    selectedPlayerPreview,
    setSelectedPlayerPreview,
  ] =
    useState<Player | null>(null);

  const [
    selectionTimer,
    setSelectionTimer,
  ] =
    useState(selectedTime);

  const [
    contractState,
    setContractState,
  ] =
    useState<ContractState | null>(
      null
    );

  const [
    selectedOwned,
    setSelectedOwned,
  ] =
    useState<SelectedOwnedState | null>(
      null
    );

  const [
    rewardState,
    setRewardState,
  ] =
    useState<RewardState | null>(null);

  const [
    eventChoiceState,
    setEventChoiceState,
  ] =
    useState<EventChoiceState | null>(
      null
    );

  const [
    investorOffer,
    setInvestorOffer,
  ] =
    useState<InvestorOfferState | null>(
      null
    );

  const [
    auctionState,
    setAuctionState,
  ] =
    useState<AuctionState | null>(
      null
    );

  const [
    replacementState,
    setReplacementState,
  ] =
    useState<ReplacementState | null>(
      null
    );

  const allPlayers =
    useMemo(
      () => getAllPlayers(),
      []
    );

  const activePlayer =
    players[turnIndex];

  const winnerText =
    getWinnerText();

  function getWinnerText() {
    if (players.length === 0) {
      return "";
    }

    const sorted =
      [...players].sort(
        (a, b) =>
          b.budget - a.budget
      );

    return `${sorted[0].teamName} wins with €${Math.round(
      sorted[0].budget
    )}M`;
  }

  function getOwnedAge(
    owned: OwnedPlayer
  ) {
    return calculateAge(
      owned.player,
      season
    );
  }

  function getOwnedValue(
    owned: OwnedPlayer
  ) {
    return getPlayerValue(
      owned.player,
      season,
      seasonEvent?.marketMultiplier ??
        1
    );
  }

  function getPlayerCurrentValue(
    player: Player
  ) {
    return getPlayerValue(
      player,
      season,
      seasonEvent?.marketMultiplier ??
        1
    );
  }

  function getPlayerCurrentAge(
    player: Player
  ) {
    return calculateAge(
      player,
      season
    );
  }

  function addNews(
    title: string,
    description: string,
    tone:
      | "good"
      | "bad"
      | "neutral"
      | "special" = "neutral"
  ) {
    setNews((current) => [
      createNewsItem(
        season,
        title,
        description,
        tone
      ),
      ...current,
    ]);
  }

  function startGame(
    firstStarter: number
  ) {
    const starter =
      createStarterState(
        firstStarter
      );

    const setupPlayers =
      mode === "versus"
        ? createVersusSetup(
            teamOneName,
            teamTwoName,
            budgetMode
          )
        : createSinglePlayerSetup(
            budgetMode
          );

    setStarterState(starter);

    setPlayers(setupPlayers);

    setTurnIndex(firstStarter);

    setStarted(true);

    setSeason(
      START_SEASON
    );

    setMessage(
      `Season ${START_SEASON} started`
    );

    addNews(
      "Game Started",
      "Football Investor has begun.",
      "special"
    );
  }

  function nextTurn() {
    if (
      mode !== "versus"
    ) {
      return;
    }

    setTurnIndex(
      getOtherPlayerIndex(
        turnIndex
      )
    );
  }

  function openSlot(
    playerIndex: number,
    slot: Slot
  ) {
    if (
      playerIndex !==
      turnIndex
    ) {
      return;
    }

    const options =
      generateSelectionPool(
        season,
        slot
      );

    setSelectedSlot(
      slot
    );

    setSelectionOptions(
      options
    );

    setSelectedPlayerPreview(
      null
    );

    setSelectionTimer(
      selectedTime
    );
  }

  function previewPlayer(
    player: Player
  ) {
    setSelectedPlayerPreview(
      player
    );
  }

  function backToPlayerList() {
    setSelectedPlayerPreview(
      null
    );
  }

  function createContractForSelection() {
    if (
      !selectedPlayerPreview ||
      !selectedSlot
    ) {
      return;
    }

    const marketValue =
      getPlayerCurrentValue(
        selectedPlayerPreview
      );

    setContractState({
      player:
        selectedPlayerPreview,
      slot: selectedSlot,
      playerIndex:
        turnIndex,
      marketValue,
      contract:
        createContractOffer(
          marketValue
        ),
    });
  }

  function updateContractValues(
    salary: number,
    years: number
  ) {
    if (
      !contractState
    ) {
      return;
    }

    setContractState({
      ...contractState,
      contract:
        updateContractOffer(
          contractState.marketValue,
          salary,
          years
        ),
    });
  }

  function confirmContract() {
    if (
      !contractState
    ) {
      return;
    }

    const accepted =
      willAcceptContract(
        contractState.contract
      );

    if (!accepted) {
      addNews(
        "Contract Rejected",
        `${contractState.player.name} rejected the contract.`,
        "bad"
      );

      setContractState(
        null
      );

      return;
    }

    const finalContract =
      acceptContract(
        contractState.contract
      );

    const sponsorship =
      tryGenerateSponsorship(
        contractState.marketValue
      );

    const ownedPlayer: OwnedPlayer =
      {
        player: {
          ...contractState.player,
          sponsorship,
        },

        slot:
          contractState.slot,

        buySeason:
          season,

        buyPrice:
          contractState.marketValue,

        contract:
          finalContract,
      };

    setPlayers(
      (current) =>
        current.map(
          (
            player,
            index
          ) => {
            if (
              index !==
              contractState.playerIndex
            ) {
              return player;
            }

            return {
              ...player,
              budget:
                player.budget -
                contractState.marketValue,

              purchaseChances:
                Math.max(
                  0,
                  player.purchaseChances -
                    1
                ),

              owned: [
                ...player.owned,
                ownedPlayer,
              ],
            };
          }
        )
    );

    addNews(
      "Transfer Completed",
      `${contractState.player.name} joined ${players[turnIndex]?.teamName}.`,
      "good"
    );

    setSelectedSlot(
      null
    );

    setSelectionOptions(
      []
    );

    setSelectedPlayerPreview(
      null
    );

    setContractState(
      null
    );

    if (
      mode === "versus"
    ) {
      nextTurn();
    }
  }

  function closeSelection() {
    setSelectedSlot(
      null
    );

    setSelectionOptions(
      []
    );

    setSelectedPlayerPreview(
      null
    );
  }

  function openOwnedPlayer(
    playerIndex: number,
    ownedIndex: number
  ) {
    setSelectedOwned({
      playerIndex,
      ownedIndex,
    });
  }

  function closeOwnedPlayer() {
    setSelectedOwned(null);
  }

  function sellSelectedPlayer() {
    if (!selectedOwned) {
      return;
    }

    const owner =
      players[selectedOwned.playerIndex];

    const owned =
      owner?.owned[
        selectedOwned.ownedIndex
      ];

    if (!owner || !owned) {
      return;
    }

    const sellPrice =
      getOwnedValue(owned);

    const profit =
      sellPrice -
      owned.buyPrice;

    setPlayers((current) =>
      current.map(
        (player, index) => {
          if (
            index !==
            selectedOwned.playerIndex
          ) {
            return player;
          }

          return applySalePurchaseBonus({
            ...player,
            budget:
              player.budget +
              sellPrice,

            sellChances:
              Math.max(
                0,
                player.sellChances -
                  1
              ),

            owned:
              player.owned.filter(
                (_, i) =>
                  i !==
                  selectedOwned.ownedIndex
              ),

            sold: [
              {
                owner:
                  player.teamName,

                name:
                  owned.player.name,

                buySeason:
                  owned.buySeason,

                sellSeason:
                  season,

                buyPrice:
                  owned.buyPrice,

                sellPrice,

                profit,
              },

              ...player.sold,
            ],
          });
        }
      )
    );

    addNews(
      "Player Sold",
      `${owned.player.name} sold for €${sellPrice}M.`,
      profit >= 0
        ? "good"
        : "bad"
    );

    const rewardCards =
      getEligibleRewardCards(
        sellPrice,
        owner
      );

    if (
      rewardCards.length > 0
    ) {
      setRewardState({
        playerIndex:
          selectedOwned.playerIndex,
        cards:
          rewardCards,
      });
    }

    setSelectedOwned(
      null
    );
  }

  function chooseRewardCard(
    card: RewardCardType
  ) {
    if (
      !rewardState
    ) {
      return;
    }

    setPlayers((current) =>
      current.map(
        (player, index) => {
          if (
            index !==
            rewardState.playerIndex
          ) {
            return player;
          }

          const unlocked =
            unlockRewardCard(
              player,
              card
            );

          return unlocked;
        }
      )
    );

    addNews(
      "Reward Unlocked",
      `${card} unlocked.`,
      "special"
    );

    setRewardState(
      null
    );
  }

  function useCard(
    playerIndex: number,
    card: RewardCardType
  ) {
    setPlayers((current) =>
      current.map(
        (player, index) => {
          if (
            index !==
            playerIndex
          ) {
            return player;
          }

          return useRewardCard(
            player,
            card
          );
        }
      )
    );
  }

  function nextSeason() {
    if (
      !canAdvanceSeason(players)
    ) {
      setMessage(
        "All teams must finish their buy chances or skip."
      );
      return;
    }

    const bankruptcyWinner =
      getBankruptcyWinnerIndex(
        players
      );

    if (
      bankruptcyWinner !== null
    ) {
      setShowEndGame(true);
      return;
    }

    const newSeason =
      season + 1;

    if (
      gameLengthMode ===
        "classic" &&
      newSeason >
        CLASSIC_END_SEASON
    ) {
      setShowEndGame(true);
      return;
    }

    const updatedPlayers =
      players.map((player) => ({
        ...applyAnnualEconomy(
          resetSeasonChances({
            ...player,
            cards:
              reduceCardCooldowns(
                player.cards
              ),
          })
        ),
      }));

    setPlayers(
      updatedPlayers
    );

    setSeason(
      newSeason
    );

    if (
      starterState
    ) {
      const updatedStarter =
        updateSeasonStarter(
          starterState,
          newSeason
        );

      setStarterState(
        updatedStarter
      );

      setTurnIndex(
        updatedStarter.currentSeasonStarter
      );
    }

    setSeasonEvent(
      null
    );

    setMessage(
      `Season ${newSeason}`
    );

    addNews(
      `Season ${newSeason}`,
      "A new season has begun.",
      "special"
    );
  }

  function skipTurn() {
    setPlayers(
      (current) =>
        current.map(
          (
            player,
            index
          ) => {
            if (
              index !==
              turnIndex
            ) {
              return player;
            }

            return {
              ...player,
              skippedTurn:
                true,
            };
          }
        )
    );

    if (
      mode === "versus"
    ) {
      nextTurn();
    }
  }

  function openInvestorOffer() {
    const offer =
      createInvestorOfferState(
        allPlayers,
        season,
        players,
        turnIndex,
        (player) =>
          getPlayerCurrentValue(
            player
          )
      );

    if (
      !offer
    ) {
      return;
    }

    setInvestorOffer(
      offer
    );
  }

  function acceptInvestorOffer() {
    if (
      !investorOffer
    ) {
      return;
    }

    const owner =
      players[
        investorOffer
          .targetPlayerIndex
      ];

    if (
      !canAffordInvestorOffer(
        investorOffer,
        owner
      )
    ) {
      setInvestorOffer(
        null
      );

      addNews(
        "Offer Failed",
        "Not enough budget.",
        "bad"
      );

      return;
    }

    addNews(
      "Investor Offer Accepted",
      `${investorOffer.selectedPlayer.name} joined ${owner.teamName}.`,
      "good"
    );

    setInvestorOffer(
      null
    );
  }

  function rejectInvestorOffer() {
    setInvestorOffer(
      null
    );
  }

  function startAuction() {
    const candidates =
      allPlayers
        .filter(
          (player) =>
            player.availableSeason ===
            season
        )
        .slice(0, 3);

    if (candidates.length === 0) {
      return;
    }

    setAuctionState(
      createAuctionPreviewState(
        candidates
      )
    );
  }

  function moveAuctionToBidding() {
    if (!auctionState) {
      return;
    }

    setAuctionState(
      startAuctionBidding(
        auctionState,
        (player) =>
          getPlayerCurrentValue(
            player
          )
      )
    );
  }

  function bidAuction(
    playerIndex: number
  ) {
    if (!auctionState) {
      return;
    }

    if (
      !canAuctionBid(
        auctionState,
        players[playerIndex],
        playerIndex
      )
    ) {
      return;
    }

    setAuctionState(
      placeAuctionBid(
        auctionState,
        playerIndex
      )
    );
  }

  function surrenderCurrentAuction(
    playerIndex: number
  ) {
    if (!auctionState) {
      return;
    }

    const finished =
      surrenderAuction(
        auctionState,
        playerIndex
      );

    setAuctionState(
      finished
    );

    addNews(
      "Auction Finished",
      "Auction ended by surrender.",
      "special"
    );
  }

  function finishAuctionTimer() {
    if (!auctionState) {
      return;
    }

    setAuctionState(
      finishAuctionByTimer(
        auctionState
      )
    );
  }

  function triggerDeveloperEvent(
    eventId: DevEventId
  ) {
    if (eventId === "legendaryAuction") {
      startAuction();
      return;
    }

    if (eventId === "investorOffer") {
      openInvestorOffer();
      return;
    }

    if (eventId === "hotMarket") {
      const result =
        createSharedMarketEvent(
          season,
          true
        );

      setSeasonEvent(
        result.event
      );

      setNews((current) => [
        result.newsItem,
        ...current,
      ]);

      return;
    }

    if (eventId === "marketCrash") {
      const result =
        createSharedMarketEvent(
          season,
          false
        );

      setSeasonEvent(
        result.event
      );

      setNews((current) => [
        result.newsItem,
        ...current,
      ]);

      return;
    }

    const positive =
      [
        "saudiOffer",
        "ballonDor",
        "goldenBoy",
        "goldenBoot",
        "recordTransfer",
        "wonderkid",
      ].includes(eventId);

    const result =
      applyRandomPlayerEventToOwner(
        season,
        players,
        turnIndex,
        positive
      );

    setPlayers(
      result.updatedPlayers
    );

    if (result.newsItem) {
      setNews((current) => [
        result.newsItem!,
        ...current,
      ]);
    }
  }

  function handleSeasonSecretClick() {
    const next =
      seasonSecretClicks + 1;

    setSeasonSecretClicks(
      next
    );

    if (next >= 20) {
      setShowDeveloperPanel(true);
    }
  }

  function applyEventChoice(
    event: EventChoiceState["events"][number]
  ) {
    if (!eventChoiceState) {
      return;
    }

    setPlayers((current) =>
      current.map(
        (player, index) => {
          if (
            index !==
            eventChoiceState.playerIndex
          ) {
            return player;
          }

          if (player.owned.length === 0) {
            return player;
          }

          const firstOwned =
            player.owned[0];

          return {
            ...player,
            owned: [
              {
                ...firstOwned,
                player:
                  applyEventToPlayer(
                    firstOwned.player,
                    season,
                    event
                  ),
              },
              ...player.owned.slice(1),
            ],
          };
        }
      )
    );

    setEventChoiceState(null);
  }

  const devEvents: {
    id: DevEventId;
    label: string;
  }[] = [
    { id: "hotMarket", label: "🔥 Hot Market" },
    { id: "saudiOffer", label: "💰 Saudi Offer" },
    { id: "ballonDor", label: "🏆 Ballon d'Or" },
    { id: "goldenBoy", label: "🌟 Golden Boy" },
    { id: "goldenBoot", label: "👟 Golden Boot" },
    { id: "recordTransfer", label: "💸 Record Transfer" },
    { id: "wonderkid", label: "🚀 Wonderkid" },
    { id: "aclInjury", label: "🤕 ACL Injury" },
    { id: "majorInjury", label: "🚑 Major Injury" },
    { id: "benchWarmer", label: "🪑 Bench Warmer" },
    { id: "failedTransfer", label: "📉 Failed Transfer" },
    { id: "freeTransfer", label: "💔 Free Transfer" },
    { id: "marketCrash", label: "📉 Market Crash" },
    { id: "retirement", label: "👋 Retirement Check" },
    { id: "investorOffer", label: "💼 Investor Offer" },
    { id: "legendaryAuction", label: "🏆 Legendary Auction" },
  ];

  const selectedOwnedPlayer =
    selectedOwned
      ? players[
          selectedOwned.playerIndex
        ]?.owned[
          selectedOwned.ownedIndex
        ] ?? null
      : null;

  if (!started) {
    return (
      <>
        <StartScreen
          mode={mode}
          setMode={setMode}
          gameLengthMode={gameLengthMode}
          setGameLengthMode={setGameLengthMode}
          budgetMode={budgetMode}
          setBudgetMode={setBudgetMode}
          eventsEnabled={eventsEnabled}
          setEventsEnabled={setEventsEnabled}
          eventType={eventType}
          setEventType={setEventType}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          teamOneName={teamOneName}
          setTeamOneName={setTeamOneName}
          teamTwoName={teamTwoName}
          setTeamTwoName={setTeamTwoName}
          onStart={startGame}
          onOpenHowToPlay={() =>
            setShowHowToPlay(true)
          }
        />

        <HowToPlayModal
          open={showHowToPlay}
          onClose={() =>
            setShowHowToPlay(false)
          }
        />
      </>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-4">
      <div className="max-w-7xl mx-auto">

        <TopBar
          season={season}
          mode={mode ?? "single"}
          gameLengthMode={
            gameLengthMode ?? "classic"
          }
          currentTeamName={
            players[turnIndex]?.teamName ??
            ""
          }
          message={message}
          onSeasonClick={
            handleSeasonSecretClick
          }
          onRestart={() =>
            window.location.reload()
          }
          onOpenHowToPlay={() =>
            setShowHowToPlay(true)
          }
        />

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {players.map((player, index) => (
            <TeamPanel
              key={player.teamName}
              player={player}
              active={index === turnIndex}
            />
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {players.map((player, index) => (
            <Formation
              key={player.teamName}
              player={player}
              playerIndex={index}
              active={index === turnIndex}
              season={season}
              getCurrentValue={getOwnedValue}
              getAge={getOwnedAge}
              onSelectSlot={openSlot}
              onSelectOwned={openOwnedPlayer}
            />
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <button
            onClick={skipTurn}
            className="px-5 py-3 rounded-xl bg-zinc-700 transition-all active:scale-95"
          >
            Skip Turn
          </button>

          <button
            onClick={nextSeason}
            className="px-5 py-3 rounded-xl bg-yellow-700 transition-all active:scale-95"
          >
            Next Season
          </button>

          <button
            onClick={startAuction}
            className="px-5 py-3 rounded-xl bg-purple-700 transition-all active:scale-95"
          >
            Legendary Auction
          </button>

          <button
            onClick={openInvestorOffer}
            className="px-5 py-3 rounded-xl bg-green-700 transition-all active:scale-95"
          >
            Investor Offer
          </button>

          <button
            onClick={() =>
              setShowStats(true)
            }
            className="px-5 py-3 rounded-xl bg-blue-700 transition-all active:scale-95"
          >
            Statistics
          </button>
        </div>

        <NewsFeed
          news={news}
          seasonEvent={seasonEvent}
        />

        <PlayerSelectionModal
          open={!!selectedSlot}
          slot={selectedSlot}
          season={season}
          budget={
            activePlayer?.budget ?? 0
          }
          timer={selectionTimer}
          players={selectionOptions}
          selectedPlayer={
            selectedPlayerPreview
          }
          getPlayerValue={
            getPlayerCurrentValue
          }
          getPlayerAge={
            getPlayerCurrentAge
          }
          onPreviewPlayer={
            previewPlayer
          }
          onBackToList={
            backToPlayerList
          }
          onBuyPlayer={
            createContractForSelection
          }
          onClose={
            closeSelection
          }
        />

        <ContractModal
          open={!!contractState}
          player={
            contractState?.player ??
            null
          }
          marketValue={
            contractState?.marketValue ??
            0
          }
          contract={
            contractState?.contract ??
            null
          }
          onChangeContract={
            updateContractValues
          }
          onConfirm={
            confirmContract
          }
          onCancel={() =>
            setContractState(null)
          }
        />

        <OwnedPlayerModal
          open={!!selectedOwnedPlayer}
          ownedPlayer={
            selectedOwnedPlayer
          }
          currentValue={
            selectedOwnedPlayer
              ? getOwnedValue(
                  selectedOwnedPlayer
                )
              : 0
          }
          currentAge={
            selectedOwnedPlayer
              ? getOwnedAge(
                  selectedOwnedPlayer
                )
              : 0
          }
          sellChances={
            activePlayer?.sellChances ??
            0
          }
          onSell={
            sellSelectedPlayer
          }
          onClose={
            closeOwnedPlayer
          }
        />

        <RewardModal
          open={!!rewardState}
          cards={
            rewardState?.cards ?? []
          }
          onChoose={
            chooseRewardCard
          }
        />

        <EventChoiceModal
          open={!!eventChoiceState}
          events={
            eventChoiceState?.events ??
            []
          }
          onChoose={
            applyEventChoice
          }
        />

        <InvestorOfferModal
          open={!!investorOffer}
          offer={investorOffer}
          teamName={
            activePlayer?.teamName ??
            ""
          }
          onAccept={
            acceptInvestorOffer
          }
          onReject={
            rejectInvestorOffer
          }
        />

        <AuctionModal
          open={!!auctionState}
          state={auctionState}
          players={players}
          canBid={(index) =>
            auctionState
              ? canAuctionBid(
                  auctionState,
                  players[index],
                  index
                )
              : false
          }
          onBid={bidAuction}
          onSurrender={
            surrenderCurrentAuction
          }
        />

        <StatisticsModal
          open={showStats}
          players={players}
          onClose={() =>
            setShowStats(false)
          }
        />

        <EndGameModal
          open={showEndGame}
          players={players}
          winnerText={winnerText}
          onShowStats={() =>
            setShowStats(true)
          }
          onRestart={() =>
            window.location.reload()
          }
        />

        <DeveloperPanel
          open={
            showDeveloperPanel
          }
          events={devEvents}
          onTriggerEvent={
            triggerDeveloperEvent
          }
          onClose={() =>
            setShowDeveloperPanel(
              false
            )
          }
        />

        <HowToPlayModal
          open={showHowToPlay}
          onClose={() =>
            setShowHowToPlay(false)
          }
        />

      </div>
    </main>
  );
}