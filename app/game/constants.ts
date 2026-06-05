import type {
  BudgetMode,
  Position,
  Slot,
} from "./types";

export const START_SEASON = 2008;

export const CLASSIC_END_SEASON = 2028;

export const INITIAL_BUY_CHANCES = 1;

export const INITIAL_SELL_CHANCES = 3;

export const MAX_BUY_CHANCES = 5;

export const MAX_SELL_CHANCES = 6;

export const CARD_COOLDOWN_SEASONS = 5;

export const AUCTION_BID_INCREMENT = 5;

export const AUCTION_PREVIEW_SECONDS = 10;

export const MIN_CONTRACT_YEARS = 1;

export const MAX_CONTRACT_YEARS = 5;

export const MIN_SPONSORSHIP_YEARS = 1;

export const MAX_SPONSORSHIP_YEARS = 3;

export const INVESTOR_SHARE_MIN = 30;

export const INVESTOR_SHARE_MAX = 60;

export const SALARY_PERCENT_MIN = 3;

export const SALARY_PERCENT_MAX = 10;

export const ALL_POSITIONS: Position[] = [
  "GK",
  "LB",
  "CB",
  "RB",
  "CM",
  "CAM",
  "LW",
  "RW",
  "ST",
];

export const ALL_SLOTS: Slot[] = [
  "GK",
  "LB",
  "LCB",
  "RCB",
  "RB",
  "LCM",
  "RCM",
  "CAM",
  "LW",
  "RW",
  "ST",
];

export const FORMATION_433: Slot[][] = [
  ["LW", "ST", "RW"],
  ["CAM"],
  ["LCM", "RCM"],
  ["LB", "LCB", "RCB", "RB"],
  ["GK"],
];

export const BUDGET_SETTINGS: Record<
  BudgetMode,
  {
    label: string;
    amount: number;
  }
> = {
  lucky: {
    label: "Lucky Investor",
    amount: 75,
  },
  balanced: {
    label: "Balanced Investor",
    amount: 100,
  },
  rich: {
    label: "Rich Investor",
    amount: 150,
  },
  billionaire: {
    label: "Billionaire Investor",
    amount: 300,
  },
};

export const JOURNALISTS = [
  "Fabrizio Romano",
  "David Ornstein",
  "Gianluca Di Marzio",
  "Florian Plettenberg",
  "Ben Jacobs",
];

export const NEWSPAPERS = [
  "BILD",
  "Sky Sports",
  "BBC Sport",
  "The Athletic",
  "Marca",
];

export const SPONSOR_BRANDS = [
  "Nike",
  "Adidas",
  "Puma",
  "New Balance",
  "Under Armour",
  "Reebok",
  "Coca-Cola",
  "Pepsi",
  "Red Bull",
  "Emirates",
  "Qatar Airways",
  "Etihad",
  "Samsung",
  "Sony",
  "Apple",
  "EA Sports",
  "PlayStation",
  "Monster Energy",
  "Amazon",
  "Spotify",
];