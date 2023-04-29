export enum City {
  ALGIERS = 'Algiers',
  AMSTERDAM = 'Amsterdam',
  ATHENS = 'Athens',
  BANGKOK = 'Bangkok',
  BEIJING = 'Beijing',
  BUENOS_AIRES = 'Buenos Aires',
  MUMBAI = 'Mumbai',
  CAIRO = 'Cairo',
  COPENHAGEN = 'Copenhagen',
  DUBLIN = 'Dublin',
  GENEVA = 'Geneva',
  HONG_KONG = 'Hong Kong',
  ISTANBUL = 'Istanbul',
  JERUSALEM = 'Jerusalem',
  JOHANNESBURG = 'Johannesburg',
  LISBON = 'Lisbon',
  WASHINGTON_DC = 'Washington DC',
  NEW_YORK = 'New York',
  /////////////////////////////////////
  CHARLESTON = 'Charleston',
  MIAMI = 'Miami',
  HAVANA = 'Havana'
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

export enum Character {
  CUSTOMS_AGENT = 'Customs agent',
  FLIGHT_ATTENDANT = 'Flight attendant',
  LUGGAGE_HANDLER = 'Luggage handler',
  PILOT = 'Pilot',
  /////////////////////////////////////
  BUS_DRIVER = 'Bus driver',
  TICKET_AGENT = 'Ticket agent',
  TOURIST = 'Tourist'
}

export enum Rank {
  GUMSHOE = 'Gumshoe',
  DETECTIVE = 'Detective',
  ACE_DETECTIVE = 'Ace detective',
  SENIOR_DETECTIVE = 'Senior detective',
  CHIEF_DETECTIVE = 'Chief detective',
  SUPER_SLEUTH = 'Super sleuth'
}

export interface Suspect {
  name: string;
  hair: string; // TODO ENUM
  hobby: string; // TODO ENUM
  vehicle: string; // TODO ENUM
}

export interface Scene {
  place: Place,
  character: Character;
  dialog: string;
}

export interface Location {
  city: City;
  scenes: Scene[];
  travelTo: City[];
}

export interface Game {
  locations: Location[];
  suspect: Suspect;
  stolenItem: string; // TODO ENUM
  currentTime: number;
}
