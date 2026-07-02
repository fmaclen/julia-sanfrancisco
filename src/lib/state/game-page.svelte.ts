import type { Translation, TranslationFunctions } from '$i18n/i18n-types';
import Clock, { DELAY_IN_MS } from '$lib/clock.svelte';
import {
	generateDecoyRound,
	getFormattedTime,
	SUSPECT_TRAIL_SCENE_DURATION,
	type Atlas,
	type Game,
	type Round
} from '$lib/game';
import { delay, redirectTo } from '$lib/helpers';
import {
	findSuspects,
	Suspect,
	type WarrantFeature,
	type WarrantHair,
	type WarrantHobby,
	type WarrantSex,
	type WarrantVehicle
} from '$lib/suspects';
import { playerState } from './player.svelte';
import { sessionState } from './session.svelte';

export default class GamePageState {
	game: Game = $derived(sessionState.game as Game);
	currentRound: Round = $derived(
		this.game
			? (this.game.roundDecoy ?? this.game.rounds[this.game.currentRoundIndex])
			: (null as unknown as Round)
	);
	currentClueIndex: number | null = $state(null);
	artworkPath: string = $derived(this.currentRound ? this.currentRound.atlas.artwork : '');

	clock = new Clock();
	currentTimeFormatted: string = $derived(
		playerState.player ? getFormattedTime(this.clock.elapsedMinutes, playerState.player.locale) : ''
	);

	isAnimating: boolean = $state(false);
	isWalking: boolean = $derived(this.clock.isWalking);
	isFlying: boolean = $derived(this.clock.isFlying);
	isSleeping: boolean = $derived(this.clock.isSleeping);
	isTimeUp: boolean = $derived(this.clock.isTimeUp);
	isFirstRound: boolean = $derived(this.game ? this.game.currentRoundIndex === 0 : false);
	isLastRound: boolean = $derived(
		this.game ? this.game.currentRoundIndex === this.game.rounds.length - 1 : false
	);
	suspectCaught = $derived(
		!this.isTimeUp &&
			this.isLastRound &&
			this.currentClueIndex === this.game?.suspect.lastRoundHidingPlace
	);
	isGameOver: boolean = $derived(this.suspectCaught || this.isTimeUp);

	isTrailingSuspect: boolean = $state(false);
	trailingSceneInRoundSeen: boolean = false;
	trailingSuspectScene: keyof Translation['game']['trailingSuspect'] = $state(
		null as unknown as keyof Translation['game']['trailingSuspect']
	);

	showPostcard = $state(true);
	showPlaces = $state(false);
	showDestinations = $state(false);
	showOptions = $state(false);
	showDescription = $state(true);
	showDossiers = $state(false);
	showWarrant = $state(false);
	showSuspectDossier: Suspect | undefined = $state();

	warrantWasComputed: boolean = $state(false);
	warrantSex: WarrantSex | undefined = $state();
	warrantHobby: WarrantHobby | undefined = $state();
	warrantHair: WarrantHair | undefined = $state();
	warrantFeature: WarrantFeature | undefined = $state();
	warrantVehicle: WarrantVehicle | undefined = $state();

	isClockTicking = $derived(this.isSleeping || this.isWalking || this.isFlying);
	isArtworkHidden = $derived(this.isClockTicking && !this.isSleeping);
	isClueVisible = $derived(this.currentClueIndex !== null && !this.isWalking && !this.isSleeping);

	#getLL: () => TranslationFunctions;

	constructor(getLL: () => TranslationFunctions) {
		this.#getLL = getLL;
	}

	finishGame = (): void => {
		if (!this.isGameOver || !this.game) return;

		this.game.suspect.caught = this.suspectCaught;
		sessionState.save();
		redirectTo('/gg/');
	};

