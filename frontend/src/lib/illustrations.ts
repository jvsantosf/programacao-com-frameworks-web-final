import type { VehicleCategory } from "../types";

const BASE_URL = "https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@1ffb34c752ecf5d402f04cfb4b392c77f57c54bc/assets";

function emoji(folder: string, file: string) {
  return `${BASE_URL}/${encodeURIComponent(folder)}/3D/${file}_3d.png`;
}

export const illustrations = {
  automobile: emoji("Automobile", "automobile"),
  oncomingAutomobile: emoji("Oncoming automobile", "oncoming_automobile"),
  suv: emoji("Sport utility vehicle", "sport_utility_vehicle"),
  pickup: emoji("Pickup truck", "pickup_truck"),
  key: emoji("Key", "key"),
  wrench: emoji("Hammer and wrench", "hammer_and_wrench"),
  calendar: emoji("Spiral calendar", "spiral_calendar"),
  moneyBag: emoji("Money bag", "money_bag"),
  clipboard: emoji("Clipboard", "clipboard"),
  checkMark: emoji("Check mark button", "check_mark_button"),
  search: emoji("Magnifying glass tilted left", "magnifying_glass_tilted_left"),
  motorway: emoji("Motorway", "motorway"),
  gear: emoji("Gear", "gear"),
  partyPopper: emoji("Party popper", "party_popper"),
};

export const categoryIllustrations: Record<VehicleCategory, string> = {
  ECONOMY: illustrations.automobile,
  HATCH: illustrations.oncomingAutomobile,
  SEDAN: illustrations.automobile,
  SUV: illustrations.suv,
  PICKUP: illustrations.pickup,
};
