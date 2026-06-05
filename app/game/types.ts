export type Position =
  | "GK"
  | "LB"
  | "CB"
  | "RB"
  | "CM"
  | "CAM"
  | "LW"
  | "RW"
  | "ST";

export type Slot =
  | "GK"
  | "LB"
  | "LCB"
  | "RCB"
  | "RB"
  | "LCM"
  | "RCM"
  | "CAM"
  | "LW"
  | "RW"
  | "ST";

export type HiddenPlayerType =
  | "talent"
  | "normal"
  | "flop";

export type NewsTone =
  | "good"
  | "bad"
  | "neutral"
  | "special";

export type GameMode =
  | "single"
  | "versus";

export type GameLengthMode =
  | "classic"
  | "infinite";

export type BudgetMode =
  | "lucky"
  | "balanced"
  | "rich"
  | "billionaire";

export type EventType =
  | "all"
  | "positive"
  | "negative";

export type ContractStatus =
  | "pending"
  | "accepted"
  | "rejected";

export type SponsorshipStatus =
  | "active"
  | "expired";

export type RewardCardType =
  | "tripleBuy"
  | "extraSell"
  | "steal"
  | "eventChoice";

export type AuctionPhase =
  | "preview"
  | "bidding"
  | "replacement"
  | "finished";

export interface SeasonStats {
  season: number;
  games: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  rating: number;
  value: number;
}

export interface SponsorshipDeal {
  brand: string;
  totalValue: number;
  investorSharePercent: number;
  investorIncome: number;
  yearsLeft: number;
  status: SponsorshipStatus;
}

export interface ContractOffer {
  salary: number;
  years: number;
  satisfaction: number;
  status: ContractStatus;
}

export interface Player {
  name: string;
  position: Position;
  nationality: string;
  height: number;
  league: string;
  startAge: number;
  availableSeason: number;
  hiddenType: HiddenPlayerType;
  secret: boolean;
  values: Record<number, number>;
  statsBySeason: Record<number, SeasonStats>;
  sponsorship?: SponsorshipDeal | null;
}

export interface OwnedPlayer {
  player: Player;
  slot: Slot;
  buySeason: number;
  buyPrice: number;
  contract: ContractOffer;
}

export interface SoldPlayer {
  owner: string;
  name: string;
  buySeason: number;
  sellSeason: number;
  buyPrice: number;
  sellPrice: number;
  profit: number;
}

export interface CardState {
  unlocked: boolean;
  cooldown: number;
}

export interface PlayerCards {
  tripleBuy: CardState;
  extraSell: CardState;
  steal: CardState;
  eventChoice: CardState;
}

export interface GamePlayer {
  name: string;
  teamName: string;
  budget: number;
  owned: OwnedPlayer[];
  sold: SoldPlayer[];
  purchaseChances: number;
  sellChances: number;
  receivedSalePurchaseBonus: boolean;
  cards: PlayerCards;
  skippedTurn: boolean;
}

export interface NewsItem {
  id: number;
  season: number;
  title: string;
  description: string;
  tone: NewsTone;
  sourceName?: string;
  sourceType?: "journalist" | "newspaper";
}

export interface SeasonEvent {
  title: string;
  description: string;
  tone: NewsTone;
  marketMultiplier?: number;
}

export interface InvestorOfferState {
  targetPlayerIndex: number;
  selectedPlayer: Player;
  marketValue: number;
  offerValue: number;
}

export interface PlayerEventEffect {
  title: string;
  tone: NewsTone;
  multiplier: number;
  ratingChange: number;
  gamesChange: number;
  goalsChange: number;
  assistsChange: number;
  cleanSheetsChange: number;
}

export interface AuctionState {
  phase: AuctionPhase;
  timer: number;
  candidates: Player[];
  selectedPlayer: Player | null;
  baseValue: number;
  currentBid: number;
  currentTurn: number;
  highestBidder: number | null;
  winnerIndex: number | null;
}

export interface ReplacementState {
  ownerIndex: number;
  incomingPlayer: Player;
  price: number;
  candidates: OwnedPlayer[];
  source: "auction" | "investorOffer";
}

export interface EventChoiceState {
  playerIndex: number;
  events: PlayerEventEffect[];
}

export interface PlayerSelectionPreview {
  player: Player;
  slot: Slot;
  contract: ContractOffer;
}

export interface TeamStarterState {
  firstSeasonStarter: number;
  currentSeasonStarter: number;
}