	startClock = (): (() => void) | undefined => {
		if (playerState.player === null || sessionState.game === null) {
			redirectTo('/headquarters/');
			return;
		}

		this.clock.restore(this.game.elapsedMinutes);
		this.game.elapsedMinutes = this.clock.elapsedMinutes;
		delete (this.game as Game & { currentTime?: unknown }).currentTime;

		this.clock.start();

		const handleVisibilityChange = () => {
			if (document.hidden) {
				this.clock.pause();
			} else {
				this.clock.resume();
			}
		};
		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
			this.clock.stop();
		};
	};

	resetRound = (): void => {
		this.currentClueIndex = null;
		this.artworkPath = this.currentRound.atlas.artwork;
		this.game.elapsedMinutes = this.clock.elapsedMinutes;

		this.showDescription = true;
		this.showPlaces = false;
		this.showOptions = false;
		this.showDestinations = false;
		this.showDossiers = false;
		this.showWarrant = false;
		this.showSuspectDossier = undefined;

		sessionState.save();
	};

	flyTo = (): void => {
		if (!this.showDestinations) this.resetRound();
		this.showDescription = !this.showDescription;
		this.showDestinations = !this.showDestinations;
	};

	walkTo = (): void => {
		if (!this.showPlaces) this.resetRound();
		this.showDescription = !this.showDescription;
		this.showPlaces = !this.showPlaces;
	};

	toggleOptions = (): void => {
		if (!this.showOptions) this.resetRound();
		this.showDescription = !this.showDescription;
		this.showOptions = !this.showOptions;
	};

	togglePostcard = (): void => {
		this.showPostcard = !this.showPostcard;
	};

	seeDossiers = (): void => {
		this.showOptions = false;
		this.showSuspectDossier = undefined;
		this.showDossiers = true;
	};

	seeDossier = (suspect: Suspect): void => {
		this.showDossiers = false;
		this.showSuspectDossier = suspect;
	};

	getWarrant = (): void => {
		this.showOptions = false;
		this.showWarrant = true;
	};

	computeWarrant = (): void => {
		this.warrantWasComputed = true;
		this.game.warrants = findSuspects(
			this.warrantSex,
			this.warrantHobby,
			this.warrantHair,
			this.warrantFeature,
			this.warrantVehicle
		);
	};

	getClue = async (index: number): Promise<void> => {
		this.showPlaces = false;
		this.showDescription = false;
		this.clock.isWalking = true;

		if (
			!this.trailingSceneInRoundSeen &&
			!this.isFirstRound &&
			this.game.suspect.lastRoundHidingPlace !== index
		) {
			this.isArtworkHidden = true;
			this.isTrailingSuspect = true;
			this.trailingSuspectScene = (
				this.game.currentRoundIndex - 1
			).toString() as keyof Translation['game']['trailingSuspect'];
			await delay(SUSPECT_TRAIL_SCENE_DURATION);

			this.isTrailingSuspect = false;
			this.trailingSceneInRoundSeen = true;
		}

		this.isArtworkHidden = true;
		await this.clock.fastForward(2);

		this.currentClueIndex = index;
		if (this.currentRound) this.artworkPath = this.currentRound.scenes[index].witness.artwork;
	};

	dismissClue = async (): Promise<void> => {
		this.isArtworkHidden = true;
		await delay(DELAY_IN_MS);

		this.resetRound();
		this.isArtworkHidden = false;
	};

	setRound = async (currentAtlas: Atlas): Promise<void> => {
		this.isClockTicking = true;
		this.clock.isFlying = true;
		this.showDestinations = false;
		this.showDescription = false;
		this.isArtworkHidden = true;
		await this.clock.fastForward(4);

		const { rounds, currentRoundIndex } = this.game;
		const isCurrentRound = rounds[currentRoundIndex].atlas.city === currentAtlas.city;
		const isNextRound =
			currentRoundIndex < rounds.length - 1 &&
			rounds[currentRoundIndex + 1].atlas.city === currentAtlas.city;
		const isPreviousRound =
			currentRoundIndex > 0 && rounds[currentRoundIndex - 1].atlas.city === currentAtlas.city;
		const isDecoyRound = !isCurrentRound && !isPreviousRound && !isNextRound;
		const anchorAtlas = rounds[currentRoundIndex].atlas;

		if (isDecoyRound) {
			this.currentRound = generateDecoyRound(this.#getLL(), currentAtlas, anchorAtlas);
			this.game.roundDecoy = this.currentRound;
		} else {
			this.trailingSceneInRoundSeen = false;
			this.game.roundDecoy = null;
		}

		if (isCurrentRound) this.currentRound = rounds[currentRoundIndex];
		if (isNextRound) this.game.currentRoundIndex += 1;
		if (isPreviousRound) this.game.currentRoundIndex -= 1;

		this.showPostcard = true;
		this.resetRound();
	};

	abandonGame = (): void => {
		if (confirm(this.#getLL().game.actions.confirm())) {
			sessionState.game = null;
			sessionState.save();
			redirectTo('/');
		}
	};
}
