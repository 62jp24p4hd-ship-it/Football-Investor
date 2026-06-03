"use client";

import { useEffect, useMemo, useState } from "react";
import { players2008 } from "./data/players2008";
import { players2009 } from "./data/players2009";
import { players2010 } from "./data/players2010";
import { players2011 } from "./data/players2011";
import { players2012 } from "./data/players2012";
import { players2013 } from "./data/players2013";
import { players2014 } from "./data/players2014";
import { players2015 } from "./data/players2015";
import { players2016 } from "./data/players2016";
import { players2017 } from "./data/players2017";

type Player = {
  name: string;
  position: string;
  availableSeason: number;
  startAge: number;
  nationality: string;
  height: number;
  league: string;
  games?: number;
  goals?: number;
  assists?: number;
  cleanSheets?: number;
  yellowCards?: number;
  redCards?: number;
  rating?: number;
  secret?: boolean;
  values: Record<number, number>;
};

type Owned = {
  player: Player;
  slot: string;
  buySeason: number;
  buyPrice: number;
};

type Sold = {
  owner: string;
  name: string;
  buySeason: number;
  sellSeason: number;
  buyPrice: number;
  sellPrice: number;
  profit: number;
};

type CardData = {
  unlocked: boolean;
  used: boolean;
};

type Cards = {
  freeze: CardData;
  triple: CardData;
  steal: CardData;
};

type GamePlayer = {
  name: string;
  budget: number;
  owned: Owned[];
  sold: Sold[];
  purchaseChances: number;
  cards: Cards;
  tripleNextSeason: boolean;
  frozenSeason: number | null;
};

type RewardCard = "freeze" | "triple" | "steal";

const START_BUDGET = 30;

const secretPlayers: Player[] = [
  {
    name: "Yousef Alnuwasser",
    position: "ST",
    availableSeason: 2016,
    startAge: 18,
    nationality: "Saudi Arabia",
    height: 185,
    league: "Saudi Pro League",
    games: 38,
    goals: 70,
    assists: 30,
    rating: 10,
    secret: true,
    values: {
      2016: 100,
      2017: 200,
      2018: 300,
      2019: 400,
      2020: 600,
      2021: 800,
    },
  },
];

const basePlayers: Player[] = [
  ...players2008,
  ...players2009,
  ...players2010,
  ...players2011,
  ...players2012,
  ...players2013,
  ...players2014,
  ...players2015,
  ...players2016,
  ...players2017,
];

const formation433 = [
  ["LW", "", "ST", "", "RW"],
  ["", "", "CAM", "", ""],
  ["", "LCM", "", "RCM", ""],
  ["LB", "LCB", "", "RCB", "RB"],
  ["", "", "GK", "", ""],
];

function slotToPosition(slot: string) {
  if (slot === "LCM" || slot === "RCM") return "CM";
  if (slot === "LCB" || slot === "RCB") return "CB";
  return slot;
}

function shuffle<T>(list: T[]) {
  return [...list].sort(() => Math.random() - 0.5);
}

function emptyCards(): Cards {
  return {
    freeze: { unlocked: false, used: false },
    triple: { unlocked: false, used: false },
    steal: { unlocked: false, used: false },
  };
}

function createPlayers(): GamePlayer[] {
  return [
    {
      name: "Player 1",
      budget: START_BUDGET,
      owned: [],
      sold: [],
      purchaseChances: 1,
      cards: emptyCards(),
      tripleNextSeason: false,
      frozenSeason: null,
    },
    {
      name: "Player 2",
      budget: START_BUDGET,
      owned: [],
      sold: [],
      purchaseChances: 1,
      cards: emptyCards(),
      tripleNextSeason: false,
      frozenSeason: null,
    },
  ];
}

