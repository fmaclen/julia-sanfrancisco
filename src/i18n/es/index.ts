import en from '../en';
import type { Translation } from '../i18n-types';

const es = {
	...(en as Translation), // Fall back to English
	home: {
		title: 'Julia Sanfrancisco',
		introduction:
			'Persigue a Julia y sus cómplices a través de diferentes países, desentrañando pistas, resolviendo acertijos y ampliando tus conocimientos de geografía en este emocionante juego de detectives.',
		newGame: 'Nuevo juego'
	},
	components: {
		loading: 'Cargando',
		buttons: {
			continue: 'Continuar',
			quit: 'Salir'
		}
	}
} satisfies Translation;

export default es;
