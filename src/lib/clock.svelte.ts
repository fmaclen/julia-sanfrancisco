export const DELAY_IN_MS = 500;
export const DEADLINE_MINUTES = 9120;

const DAY_MINUTES = 1440;
const START_HOUR = 9;
const SLEEP_HOUR = 22;
const WAKE_HOUR = 8;
const TICK_INTERVAL_MS = 25;
const NORMAL_MINUTE_MS = 1500;
const FAST_FORWARD_MINUTES_PER_TICK = 3;

export default class Clock {
	elapsedMinutes = $state(0);
	isWalking = $state(false);
	isFlying = $state(false);
	isSleeping = $state(false);
	isTimeUp = $derived(this.elapsedMinutes >= DEADLINE_MINUTES);

	#timerId: ReturnType<typeof setInterval> | null = null;
	#targetMinutes: number | null = null;
	#normalElapsedMs = 0;
	#isPaused = false;
	#pendingFastForwards: Array<() => void> = [];

	public start = () => {
		this.#isPaused = false;
		this.#ensureTicker();
	};

	public pause = () => {
		this.#isPaused = true;
	};

	public resume = () => {
		this.#isPaused = false;
		this.#ensureTicker();
	};

	public stop = () => {
		if (this.#timerId) clearInterval(this.#timerId);
		this.#timerId = null;
		this.#normalElapsedMs = 0;
	};

	public restore = (elapsedMinutes: unknown) => {
		this.elapsedMinutes = this.#normalizeElapsedMinutes(elapsedMinutes);
	};

	public fastForward = (hours: number): Promise<boolean> => {
		const minutes = Math.max(0, Math.round(hours * 60));

		return new Promise((resolve) => {
			if (minutes === 0 || this.isTimeUp) {
				resolve(false);
				return;
			}

			this.#pendingFastForwards.push(() => resolve(false));
			const targetBase = this.#targetMinutes ?? this.elapsedMinutes;
			this.#targetMinutes = Math.min(DEADLINE_MINUTES, targetBase + minutes);
			this.#normalElapsedMs = 0;
			this.#ensureTicker();
		});
	};

	#ensureTicker = () => {
		if (this.#timerId || this.isTimeUp) return;
		this.#timerId = setInterval(this.#tick, TICK_INTERVAL_MS);
	};

	#tick = () => {
		if (this.#isPaused) return;

		if (this.isTimeUp) {
			this.stop();
			this.#resolveFastForwards();
			return;
		}

		if (this.#targetMinutes !== null) {
			this.#advanceTowardTarget();
			return;
		}

		this.#normalElapsedMs += TICK_INTERVAL_MS;
		if (this.#normalElapsedMs >= NORMAL_MINUTE_MS) {
			const minutes = Math.floor(this.#normalElapsedMs / NORMAL_MINUTE_MS);
			this.#normalElapsedMs -= minutes * NORMAL_MINUTE_MS;
			this.#advanceBy(minutes);
		}
	};

	#advanceTowardTarget = () => {
		if (this.#targetMinutes === null) return;

		this.elapsedMinutes = Math.min(
			DEADLINE_MINUTES,
			this.#targetMinutes,
			this.elapsedMinutes + FAST_FORWARD_MINUTES_PER_TICK
		);

		if (this.elapsedMinutes >= this.#targetMinutes || this.isTimeUp) {
			this.#finishTarget();
		}
	};

	#advanceBy = (minutes: number) => {
		this.elapsedMinutes = Math.min(DEADLINE_MINUTES, this.elapsedMinutes + minutes);

		if (this.isTimeUp) {
			this.stop();
			return;
		}

		if (this.#shouldSleep()) this.#startSleep();
	};

	#finishTarget = () => {
		const finishedSleeping = this.isSleeping;
		this.#targetMinutes = null;
		this.#normalElapsedMs = 0;

		if (finishedSleeping) {
			this.isSleeping = false;
			this.#resolveFastForwards();
		} else {
			this.isWalking = false;
			this.isFlying = false;

			if (!this.isTimeUp && this.#shouldSleep()) {
				this.#startSleep();
				return;
			}

			this.#resolveFastForwards();
		}

		if (this.isTimeUp) this.stop();
	};

	#startSleep = () => {
		this.isWalking = false;
		this.isFlying = false;
		this.isSleeping = true;

		const minutesUntilWake = this.#minutesUntilWake();
		this.#targetMinutes = Math.min(DEADLINE_MINUTES, this.elapsedMinutes + minutesUntilWake);
		this.#ensureTicker();
	};

	#shouldSleep = () => {
		if (this.isSleeping || this.isTimeUp) return false;
		const minutesInDay = this.#minutesInDay();
		return minutesInDay >= SLEEP_HOUR * 60 || minutesInDay < WAKE_HOUR * 60;
	};

	#minutesUntilWake = () => {
		const minutesInDay = this.#minutesInDay();
		return (DAY_MINUTES + WAKE_HOUR * 60 - minutesInDay) % DAY_MINUTES;
	};

	#minutesInDay = () => {
		return (START_HOUR * 60 + this.elapsedMinutes) % DAY_MINUTES;
	};

	#resolveFastForwards = () => {
		const resolvers = this.#pendingFastForwards;
		this.#pendingFastForwards = [];
		for (const resolve of resolvers) resolve();
	};

	#normalizeElapsedMinutes = (elapsedMinutes: unknown) => {
		if (typeof elapsedMinutes !== 'number' || !Number.isFinite(elapsedMinutes)) return 0;
		return Math.min(DEADLINE_MINUTES, Math.max(0, Math.floor(elapsedMinutes)));
	};
}
