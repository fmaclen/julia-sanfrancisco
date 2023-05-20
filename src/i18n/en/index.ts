import type { BaseTranslation } from '../i18n-types';

const en = {
	home: {
		title: 'Julia Sanfrancisco',
		introduction:
			'Chase Julia and her accomplices across different countries, unraveling clues, solving puzzles, and expanding your geography knowledge in this exciting detective game.',
		newGame: 'New game'
	},
	headquarters: {
		title: 'Headquarters',
		newsflash: {
			title: 'Newsflash',
			content: {
				line1: 'National treasure stolen from {city:string}.',
				line2: 'The treasure has been identified as {treasure:string}.',
				line3: '{sex:string} has been reported at the scene of the crime.'
			}
		},
		assignment: {
			title: 'Your assignment',
			content: {
				line1:
					'Track the thief from {city:string} to {sex:string|{male: his, female: her}} hideout and arrest {sex:string|{male: him, female: her}}.',
				line2: 'You must apprehend the thief by Sunday 5pm.',
				line3: 'Good luck, {rank:string} {name:string}.'
			}
		},
		id: {
			pending: 'Detective at keyboard, please identify yourself',
			indentified: 'You have been identified as {name:string}.',
			rank: 'Your current rank is {rank:string}.'
		}
	},
	game: {
		outcome: {
			title: 'Message from Interpol',
			win: {
				line1: 'Congratulations!',
				line2: 'You caught up with the suspect.',
				line3: 'Thanks to your help, the {city:string} police have apprehended {suspect:string}.',
				line4:
					'We thank you for your good work on this case. Your success will be noted on your record.',
				line5: '{cases:number} more case{{cases:s}} until your next promotion.'
			},
			loose: {
				timedOut: {
					line1: 'Bad news...',
					line2:
						'Looks like {suspect:string} slipped through your fingers because your investigation took too long!'
				},
				noWarrant: {
					line1: 'You caught up with suspect {suspect:string}!',
					line2: 'However, without a warrant the {city:string} police cannot make an arrest.',
					line3: "It looks like Julia's gang has gotten away with another caper."
				}
			},
			ready: 'Ready for your next case, {rank:string} {name:string}?'
		}
	},
	player: {
		// ranks: ['Rookie', 'Sleuth', 'Private eye', 'Investigator', 'Ace detective', 'Super sleuth']
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
		loading: 'Loading',
		buttons: {
			continue: 'Continue',
			quit: 'Quit'
		}
	}
} satisfies BaseTranslation;

export default en;
