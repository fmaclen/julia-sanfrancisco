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
			title: 'Tu misión',
			content: {
				line1:
					'Sigue {sex|{male: al ladrón, female: a la ladrona}} desde {city} hasta su escondite y {sex|{male: arréstalo, female: arréstala}}.',
				line2: 'Debes capturar al malechor antes de las 5 p.m. del domingo.',
				line3: 'Buena suerte, {rank} {name}.'
			}
		},
		id: {
			pending: 'Detective en el teclado, por favor identifícate',
			indentified: 'Has sido identificado como {name}.',
			rank: 'Tu rango actual es {rank}.'
		}
	},
	game: {
		outcome: {
			title: 'Mensaje de Interpol',
			win: {
				line1: '¡Felicidades!',
				line2: 'Has capturado al sospechoso.',
				line3: 'Gracias a tu ayuda, la policía de {city} ha detenido a {suspect}.',
				line4:
					'Agradecemos tu buen trabajo en este caso. Tu éxito quedará registrado en tu expediente.',
				line5: '{cases} caso{{cases:s}} más hasta tu próxima promoción.'
			},
			loose: {
				timedOut: {
					line1: 'Malas noticias...',
					line2:
						'¡Parece que {suspect} se escapó de tus manos porque tu investigación tomó demasiado tiempo!'
				},
				noWarrant: {
					line1: '¡Has encontrado al sospechoso {suspect}!',
					line2:
						'Sin embargo, sin una orden de arresto, la policía de {city} no puede detener al sospechoso.',
					line3: 'Parece que la banda de Julia se ha salido con la suya de nuevo.'
				}
			},
			ready: '¿Listo para tu próximo caso, {rank} {name}?'
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
