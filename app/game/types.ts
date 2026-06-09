// ============================================
// FOOTBALL INVESTOR 1.8 - TYPES
// ============================================

export type Position =
  | "GK"
  | "LB"
  | "LCB"
  | "RCB"
  | "RB"
  | "LCM"
  | "RCM"
  | "CAM"
  | "LW"
  | "ST"
  | "RW";

export type HiddenPlayerType =
  | "talent"
  | "normal"
  | "trap"
  | "secret";

export type BudgetMode =
  | "lucky"
  | "balanced"
  | "rich"
  | "billionaire";

export type GameMode =
  | "single"
  | "versus";

export type GameLengthMode =
  | "classic"
  | "infinite";

export type EventType =
  | "all"
  | "positive"
  | "negative";

export type NewsTone =
  | "good"
  | "bad"
  | "neutral"
  | "special";

export type RewardCard =
  | "freeze"
  | "triple"
  | "steal";

export type AuctionPhase =
  | "preview"
  | "bidding"
  | "finished";

export type ContractStatus =
  | "negotiating"
  | "accepted"
  | "rejected"
  | "timeout";

export type SponsorBrand =
  | "Nike"
  | "Adidas"
  | "Puma"
  | "Pepsi"
  | "EA Sports"
  | "Red Bull"
  | "Beats"
  | "Hublot";

// ============================================
// SEASON STATS
// ============================================

export type SeasonStats = {
  season: number;
  games: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  rating: number;
  value: number;
};

// ============================================
// PLAYER
// ============================================

export type Player = {
  id?: string;
  name: string;
  position: Position;
  availableSeason: number;
  startAge: number;
  nationality: string;
  height: number;
  league: string;
  club?: string;
  games?: number;
  goals?: number;
  assists?: number;
  cleanSheets?: number;
  yellowCards?: number;
  redCards?: number;
  rating?: number;
  secret?: boolean;
  hiddenType?: HiddenPlayerType;
  values?: Record<number, number>;
  statsBySeason?: Record<number, SeasonStats>;
  retirementAge?: number;
};

// ============================================
// CONTRACT
// ============================================

export type Contract = {
  salary: number;          // per year in M
  duration: number;        // years 1-5
  satisfaction: number;    // 0-100
  requiredSalary: number;  // player's minimum demand
  startSeason: number;
  endSeason: number;
};

export type ContractNegotiation = {
  player: Player;
  slot: string;
  offeredSalary: number;
  offeredDuration: number;
  satisfaction: number;
  requiredSalary: number;
  marketValue: number;
  timer: number;
  attempts: number;
  isRenewal?: boolean;
  playerCounterMessage?: string;
};

// ============================================
// SPONSORSHIP
// ============================================

export type Sponsorship = {
  brand: SponsorBrand;
  annualIncome: number;   // M per year
  duration: number;       // years
  startSeason: number;
  endSeason: number;
};

// ============================================
// OWNED PLAYER
// ============================================

export type ActiveEffect = {
  id: string;
  name: string;
  emoji: string;
  expiresAfterSeason: number;
  valueChangePct?: number;
  ratingChange?: number;
  salaryDemandMultiplier?: number; // Casino Night — يرفع متطلبات الراتب
};

export type OwnedPlayer = {
  player: Player;
  slot: string;
  buySeason: number;
  buyPrice: number;
  currentValue: number;    // يتغير كل موسم حسب price tier
  budgetAtBuy: number;     // ميزانية المستثمر وقت الشراء
  contract: Contract;
  sponsorships: Sponsorship[];
  refusesRenewal?: boolean;
  activeEffects?: ActiveEffect[];
};

// ============================================
// SOLD PLAYER
// ============================================

export type SoldPlayer = {
  owner: string;
  name: string;
  buySeason: number;
  sellSeason: number;
  buyPrice: number;
  sellPrice: number;
  profit: number;
  position: Position;
};

// ============================================
// CARD DATA
// ============================================

export type CardData = {
  unlocked: boolean;
  used: boolean;
  cooldownUntil: number | null;
};

