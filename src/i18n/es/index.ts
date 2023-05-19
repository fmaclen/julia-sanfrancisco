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
	headquarters: {
		title: 'Cuartel general',
		newsflash: {
			title: 'Flash de noticias',
			content: {
				line1: 'Tesoro nacional robado de {city}.',
				line2: 'El tesoro ha sido identificado como {treasure}.',
				line3: '{sex} ha sido visto en la escena del crimen.'
			}
		},
		assignment: {
			title: 'Tu tarea',
			content: {
				line1:
					'Sigue al ladrón desde {city} hasta {pronounPossessive} escondite y arresta a {pronounObject}.',
				line2: 'Debes capturar al ladrón antes de las 5 p.m. del domingo.',
				line3: 'Buena suerte, {rank} {name}.'
			}
		},
		id: {
			pending: 'Detective en el teclado, por favor identifícate',
			indentified: 'Has sido identificado como {name}.',
			rank: 'Tu rango actual es {rank}.'
		}
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
