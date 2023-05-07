export interface Suspect {
  name: string;
  hobby: string;
  hair: string;
  feature: string;
  vehicle: string;
  sex: string;
  subjectPronoun: string;
  possesivePronoun: string;
}

export enum Rank {
  ROOKIE = 'Rookie', // 0 cases
  SLEUTH = 'Sleuth', // 1-3 cases
  PRIVATE_EYE = 'Private eye', // 4-6 cases
  INVESTIGATOR = 'Investigator', // 7-9 cases
  ACE_DETECTIVE = 'Ace detective', // 10-13 cases
  SUPER_SLEUTH = 'Super sleuth' // 14+ cases
}

export enum Place {
  AIRPORT = 'Airport',
  BUS_STATION = 'Bus station',
  HOTEL = 'Hotel',
  HARBOR = 'Harbor',
  MARKETPLACE = 'Marketplace',
  MUSEUM = 'Museum',
  RESTAURANT = 'Restaurant',
  SUBWAY_STATION = 'Subway station',
  TRAIN_STATION = 'Train station',
  UNIVERSITY = 'University',
  LIBRARY = 'Library',
  FOREIGN_MINISTRY = 'Foreign ministry',
}

export enum Witness {
  // Bank
  VICE_PRESIDENT = "Vice president",
  BANK_GUARD = "Bank guard",
  TELLER = "Teller",

  // Hotel
  HOTEL_MANAGER = "Hotel manager",
  BELLHOP = "Bellhop",
  HOUSE_DETECTIVE = "House detective",

  // Museum
  MUSEUM_GUARD = "Museum guard",
  DOCENT = "Docent",
  CURATOR = "Curator",

  // Sport Club
  WAITER = "Waiter",
  TENNIS_PRO = "Tennis pro",
  BARTENDER = "Bartender",

  // Library
  CIRCULATION_CLERK = "Circulation clerk",
  REFERENCE_LIBRARIAN = "Reference librarian",
  ARCHIVIST = "Archivist",

  // Airport
  PILOT = "Pilot",
  FLIGHT_ATTENDANT = "Flight attendant",
  BAGGAGE_CLERK = "Baggage clerk",

  // Harbor
  SAILOR = "Sailor",
  HARBOR_MASTER = "Harbor Master",
  CUSTOMS_OFFICER = "Customs officer",

  // Riverfront
  STEVEDORE = "Stevedore",
  TUGBOAT_CAPTAIN = "Tugboat captain",
  SAILORS_PARROT = "Sailor's parrot",

  // Palace
  PALACE_GUARD = "Palace guard",
  SOLDIER = "Soldier",
  PRIVY_COUNCILLOR = "Privy Councillor",

  // Stock Exchange
  ANALYST = "Analyst",
  TRADER = "Trader",
  MESSENGER = "Messenger",

  // Marketplace
  HAWKER = "Hawker",
  STREET_MERCHANT = "Street Merchant",
  URCHIN = "Urchin",

  // Foreign Ministry
  UNDER_SECRETARY = "Under Secretary",
  ATTACHE = "Attache",
  AMBASSADOR = "Ambassador"
}


export interface Atlas {
  city: string;
  descriptions: string[];
  currency: string;
  language: string;
  flag: string;
  leader: 'king' | 'president' | 'prime minister' | 'party chairman';
  see: string[];
  toDo: string[];
  trade: string[];
  study: string[];
  stolen: string[];
}

export interface Scene {
  place: Place;
  witness: Witness;
  clue: string;
}

export interface Round {
  atlas: Atlas;
  scenes: Scene[];
  destinations: Atlas[];
}

export interface Game {
  currentTime: Date;
  stolenTreasure: string;
  suspect: Suspect;
  rounds: Round[];
}

export interface Player {
  name: string;
  score: number;
}