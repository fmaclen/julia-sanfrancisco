import type { Translation } from '$i18n/i18n-types';
import en from '../en';
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

const es = {
	...en, // Fall back to English
	splash: {
		title: 'Julia Sanfrancisco',
		introduction:
			'Persigue a Julia y sus cómplices a través de diferentes países, desentrañando pistas, resolviendo acertijos y ampliando tus conocimientos de geografía en este emocionante juego de detectives.',
		newGame: 'Nuevo juego',
		about: 'Acerca de'
	},
	headquarters: {
		title: 'Cuartel general',
		newsflash: {
			title: 'Flash de noticias',
			lines: {
				0: 'Tesoro nacional robado de {city}.',
				1: 'El tesoro ha sido identificado como {treasure}.',
				2: '{sex|{male: Un hombre, female: Una mujer}} ha sido visto en la escena del crimen.'
			}
		},
		assignment: {
			title: 'Tu misión',
			lines: {
				0: 'Sigue {sex|{male: al ladrón, female: a la ladrona}} desde {city} hasta su escondite y {sex|{male: arréstalo, female: arréstala}}.',
				1: 'Debes capturar al malechor antes de las 5 p.m. del domingo.',
				2: 'Buena suerte, {rank} {name}.'
			}
		},
		id: {
			acmeSystems: 'Sistemas ACME',
			yourName: 'Tu nombre',
			pending: 'Detective en el teclado, por favor identifícate',
			indentified: 'Has sido identificado como {name}.',
			rank: 'Tu rango actual es {rank}.'
		}
	},
	game: {
		outcome: {
			title: 'Policía Mundial: Mensaje entrante',
			ready: 'Listo para tu próximo caso, {rank} {name}?',
			caughtWithWarrant: {
				0: 'Gracias a tu ayuda, la policía de {city} ha aprehendido a {suspect}.',
				1: '{suspect} tenía el botín, {stolenTreasure}, que será devuelto a los agradecidos residentes de {city}.',
				2: 'Aquí en la Policía Mundial te agradecemos por tu buen trabajo en este caso.',
				3: 'Tu éxito será anotado en tu expediente.',
				4: '{cases} caso{{cases:s}} más hasta tu próxima promoción.'
			},
			caughtWithWrongWarrant: {
				0: 'Has rastreado correctamente a {suspect}.',
				1: 'Desafortunadamente, tienes una orden para {suspect}.',
				2: '¡Cuidado, todos podríamos ser demandados por arresto falso!',
				3: 'Esperamos que lo hagas mejor en tu próximo caso.'
			},
			caughtWithoutWarrant: {
				0: 'Has alcanzado a {suspect}.',
				1: 'Sin embargo, sin una orden no podemos hacer un arresto legal.',
				2: '¡Parece que la pandilla de Julia se ha salido con la suya otra vez!'
			},
			gotAway: {
				0: 'Malas noticias...',
				1: '¡Acabamos de recibir la noticia de que {suspect} se te escapó porque tu investigación tardó demasiado!'
			}
		},
		actions: {
			walk: 'Caminar a',
			walking: 'Caminando',
			fly: 'Volar a',
			flying: 'Volando',
			sleeping: 'Durmiendo',
			options: 'Opciones',
			abandon: 'Abandonar partida',
			confirm: 'Estás a punto de abandonar este juego. ¿Estás seguro?'
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
			unknown: 'Desconocido',
			sex: 'Sexo',
			name: 'Nombre',
			occupation: 'Ocupación',
			other: 'Otro',
			hobby: 'Afición',
			hair: 'Cabello',
			feature: 'Característica',
			vehicle: 'Vehículo'
		},
		sex: {
			male: 'Masculino',
			female: 'Femenino'
		},
		hobby: {
			hiking: 'Senderismo',
			tennis: 'Tenis',
			cycling: 'Ciclismo',
			guitar: 'Guitarra',
			golf: 'Golf',
			gambler: 'Apostador',
			pickleball: 'Pickleball'
		},
		hair: {
			black: 'Negro',
			brown: 'Marrón',
			red: 'Rojo',
			blond: 'Rubio'
		},
		feature: {
			scar: 'Cicatriz',
			glasses: 'Gafas',
			tattoo: 'Tatuaje',
			birthmark: 'Marca de nacimiento',
			ring: 'Anillo',
			necklace: 'Collar'
		},
		vehicle: {
			bike: 'Bicicleta',
			motorcycle: 'Motocicleta',
			hoverboard: 'Hoverboard',
			exotic: 'Coche exótico',
			convertible: 'Descapotable',
			limousine: 'Limusina',
			transit: 'Transporte público',
			jet: 'Jet'
		},
		dossiers: 'Expedientes',
		suspectDossiers: 'Expedientes de sospechosos',
		getWarrant: 'Obtener orden de detención',
		compute: 'Calcular',
		provideDetails: 'Por favor, proporciona detalles del sospechoso para obtener una orden.',
		suspectMatch: 'Coincidencia con el sospechoso',
		haveWarrant: 'Ahora tienes una orden para arrestar a {suspect}.',
		possibleSuspects: 'Posibles sospechosos',
		noSuspectsFound: 'No se encontraron sospechosos',
		noPossibleSuspects: 'La información proporcionada elimina a todos los posibles sospechosos.',
		noWarrantIssued: 'No se ha emitido ninguna orden.'
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
			'Vi a la persona que buscas y',
			'La persona que estás buscando estuvo aquí y',
			'Mis fuentes me dicen que',
			'Una fuente confiable me dijo que',
			'Las fuentes me dicen que',
			'Todo lo que sé es que',
			'Una persona sospechosa estuvo aquí y',
			'Escuché que'
		],
		sight: [
			'{sex|{male: él, female: ella}} dijo que {sex|{male: él, female: ella}} quería fotografiar',
			'{sex|{male: él, female: ella}} pidió un mapa de',
			'{sex|{male: él, female: ella}} planeaba visitar',
			'{sex|{male: él, female: ella}} mencionó que quería ver',
			'{sex|{male: él, female: ella}} estaba considerando hacer un viaje a',
			'{sex|{male: él, female: ella}} tenía ganas de visitar',
			'{sex|{male: él, female: ella}} dijo que quería explorar',
			'{sex|{male: él, female: ella}} preguntó sobre tours de un día a',
			'{sex|{male: él, female: ella}} quería saber si había hoteles de cinco estrellas cerca de'
		],
		language: [
			'{sex|{male: él, female: ella}} tenía un diccionario de {language} en {sex|{male: su, female: su}} bolsillo',
			'{sex|{male: él, female: ella}} llevaba un libro de frases en {language}'
		],
		currency: [
			'{sex|{male: él, female: ella}} cambió {sex|{male: su, female: su}} dinero a {currency}',
			'{sex|{male: él, female: ella}} preguntó sobre el tipo de cambio para {currency}',
			'{sex|{male: él, female: ella}} quería saber cuánto valía {currency}'
		],
		object: [
			'{sex|{male: él, female: ella}} llevaba un',
			'{sex|{male: él, female: ella}} quería conseguir',
			'{sex|{male: él, female: ella}} quería vender',
			'{sex|{male: él, female: ella}} preguntó dónde encontrar',
			'{sex|{male: él, female: ella}} estaba buscando'
		],
		topic: [
			'{sex|{male: él, female: ella}} estaba investigando',
			'{sex|{male: él, female: ella}} quería estudiar',
			'{sex|{male: él, female: ella}} estaba interesado en',
			'{sex|{male: él, female: ella}} preguntó sobre'
		],
		plane: [
			'{sex|{male: él, female: ella}} se fue en un avión con una bandera {flag} en su ala',
			'{sex|{male: él, female: ella}} tenía prisa por tomar un avión con una bandera {flag} en su ala',
			'{sex|{male: él, female: ella}} voló lejos en un avión con una bandera {flag} en su cola'
		],
		ship: [
			'{sex|{male: él, female: ella}} se fue en un barco que ondeaba una bandera {flag}',
			'{sex|{male: él, female: ella}} se fue en un barco con una bandera {flag}'
		],
		finalRound: [
			'La noticia se está filtrando, estás acercándote demasiado detective...',
			'Corre el rumor de que la pandilla está en algún lugar de la ciudad.',
			'Lo único que sé es que algo sospechoso está sucediendo en la ciudad.',
			'Lo único que puedo decirte es que tengas cuidado.'
		],
		decoy: [
			'No vi a nadie que coincida con esa descripción.',
			'Lo siento, no he notado nada sospechoso por aquí.',
			'Lo siento, no he visto a nadie así por aquí.',
			'No he visto a nadie que se parezca a eso.'
		]
	},
	scenes: {
		places: {
			0: 'Aeropuerto',
			1: 'Banco',
			2: 'Ministerio de Relaciones Exteriores',
			3: 'Puerto',
			4: 'Hotel',
			5: 'Biblioteca',
			6: 'Mercado',
			7: 'Museo',
			8: 'Palacio',
			9: 'Malecón',
			10: 'Club deportivo',
			11: 'Bolsa de valores'
		},
		witnesses: {
			// Aeropuerto
			0: 'Empleado de equipaje',
			1: 'Azafata',
			2: 'Piloto',

			// Banco
			3: 'Guardia de banco',
			4: 'Cajero',
			5: 'Vicepresidente',

			// Ministerio de Relaciones Exteriores
			6: 'Embajador',
			7: 'Agregado',
			8: 'Subsecretario',

			// Puerto
			9: 'Oficial de aduanas',
			10: 'Capitán de puerto',
			11: 'Marinero',

			// Hotel
			12: 'Botones',
			13: 'Detective del hotel',
			14: 'Gerente del hotel',

			// Biblioteca
			15: 'Archivero',
			16: 'Cajero de circulación',
			17: 'Bibliotecario de referencia',

			// Mercado
			18: 'Vendedor ambulante',
			19: 'Comerciante callejero',
			20: 'Pillo',

			// Museo
			21: 'Curador',
			22: 'Guía',
			23: 'Guardia de museo',

			// Palacio
			24: 'Guardia de palacio',
			25: 'Consejero privado',
			26: 'Soldado',

			// Malecón
			27: 'Loro del marinero',
			28: 'Estibador',
			29: 'Capitán de remolcador',

			// Club deportivo
			30: 'Barman',
			31: 'Profesional de tenis',
			32: 'Camarero',

			// Bolsa de valores
			33: 'Analista',
			34: 'Mensajero',
			35: 'Operador'
		}
	},
	player: {
		ranks: {
			0: 'Novato',
			1: 'Investigador',
			2: 'Detective privado',
			3: 'Investigador',
			4: 'Detective experto',
			5: 'Super investigador'
		}
	},
	components: {
		startTime: 'Lunes 9:00am',
		loading: 'Cargando',
		buttons: {
			goBack: 'Volver',
			continue: 'Continuar'
		}
	}
} satisfies Translation;

export default es;
