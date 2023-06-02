import type { BaseTranslation } from '$i18n/i18n-types';
import { argentina } from './atlases/argentina';
import { australia } from './atlases/australia';
import { brazil } from './atlases/brazil';
import { canada } from './atlases/canada';
import { china } from './atlases/china';
import { comoros } from './atlases/comoros';
import { egypt } from './atlases/egypt';
import { france } from './atlases/france';
import { greece } from './atlases/greece';
import { hungary } from './atlases/hungary';
import { iceland } from './atlases/iceland';
import { india } from './atlases/india';
import { iraq } from './atlases/iraq';
import { italy } from './atlases/italy';
import { japan } from './atlases/japan';
import { mali } from './atlases/mali';
import { mexico } from './atlases/mexico';
import { nepal } from './atlases/nepal';
import { norway } from './atlases/norway';
import { papuaNewGuinea } from './atlases/papua-new-guinea';
import { peru } from './atlases/peru';
import { russia } from './atlases/russia';
import { rwanda } from './atlases/rwanda';
import { sanMarino } from './atlases/san-marino';
import { singapore } from './atlases/singapore';
import { sriLanka } from './atlases/sri-lanka';
import { thailand } from './atlases/thailand';
import { turkey } from './atlases/turkey';
import { unitedKingdom } from './atlases/united-kingdom';
import { unitedStates } from './atlases/united-states';
import { chrisLunchtime } from './suspects/chris-lunchtime';
import { danielleSplash } from './suspects/danielle-splash';
import { duchessIsabella } from './suspects/duchess-isabella';
import { hughMass } from './suspects/hugh-mass';
import { juliaSanfrancisco } from './suspects/julia-sanfrancisco';
import { markFadenott } from './suspects/mark-fadenott';
import { renaStone } from './suspects/rena-stone';
import { simonSimonski } from './suspects/simon-simonski';
import { sparkleLily } from './suspects/sparkle-lily';
import { speedyJakeZ } from './suspects/speedy-jake-z';