export default function Home() {
  const [mode, setMode] = useState<"single" | "versus" | null>(null);
  const [started, setStarted] = useState(false);
  const [season, setSeason] = useState(2008);
  const [gamePlayers, setGamePlayers] = useState<GamePlayer[]>(createPlayers());
  const [selectedSlot, setSelectedSlot] = useState("");
  const [showEndModal, setShowEndModal] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [timer, setTimer] = useState(15);
  const [timerActive, setTimerActive] = useState(false);
  const [turnIndex, setTurnIndex] = useState(0);

  const [easterClicks, setEasterClicks] = useState(0);
  const [easterUnlocked, setEasterUnlocked] = useState(false);

  const [message, setMessage] = useState("");
  const [rewardChoice, setRewardChoice] = useState<{
    playerIndex: number;
    cards: RewardCard[];
  } | null>(null);

  const [stealChallenge, setStealChallenge] = useState<{
    userIndex: number;
    showHelp: boolean;
    success: boolean;
    ownIndex: number | null;
    enemyIndex: number | null;
  } | null>(null);

  const activePlayerIndex = mode === "versus" ? turnIndex : 0;
  const activePlayer = gamePlayers[activePlayerIndex];
  const isFrozen = activePlayer?.frozenSeason === season;

  const players = useMemo<Player[]>(() => {
    return easterUnlocked ? [...basePlayers, ...secretPlayers] : basePlayers;
  }, [easterUnlocked]);

  function currentValue(player: Player) {
    return player.values[season] ?? player.values[2021] ?? 1;
  }

  function currentAge(player: Player) {
    return player.startAge + (season - player.availableSeason);
  }

  function getOwnedBySlot(playerIndex: number, slot: string) {
    return gamePlayers[playerIndex].owned.find((item) => item.slot === slot);
  }

  function getOptions(slot: string, playerIndex: number): Player[] {
    const realPosition = slotToPosition(slot);

    return shuffle(
      players.filter(
        (p) =>
          p.position === realPosition &&
          p.availableSeason === season &&
          !gamePlayers.some((team) =>
            team.owned.some((item) => item.player.name === p.name)
          )
      )
    ).slice(0, 5);
  }

  const options = useMemo<Player[]>(() => {
    if (!selectedSlot) return [];
    return getOptions(selectedSlot, activePlayerIndex);
  }, [selectedSlot, activePlayerIndex, season, gamePlayers, players]);

  function notify(text: string) {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  }

  function updateGamePlayer(index: number, newData: GamePlayer) {
    setGamePlayers((prev) => prev.map((p, i) => (i === index ? newData : p)));
  }

  function endVersusTurn() {
    if (turnIndex === 0) {
      setTurnIndex(1);
      setSelectedSlot("");
      setTimerActive(false);
      setTimer(selectedTime ?? 15);
    } else {
      setTurnIndex(0);
      setTimeout(() => nextSeason(), 400);
    }
  }

  function buyPlayer(player: Player, slot: string = selectedSlot) {
    const gp = gamePlayers[activePlayerIndex];
    const price = currentValue(player);

    if (!slot) return;
    if (isFrozen) return notify("هذا اللاعب مجمد هذا الموسم 🧊");
    if (gp.purchaseChances <= 0) return notify("ما عندك فرص شراء متبقية");
    if (gp.budget < price) return notify("الميزانية غير كافية");
    if (getOwnedBySlot(activePlayerIndex, slot)) return;

    const newPlayer: GamePlayer = {
      ...gp,
      budget: gp.budget - price,
      purchaseChances: gp.purchaseChances - 1,
      owned: [...gp.owned, { player, slot, buySeason: season, buyPrice: price }],
    };

    updateGamePlayer(activePlayerIndex, newPlayer);
    setSelectedSlot("");
    setTimerActive(false);

    if (mode === "versus") {
      endVersusTurn();
    }
  }

  function eligibleCards(gp: GamePlayer, sellPrice: number): RewardCard[] {
    const cards: RewardCard[] = [];

    if (sellPrice >= 20 && !gp.cards.freeze.unlocked && !gp.cards.freeze.used) {
      cards.push("freeze");
    }

    if (sellPrice >= 40 && !gp.cards.triple.unlocked && !gp.cards.triple.used) {
      cards.push("triple");
    }

    if (sellPrice >= 50 && !gp.cards.steal.unlocked && !gp.cards.steal.used) {
      cards.push("steal");
    }

    return cards;
  }

  function sellPlayer(playerIndex: number, ownedIndex: number) {
    const gp = gamePlayers[playerIndex];
    const item = gp.owned[ownedIndex];
    const sellPrice = currentValue(item.player);
    const profit = sellPrice - item.buyPrice;
    const yearsOwned = season - item.buySeason;

    const extraChances = yearsOwned >= 3 ? 2 : 1;

    const soldItem: Sold = {
      owner: gp.name,
      name: item.player.name,
      buySeason: item.buySeason,
      sellSeason: season,
      buyPrice: item.buyPrice,
      sellPrice,
      profit,
    };

    const newPlayer: GamePlayer = {
      ...gp,
      budget: gp.budget + sellPrice,
      purchaseChances: gp.purchaseChances + extraChances,
      sold: [soldItem, ...gp.sold],
      owned: gp.owned.filter((_, i) => i !== ownedIndex),
    };

    updateGamePlayer(playerIndex, newPlayer);

    notify(
      yearsOwned >= 3
        ? "تم البيع ✅ حصلت على فرصة شراء إضافية + مكافأة 3 مواسم 🎟️"
        : "تم البيع ✅ حصلت على فرصة شراء إضافية 🎟️"
    );

    const cards = eligibleCards(gp, sellPrice);
    if (cards.length > 0) {
      setRewardChoice({ playerIndex, cards });
    }
  }

  function chooseReward(card: RewardCard) {
    if (!rewardChoice) return;

    setGamePlayers((prev) =>
      prev.map((gp, i) => {
        if (i !== rewardChoice.playerIndex) return gp;

        return {
          ...gp,
          cards: {
            ...gp.cards,
            [card]: { unlocked: true, used: false },
          },
        };
      })
    );

    setRewardChoice(null);
    notify("تم فتح كرت خاص ✅");
  }

  function autoPickFromSelectedSlot() {
    const gp = gamePlayers[activePlayerIndex];

    if (!selectedSlot) return;
    if (gp.purchaseChances <= 0) return;
    if (isFrozen) return;

    const affordable = options.filter((p) => currentValue(p) <= gp.budget);

    if (affordable.length === 0) {
      setSelectedSlot("");
      setTimerActive(false);

      if (mode === "versus") {
        endVersusTurn();
      }

      return;
    }

    const randomPlayer =
      affordable[Math.floor(Math.random() * affordable.length)];

    buyPlayer(randomPlayer, selectedSlot);
  }

  function finishGame() {
    const finalPlayers = gamePlayers.map((gp) => {
      const autoSold: Sold[] = gp.owned.map((item) => {
        const sellPrice = item.player.values[2021] ?? currentValue(item.player);

        return {
          owner: gp.name,
          name: item.player.name,
          buySeason: item.buySeason,
          sellSeason: 2021,
          buyPrice: item.buyPrice,
          sellPrice,
          profit: sellPrice - item.buyPrice,
        };
      });

      const autoMoney = autoSold.reduce((sum, s) => sum + s.sellPrice, 0);

      return {
        ...gp,
        budget: gp.budget + autoMoney,
        sold: [...autoSold, ...gp.sold],
        owned: [],
      };
    });

    setGamePlayers(finalPlayers);
    setShowEndModal(true);
  }

  function setupSeason(newSeason: number) {
    setGamePlayers((prev) =>
      prev.map((gp) => {
        const chances = gp.tripleNextSeason ? 3 : 1;

        return {
          ...gp,
          purchaseChances: gp.frozenSeason === newSeason ? 0 : chances,
          tripleNextSeason: false,
        };
      })
    );
  }

  function nextSeason() {
    if (season >= 2021) {
      finishGame();
      return;
    }

    const newSeason = season + 1;

    setSeason(newSeason);
    setTurnIndex(0);
    setSelectedSlot("");
    setTimerActive(false);
    setTimer(selectedTime ?? 15);
    setupSeason(newSeason);
  }

  function restartGame() {
    setStarted(false);
    setMode(null);
    setSeason(2008);
    setTurnIndex(0);
    setGamePlayers(createPlayers());
    setSelectedSlot("");
    setShowEndModal(false);
    setShowStats(false);
    setSelectedTime(null);
    setTimer(15);
    setTimerActive(false);
    setRewardChoice(null);
    setStealChallenge(null);
  }

  function totalProfit(playerIndex: number) {
    return gamePlayers[playerIndex].sold.reduce((sum, s) => sum + s.profit, 0);
  }

  function getWinnerText() {
    const p1Profit = totalProfit(0);
    const p2Profit = totalProfit(1);

    if (mode === "single") return `Total Profit / Loss: €${p1Profit}M`;
    if (p1Profit > p2Profit) return "Winner: Player 1";
    if (p2Profit > p1Profit) return "Winner: Player 2";
    return "Draw";
  }

  function startGame() {
    if (!mode || !selectedTime) return;

    setStarted(true);
    setSeason(2008);
    setTurnIndex(0);
    setGamePlayers(createPlayers());
    setTimer(selectedTime);
    setTimerActive(false);
  }

  function selectSlot(slot: string) {
    if (isFrozen) return notify("أنت مجمد هذا الموسم 🧊");
    if (activePlayer.purchaseChances <= 0) return notify("ما عندك فرص شراء");

    setSelectedSlot(slot);
    setTimer(selectedTime ?? 15);
    setTimerActive(true);
  }

  function cardName(card: RewardCard) {
    if (card === "freeze") return "🧊 Freeze Card";
    if (card === "triple") return "⚡ Triple Buy Card";
    return "🕵️ Steal Card";
  }

  function lockedMessage(card: RewardCard) {
    if (card === "freeze") return "لفتح Freeze Card: بع لاعب بقيمة €20M أو أكثر";
    if (card === "triple") return "لفتح Triple Buy Card: بع لاعب بقيمة €40M أو أكثر";
    return "لفتح Steal Card: بع لاعب بقيمة €50M أو أكثر";
  }

  function useFreezeCard(playerIndex: number) {
    if (mode !== "versus") return notify("كرت التجميد يعمل ضد صديق فقط");

    const enemyIndex = playerIndex === 0 ? 1 : 0;

    setGamePlayers((prev) =>
      prev.map((gp, i) => {
        if (i === playerIndex) {
          return {
            ...gp,
            cards: {
              ...gp.cards,
              freeze: { unlocked: true, used: true },
            },
          };
        }

        if (i === enemyIndex) {
          return {
            ...gp,
            frozenSeason: season + 1,
          };
        }

        return gp;
      })
    );

    notify("تم استخدام كرت التجميد 🧊 الخصم سيتجمد الموسم القادم");
  }

  function useTripleCard(playerIndex: number) {
    setGamePlayers((prev) =>
      prev.map((gp, i) =>
        i === playerIndex
          ? {
              ...gp,
              tripleNextSeason: true,
              cards: {
                ...gp.cards,
                triple: { unlocked: true, used: true },
              },
            }
          : gp
      )
    );

    notify("تم استخدام Triple Buy ⚡ الموسم القادم عندك 3 فرص شراء");
  }

  function useStealCard(playerIndex: number) {
    if (mode !== "versus") return notify("كرت السرقة يعمل ضد صديق فقط");

    setGamePlayers((prev) =>
      prev.map((gp, i) =>
        i === playerIndex
          ? {
              ...gp,
              cards: {
                ...gp.cards,
                steal: { unlocked: true, used: true },
              },
            }
          : gp
      )
    );

    setStealChallenge({
      userIndex: playerIndex,
      showHelp: false,
      success: false,
      ownIndex: null,
      enemyIndex: null,
    });
  }

  function swapPlayers() {
    if (!stealChallenge) return;

    const userIndex = stealChallenge.userIndex;
    const enemyIndex = userIndex === 0 ? 1 : 0;

    if (stealChallenge.ownIndex === null || stealChallenge.enemyIndex === null) {
      return notify("اختر لاعب منك ولاعب من الخصم");
    }

    setGamePlayers((prev) => {
      const copy = [...prev];

      const user = {
        ...copy[userIndex],
        owned: [...copy[userIndex].owned],
      };

      const enemy = {
        ...copy[enemyIndex],
        owned: [...copy[enemyIndex].owned],
      };

      const userPlayer = user.owned[stealChallenge.ownIndex!];
      const enemyPlayer = enemy.owned[stealChallenge.enemyIndex!];

      user.owned[stealChallenge.ownIndex!] = {
        ...enemyPlayer,
        slot: userPlayer.slot,
      };

      enemy.owned[stealChallenge.enemyIndex!] = {
        ...userPlayer,
        slot: enemyPlayer.slot,
      };

      copy[userIndex] = user;
      copy[enemyIndex] = enemy;

      return copy;
    });

    setStealChallenge(null);
    notify("تم تبديل اللاعبين بنجاح 🕵️");
  }

  useEffect(() => {
    if (!started || !timerActive || showEndModal) return;
    if (!selectedSlot) return;

    if (timer <= 0) {
      autoPickFromSelectedSlot();
      return;
    }

    const interval = setTimeout(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(interval);
  }, [timer, timerActive, selectedSlot, started, showEndModal]);

  function renderCards(playerIndex: number) {
    const gp = gamePlayers[playerIndex];
    const cards: RewardCard[] = ["freeze", "triple", "steal"];

    return (
      <div className="mt-4 bg-black/30 border border-gray-700 rounded-xl p-3">
        <h3 className="font-bold mb-2">Special Cards</h3>

        <div className="flex flex-wrap gap-2">
          {cards.map((card) => {
            const data = gp.cards[card];

            if (data.used) {
              return (
                <button
                  key={card}
                  className="bg-gray-700 px-3 py-2 rounded-lg text-sm"
                >
                  ✅ {cardName(card)} Used
                </button>
              );
            }

            if (!data.unlocked) {
              return (
                <button
                  key={card}
                  onClick={() => notify(lockedMessage(card))}
                  className="bg-zinc-800 border border-gray-600 px-3 py-2 rounded-lg text-sm"
                >
                  🔒 {cardName(card)}
                </button>
              );
            }

            return (
              <button
                key={card}
                onClick={() => {
                  if (card === "freeze") useFreezeCard(playerIndex);
                  if (card === "triple") useTripleCard(playerIndex);
                  if (card === "steal") useStealCard(playerIndex);
                }}
                className="bg-purple-700 px-3 py-2 rounded-lg text-sm"
              >
                {cardName(card)} Ready
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  function renderFormation(playerIndex: number) {
    const isActive = mode === "single" || playerIndex === activePlayerIndex;
    const gp = gamePlayers[playerIndex];
    const frozen = gp.frozenSeason === season;

    return (
      <div
        className={`bg-green-900 border rounded-2xl p-4 ${
          isActive ? "border-yellow-400" : "border-green-700 opacity-70"
        }`}
      >
        <div className="flex justify-between items-start gap-4">
          <div>
            <h2 className="text-2xl font-bold">{gp.name}</h2>
            <p>Cash: €{gp.budget}M</p>
            <p>🎟️ Purchase Chances: {gp.purchaseChances}</p>
            {frozen && <p className="text-blue-300">🧊 Frozen This Season</p>}
          </div>
        </div>

        {renderCards(playerIndex)}

        <div className="grid grid-cols-5 gap-3 text-center mt-4">
          {formation433.flat().map((slot, index) => {
            const ownedPlayer = slot
              ? getOwnedBySlot(playerIndex, slot)
              : undefined;

            return slot ? (
              <button
                key={index}
                onClick={() => {
                  if (isActive && !ownedPlayer) selectSlot(slot);
                }}
                className={`border rounded-xl p-3 min-h-24 ${
                  ownedPlayer
                    ? "bg-blue-900 border-blue-400"
                    : "bg-black/40 border-green-500"
                }`}
              >
                <div className="font-bold">{slot}</div>
                <div className="text-xs mt-2">
                  {ownedPlayer ? ownedPlayer.player.nationality : "Choose"}
                </div>
              </button>
            ) : (
              <div key={index}></div>
            );
          })}
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
        <p
          onClick={() => {
            const next = easterClicks + 1;
            setEasterClicks(next);

            if (next >= 5) {
              setEasterUnlocked(true);
            }
          }}
          className="text-yellow-400 mb-2 cursor-pointer"
        >
          عمو يوسف المطور المستقل AKA 7GE
        </p>

        <h1 className="text-5xl font-bold mb-4">Football Investor</h1>

        {easterUnlocked && (
          <p className="text-green-400 mb-4">Secret Player Unlocked ✓</p>
        )}

        <p className="text-2xl mb-2">Budget: €{START_BUDGET}M</p>
        <p className="text-xl mb-8">Formation: 4-3-3</p>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <button
            onClick={() => setMode("single")}
            className={`px-8 py-4 rounded-xl text-xl ${
              mode === "single" ? "bg-green-700" : "bg-green-600"
            }`}
          >
            Single Player
          </button>

          <button
            onClick={() => setMode("versus")}
            className={`px-8 py-4 rounded-xl text-xl ${
              mode === "versus" ? "bg-blue-700" : "bg-blue-600"
            }`}
          >
            Play vs Friend
          </button>
        </div>

        {mode && (
          <>
            <h2 className="text-2xl font-bold mb-4">Choose Timer</h2>

            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {[
                { label: "15 sec", value: 15 },
                { label: "30 sec", value: 30 },
                { label: "45 sec", value: 45 },
                { label: "1 min", value: 60 },
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={() => setSelectedTime(t.value)}
                  className={`px-5 py-3 rounded-xl ${
                    selectedTime === t.value ? "bg-yellow-600" : "bg-zinc-800"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <button
              onClick={startGame}
              disabled={!selectedTime}
              className="bg-white text-black px-8 py-4 rounded-xl text-xl disabled:bg-gray-500"
            >
              Start Game
            </button>
          </>
        )}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8 relative">
      {message && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-zinc-900 border border-yellow-500 px-6 py-3 rounded-xl z-50">
          {message}
        </div>
      )}

      {rewardChoice && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-gray-700 rounded-2xl p-8 max-w-xl w-full mx-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Choose ONE Special Card</h2>
            <p className="mb-6 text-gray-300">
              اختر كرت واحد فقط من المكافآت المؤهلة
            </p>

            <div className="flex flex-col gap-3">
              {rewardChoice.cards.map((card) => (
                <button
                  key={card}
                  onClick={() => chooseReward(card)}
                  className="bg-purple-700 px-5 py-3 rounded-xl text-xl"
                >
                  {cardName(card)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {stealChallenge && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-gray-700 rounded-2xl p-8 max-w-3xl w-full mx-4 text-center">
            {!stealChallenge.success ? (
              <>
                <h2 className="text-3xl font-bold mb-4">3-2-1 Challenge</h2>

                <button
                  onClick={() =>
                    setStealChallenge({
                      ...stealChallenge,
                      showHelp: !stealChallenge.showHelp,
                    })
                  }
                  className="bg-gray-700 px-4 py-2 rounded-lg mb-4"
                >
                  شرح اللعبة
                </button>

                {stealChallenge.showHelp && (
                  <p className="bg-black/40 p-4 rounded-xl mb-4 text-right">
                    كل لاعب يقول نادي بعد العد 3، 2، 1. بعدها أول شخص يقول اسم
                    لاعب لعب للناديين يفوز. مثال: Everton و Manchester United،
                    الإجابة: Wayne Rooney.
                  </p>
                )}

                <p className="mb-6">حدد مين فاز بالتحدي:</p>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      if (stealChallenge.userIndex === 0) {
                        setStealChallenge({ ...stealChallenge, success: true });
                      } else {
                        setStealChallenge(null);
                        notify("خسرت التحدي وضاع الكرت");
                      }
                    }}
                    className="bg-blue-600 px-5 py-3 rounded-xl"
                  >
                    Player 1 Won
                  </button>

                  <button
                    onClick={() => {
                      if (stealChallenge.userIndex === 1) {
                        setStealChallenge({ ...stealChallenge, success: true });
                      } else {
                        setStealChallenge(null);
                        notify("خسرت التحدي وضاع الكرت");
                      }
                    }}
                    className="bg-green-600 px-5 py-3 rounded-xl"
                  >
                    Player 2 Won
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold mb-4">Swap Players</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div>
                    <h3 className="font-bold mb-2">Your Player</h3>
                    {gamePlayers[stealChallenge.userIndex].owned.map(
                      (item, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            setStealChallenge({
                              ...stealChallenge,
                              ownIndex: index,
                            })
                          }
                          className={`block w-full text-left p-3 rounded-lg mb-2 ${
                            stealChallenge.ownIndex === index
                              ? "bg-blue-700"
                              : "bg-black/40"
                          }`}
                        >
                          {item.player.name} - {item.slot}
                        </button>
                      )
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold mb-2">Enemy Player</h3>
                    {gamePlayers[
                      stealChallenge.userIndex === 0 ? 1 : 0
                    ].owned.map((item, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          setStealChallenge({
                            ...stealChallenge,
                            enemyIndex: index,
                          })
                        }
                        className={`block w-full text-left p-3 rounded-lg mb-2 ${
                          stealChallenge.enemyIndex === index
                            ? "bg-red-700"
                            : "bg-black/40"
                        }`}
                      >
                        {item.player.name} - {item.slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 justify-center mt-6">
                  <button
                    onClick={swapPlayers}
                    className="bg-purple-700 px-5 py-3 rounded-xl"
                  >
                    Confirm Swap
                  </button>

                  <button
                    onClick={() => setStealChallenge(null)}
                    className="bg-gray-700 px-5 py-3 rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showEndModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-40">
          <div className="bg-zinc-900 border border-gray-700 rounded-2xl p-8 max-w-4xl w-full mx-4 text-center">
            {!showStats ? (
              <>
                <h1 className="text-4xl font-bold mb-4">هذا آخر موسم</h1>
                <p className="text-xl mb-4">القادم في التحديثات القادمة</p>
                <p className="text-3xl font-bold mb-8">{getWinnerText()}</p>

                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setShowStats(true)}
                    className="bg-blue-600 px-6 py-3 rounded-xl text-xl"
                  >
                    الإحصائيات
                  </button>

                  <button
                    onClick={restartGame}
                    className="bg-green-600 px-6 py-3 rounded-xl text-xl"
                  >
                    إعادة اللعبة
                  </button>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-4xl font-bold mb-4">الإحصائيات</h1>
                <p className="text-2xl mb-2">{getWinnerText()}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {gamePlayers.map((gp, playerIndex) => (
                    <div
                      key={gp.name}
                      className="bg-black/40 border border-gray-700 rounded-xl p-4"
                    >
                      <h2 className="text-2xl font-bold mb-2">{gp.name}</h2>
                      <p>Final Cash: €{gp.budget}M</p>
                      <p
                        className={
                          totalProfit(playerIndex) >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        Total Profit / Loss: €{totalProfit(playerIndex)}M
                      </p>
                    </div>
                  ))}
                </div>

                <div className="max-h-96 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-left">
                  {gamePlayers.flatMap((gp) => gp.sold).map((s, index) => (
                    <div
                      key={index}
                      className="bg-black/40 border border-gray-700 rounded-xl p-4"
                    >
                      <p className="text-xl font-bold">{s.name}</p>
                      <p>Owner: {s.owner}</p>
                      <p>Bought in: {s.buySeason}</p>
                      <p>Sold in: {s.sellSeason}</p>
                      <p>Bought: €{s.buyPrice}M</p>
                      <p>Sold: €{s.sellPrice}M</p>
                      <p
                        className={
                          s.profit >= 0 ? "text-green-400" : "text-red-400"
                        }
                      >
                        {s.profit >= 0 ? "Profit" : "Loss"}: €{s.profit}M
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setShowStats(false)}
                    className="bg-gray-700 px-6 py-3 rounded-xl text-xl"
                  >
                    رجوع
                  </button>

                  <button
                    onClick={restartGame}
                    className="bg-green-600 px-6 py-3 rounded-xl text-xl"
                  >
                    إعادة اللعبة
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <h1 className="text-4xl font-bold mb-2">Season {season}</h1>

      {mode === "versus" && (
        <p className="text-2xl mb-2">
          Turn: {activePlayer.name} | Timer:{" "}
          {selectedSlot ? `${timer}s` : "Waiting"}
        </p>
      )}

      {mode === "single" && selectedSlot && (
        <p className="text-2xl mb-2">Timer: {timer}s</p>
      )}

      <button
        onClick={nextSeason}
        className="mb-6 bg-yellow-600 px-5 py-3 rounded-lg"
      >
        {season >= 2021 ? "Finish Game" : "Continue Next Season"}
      </button>

      {mode === "single" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2">{renderFormation(0)}</section>

          <aside className="bg-zinc-900 border border-gray-700 rounded-2xl p-5">
            <h2 className="text-3xl font-bold mb-4">Portfolio</h2>
            <p className="text-xl mb-2">Cash: €{gamePlayers[0].budget}M</p>
            <p className="text-xl mb-4">
              🎟️ Purchase Chances: {gamePlayers[0].purchaseChances}
            </p>

            <h3 className="text-xl font-bold mb-2">Owned Players</h3>

            {gamePlayers[0].owned.length === 0 ? (
              <p className="text-gray-400 mb-6">No players owned.</p>
            ) : (
              <div className="space-y-3 mb-6">
                {gamePlayers[0].owned.map((item, index) => (
                  <div key={index} className="bg-black/40 p-3 rounded-xl">
                    <p className="font-bold">Unknown Player</p>
                    <p>Slot: {item.slot}</p>
                    <p>Nationality: {item.player.nationality}</p>
                    <p>
                      Bought: €{item.buyPrice}M in {item.buySeason}
                    </p>

                    <button
                      onClick={() => sellPlayer(0, index)}
                      className="mt-2 bg-red-700 px-3 py-2 rounded-lg"
                    >
                      Sell / Reveal
                    </button>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {renderFormation(0)}
          {renderFormation(1)}
        </div>
      )}

      {selectedSlot && (
        <div className="mt-8">
          <h2 className="text-3xl font-bold mb-4">
            Choose {selectedSlot} Player for {activePlayer.name}
          </h2>

          {options.length === 0 ? (
            <p className="text-red-400">
              No players available for this position in {season}.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {options.map((player) => (
                <div
                  key={player.name}
                  className="border border-gray-700 rounded-xl p-4 bg-zinc-900"
                >
                  <p>Age: {currentAge(player)}</p>
                  <p>Nationality: {player.nationality}</p>
                  <p>Height: {player.height} cm</p>
                  <p>League: {player.league}</p>
                  <p>Games: {player.games ?? 0}</p>
                  <p>Goals: {player.goals ?? 0}</p>
                  <p>Assists: {player.assists ?? 0}</p>

                  {player.position === "GK" && (
                    <p>Clean Sheets: {player.cleanSheets ?? 0}</p>
                  )}

                  {["LB", "CB", "RB"].includes(player.position) && (
                    <>
                      <p>Yellow Cards: {player.yellowCards ?? 0}</p>
                      <p>Red Cards: {player.redCards ?? 0}</p>
                    </>
                  )}

                  <p>Rating: {player.rating ?? "-"}</p>
                  <p>Value: €{currentValue(player)}M</p>

                  {player.secret && (
                    <p className="text-yellow-400 font-bold">
                      Secret Player ⭐
                    </p>
                  )}

                  <button
                    onClick={() => buyPlayer(player)}
                    className="mt-4 bg-blue-600 px-4 py-2 rounded-lg"
                  >
                    Buy
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}