export type Cards = {
  freeze: CardData;
  triple: CardData;
  steal: CardData;
};

// ============================================
// FINANCIAL DASHBOARD
// ============================================

export type FinancialDashboard = {
  totalSalaries: number;
  totalSponsorships: number;
  netIncome: number;
  projectedNextSeason: number;
};

// ============================================
// GAME PLAYER (INVESTOR)
// ============================================

export type GamePlayer = {
  name: string;
  budget: number;
  owned: OwnedPlayer[];
  sold: SoldPlayer[];
  purchaseChances: number;
  sellChances: number;
  soldBonusUsedThisSeason: boolean;
  cards: Cards;
  tripleNextSeason: boolean;
  frozenSeason: number | null;
  totalSalaryBudget: number;
  sponsorships: Sponsorship[];
};

// ============================================
// NEWS
// ============================================

export type NewsItem = {
  id: number;
  season: number;
  title: string;
  description: string;
  tone: NewsTone;
  journalist?: string;
  source?: string;
};

// ============================================
// SEASON EVENT
// ============================================

export type SeasonEvent = {
  id?: string;
  title: string;
  description: string;
  tone: NewsTone;
  marketMultiplier?: number;
  flatMarketChangeMin?: number;  // تغيير ثابت بالمليون لكل اللاعبين (min)
  flatMarketChangeMax?: number;  // تغيير ثابت بالمليون لكل اللاعبين (max)
  playerMultipliers?: Record<string, number>;
  affectedPlayerName?: string;
  affectedOwner?: string;
};

export type SeasonEventResult = {
  event: SeasonEvent | null;
  updatedPlayers: GamePlayer[];
  newsItems: NewsItem[];
};

// ============================================
// EVENT CHOICE (after selling 100M+)
// ============================================

export type EventChoice = {
  playerIndex: number;
  option1: SeasonEvent;
  option2: SeasonEvent;
};

// ============================================
// INVESTOR OFFER
// ============================================

export type InvestorOfferState = {
  candidates: Player[];
  selectedPlayer: Player;
  marketValue: number;
  offerValue: number;
  offerTone: NewsTone;
};

// ============================================
// AUCTION
// ============================================

export type AuctionState = {
  candidates: Player[];
  selectedPlayer: Player | null;
  phase: AuctionPhase;
  timer: number;
  currentBid: number;
  highestBidder: number | null;
  replacementSlot: string | null;
  surrendered: Record<number, boolean>;
};

// ============================================
// REWARD CHOICE
// ============================================

export type RewardChoice = {
  playerIndex: number;
  cards: RewardCard[];
};

// ============================================
// STEAL CHALLENGE
// ============================================

export type StealChallenge = {
  userIndex: number;
  success: boolean;
  ownIndex: number | null;
  enemyIndex: number | null;
};

// ============================================
// DEV EVENT
// ============================================

export type DevEventId =
  | "hotMarket"
  | "marketCrash"
  | "saudiOffer"
  | "ballonDor"
  | "goldenBoy"
  | "goldenBoot"
  | "recordTransfer"
  | "wonderkid"
  | "aclInjury"
  | "majorInjury"
  | "benchWarmer"
  | "failedTransfer"
  | "freeTransfer"
  | "retirement"
  | "investorOffer"
  | "legendaryAuction"
  | "sponsorshipOffer"
  | "florentinoPerez"
  | "bobPaisleyDisaster"
  | "fastFoodAddiction"
  | "breakupSeason"
  | "casinoNight"
  | "oneSeasonWonder"
  | "youTubeViral";

// ============================================
// PLAYER EVENT EFFECT
// ============================================

export type PlayerEventEffect = {
  title: string;
  tone: NewsTone;
  multiplier: number;
  valueChangeMin?: number;
  valueChangeMax?: number;
  affectsAllPlayers?: boolean;
  maxAge?: number;
  ratingChange: number;
  gamesChange: number;
  goalsChange: number;
  assistsChange: number;
  cleanSheetsChange: number;
};

// ============================================
// GAME STATE (for page.tsx)
// ============================================

export type GamePhase =
  | "menu"
  | "playing"
  | "finished";