const en = {
	splash: {
		title: 'Julia Sanfrancisco',
		introduction:
			'Chase Julia and her accomplices across different countries, unraveling clues, solving puzzles, and expanding your geography knowledge in this exciting detective game.',
		newGame: 'New game',
		about: 'About'
	},
	headquarters: {
		title: 'Headquarters',
		newsflash: {
			title: 'Newsflash',
			lines: {
				0: 'National treasure stolen from {city:string}.',
				1: 'The treasure has been identified as {treasure:string}.',
				2: '{sex|{male: A man, female: A woman}} has been reported at the scene of the crime.'
			}
		},
		assignment: {
			title: 'Your assignment',
			lines: {
				0: 'Track the thief from {city:string} to {sex:string|{male: his, female: her}} hideout and arrest {sex:string|{male: him, female: her}}.',
				1: 'You must apprehend the thief by Sunday 5pm.',
				2: 'Good luck, {rank:string} {name:string}.'
			}
		},
		id: {
			acmeSystems: 'ACME Systems',
			yourName: 'Your name',
			pending: 'Detective at keyboard, please identify yourself',
			indentified: 'You have been identified as {name:string}.',
			rank: 'Your current rank is {rank:string}.'
		}
	},
	game: {
		outcome: {
			title: 'World Police: Incoming message',
			ready: 'Ready for your next case, {rank:string} {name:string}?',
			caughtWithWarrant: {
				0: 'Thaks to your help, the {city:string} police have apprehended {suspect:string}.',
				1: '{suspect:string} had the loot, {stolenTreasure:string}, wich will be returned to the grateful residents of {city:string}.',
				2: 'We here at the World Police thank you for your good work on this case.',
				3: 'Your success will be noted on your record.',
				4: '{cases:number} more case{{cases:s}} until your next promotion.'
			},
			caughtWithWrongWarrant: {
				0: 'You have trailed {suspect:string} correctly.',
				1: 'Unfortunately, you have a warrant for {suspect:string}.',
				2: 'Be careful, we could all be sued for false arrest!',
				3: 'We hope you do better on your next case.'
			},
			caughtWithoutWarrant: {
				0: 'You have caught up with {suspect:string}.',
				1: 'However, without a warrant we cannot make a legal arrest.',
				2: "It looks like Julia's gang has gotten away with another caper!"
			},
			gotAway: {
				0: 'Bad news...',
				1: "We've just received word that {suspect:string} slipped through your fingers because your investigation took too long!"
			}
		},
		trailing: {
			0: 'A {sex:string|{male: henchman, female: henchwoman}}!',
			1: 'You must be on the right track.',
			2: 'Not so fast!',
			3: 'Getting closer...',
			4: 'Just missed {sex:string|{male: him, female: her}}...',
			5: "Can't escape forever",
			6: '{sex:string|{male: His, female: Her}} luck is ought to run out soon...',
			7: 'There {sex:string|{male: he, female: she}} goes...',
			8: 'Capture in progress...'
		},
		actions: {
			walk: 'Walk to',
			walking: 'Walking',
			fly: 'Fly to',
			flying: 'Flying',
			sleeping: 'Sleeping',
			options: 'Options',
			abandon: 'Abandon game',
			confirm: 'Are you sure you want to abandon this game?'
		}
	},
	suspects: {
		chrisLunchtime,
		danielleSplash,
		duchessIsabella,
		hughMass,
		juliaSanfrancisco,
		markFadenott,
		renaStone,
		simonSimonski,
		sparkleLily,
		speedyJakeZ
	},
	warrants: {
		labels: {
			unknown: 'Unknown',
			sex: 'Sex',
			name: 'Name',
			occupation: 'Occupation',
			other: 'Other',
			hobby: 'Hobby',
			hair: 'Hair',
			feature: 'Feature',
			vehicle: 'Vehicle'
		},
		sex: {
			male: 'Male',
			female: 'Female'
		},
		hobby: {
			hiking: 'Hiking',
			tennis: 'Tennis',
			cycling: 'Cycling',
			guitar: 'Guitar',
			golf: 'Golf',
			gambler: 'Gambler',
			pickleball: 'Pickleball'
		},
		hair: {
			black: 'Black',
			brown: 'Brown',
			red: 'Red',
			blond: 'Blond'
		},
		feature: {
			scar: 'Scar',
			glasses: 'Glasses',
			tattoo: 'Tattoo',
			birthmark: 'Birthmark',
			ring: 'Ring',
			necklace: 'Necklace'
		},
		vehicle: {
			bike: 'Bicycle',
			motorcycle: 'Motorcycle',
			hoverboard: 'Hoverboard',
			exotic: 'Exotic car',
			convertible: 'Convertible',
			limousine: 'Limousine',
			transit: 'Public transit',
			jet: 'Jet'
		},
		dossiers: 'Dossiers',
		suspectDossiers: 'Suspect dossiers',
		getWarrant: 'Get warrant',
		compute: 'Compute',
		provideDetails: 'Please provide suspect details to obtain a warrant.',
		suspectMatch: 'Suspect match',
		haveWarrant: 'You now have a warrant to arrest {suspect:string}.',
		possibleSuspects: 'Possible suspects',
		noSuspectsFound: 'No suspects found',
		noPossibleSuspects: 'The information provided eliminates all possible suspects.',
		noWarrantIssued: 'No warrant has been issued.'
	},
	atlases: {
		argentina,
		australia,
		brazil,
		china,
		comoros,
		canada,
		egypt,
		france,
		greece,
		hungary,
		iceland,
		india,
		iraq,
		italy,
		japan,
		mali,
		mexico,
		nepal,
		norway,
		papuaNewGuinea,
		peru,
		russia,
		rwanda,
		sanMarino,
		singapore,
		sriLanka,
		thailand,
		turkey,
		unitedKingdom,
		unitedStates
	},
	clues: {
		introduction: [
			"I saw the person you're looking for and",
			'The person you are looking for was here and',
			'My sources tell me',
			'A reliable source told me',
			'Sources tell me',
			'All I know is that',
			'A suspicious person was here and',
			'I heard'
		],
		sight: [
			'{sex:string|{male: he, female: she}} said {sex:string|{male: he, female: she}} wanted to photograph',
			'{sex:string|{male: he, female: she}} asked for a map of',
			'{sex:string|{male: he, female: she}} planned to visit',
			'{sex:string|{male: he, female: she}} mentioned {sex:string|{male: he, female: she}} wanted to see',
			'{sex:string|{male: he, female: she}} was considering taking a trip to',
			'{sex:string|{male: he, female: she}} had an urge to visit',
			'{sex:string|{male: he, female: she}} said {sex:string|{male: he, female: she}} wanted to explore',
			'{sex:string|{male: he, female: she}} asked about day tours to',
			'{sex:string|{male: he, female: she}} wanted to know if there were any five-star hotels near'
		],
		language: [
			'{sex:string|{male: he, female: she}} had a {language:string} dictionary in {sex:string|{male: his, female: her}} pocket',
			'{sex:string|{male: he, female: she}} was carrying a {language:string} phrase book'
		],
		currency: [
			'{sex:string|{male: he, female: she}} changed {sex:string|{male: his, female: her}} money to {currency:string}',
			'{sex:string|{male: he, female: she}} asked about the exchange rate for {currency:string}',
			'{sex:string|{male: he, female: she}} wanted to know how much {currency:string} were worth'
		],
		object: [
			'{sex:string|{male: he, female: she}} was carrying',
			'{sex:string|{male: he, female: she}} wanted to get',
			'{sex:string|{male: he, female: she}} wanted to sell',
			'{sex:string|{male: he, female: she}} asked where to find',
			'{sex:string|{male: he, female: she}} was looking for'
		],
		topic: [
			'{sex:string|{male: he, female: she}} was researching',
			'{sex:string|{male: he, female: she}} wanted to study',
			'{sex:string|{male: he, female: she}} was interested in',
			'{sex:string|{male: he, female: she}} asked about'
		],
		plane: [
			'{sex:string|{male: he, female: she}} left in a plane with a {flag:string} on its wing',
			'{sex:string|{male: he, female: she}} was in a rush to catch a plane with a {flag:string} on its wing',
			'{sex:string|{male: he, female: she}} flew away on a plane with a {flag:string} on its tail'
		],
		ship: [
			'{sex:string|{male: he, female: she}} sailed away on a ship flying a {flag:string} flag',
			'{sex:string|{male: he, female: she}} left on a ship with a {flag:string} flag'
		],
		finalRound: [
			"The word is out, you're getting too close gumshoe...",
			'Rumor has it that the gang is in town somewhere.',
			'All I know is that something suspicious is happening in town.',
			'The only thing I can tell you is to watch your step.'
		],
		decoy: [
			"Didn't see anyone matching that description.",
			"Sorry, I haven't noticed anything suspicious around here.",
			"Sorry, I haven't seen anybody like that around here.",
			"Haven't seen anybody that looks like that."
		]
	},
	scenes: {
		places: {
			0: 'Airport',
			1: 'Bank',
			2: 'Foreign ministry',
			3: 'Harbor',
			4: 'Hotel',
			5: 'Library',
			6: 'Marketplace',
			7: 'Museum',
			8: 'Palace',
			9: 'Riverfront',
			10: 'Sport club',
			11: 'Stock exchange'
		},
		witnesses: {
			// Airport
			0: 'Baggage clerk',
			1: 'Flight attendant',
			2: 'Pilot',

			// Bank
			3: 'Bank guard',
			4: 'Teller',
			5: 'Vice president',

			// Foreign ministry
			6: 'Ambassador',
			7: 'Attache',
			8: 'Under secretary',

			// Harbor
			9: 'Customs officer',
			10: 'Harbor master',
			11: 'Sailor',

			// Hotel
			12: 'Bellhop',
			13: 'House detective',
			14: 'Hotel manager',

			// Library
			15: 'Archivist',
			16: 'Circulation clerk',
			17: 'Reference librarian',

			// Marketplace
			18: 'Hawker',
			19: 'Street merchant',
			20: 'Urchin',

			// Museum
			21: 'Curator',
			22: 'Docent',
			23: 'Museum guard',

			// Palace
			24: 'Palace guard',
			25: 'Privy councillor',
			26: 'Soldier',

			// Riverfront
			27: "Sailor's parrot",
			28: 'Stevedore',
			29: 'Tugboat captain',

			// Sport Club
			30: 'Bartender',
			31: 'Tennis pro',
			32: 'Waiter',

			// Stock Exchange
			33: 'Analyst',
			34: 'Messenger',
			35: 'Trader'
		}
	},
	player: {
		ranks: {
			0: 'Rookie',
			1: 'Sleuth',
			2: 'Private eye',
			3: 'Investigator',
			4: 'Ace detective',
			5: 'Super sleuth'
		}
	},
	components: {
		startTime: 'Monday 9:00am',
		loading: 'Loading',
		buttons: {
			goBack: 'Go back',
			continue: 'Continue'
		}
	}
} satisfies BaseTranslation;

export default en;
