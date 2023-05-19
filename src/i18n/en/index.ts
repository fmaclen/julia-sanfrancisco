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
					'Track the thief from {city:string} to {pronounPossessive:string} hideout and arrest {pronounObject:string}.',
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
	components: {
		loading: 'Loading',
		buttons: {
			continue: 'Continue',
			quit: 'Quit'
		}
	}
} satisfies BaseTranslation;

export default en;
