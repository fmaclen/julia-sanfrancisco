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

export interface Suspect {
  name: string;
  hobby: string;
  hair: string;
  feature: string;
  vehicle: string;
}