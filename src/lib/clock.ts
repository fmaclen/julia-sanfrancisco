import { addDays, addHours, addSeconds, format, isAfter, startOfWeek } from 'date-fns';

const FPS = 60;

export default class Clock {
	startTime: Date;
	endTime: Date;
	currentTime: Date;
	timerId: NodeJS.Timer | null;
	tickRate: number;
	isTimeAdvancing: boolean;
	isTraveling: boolean;
	isSleeping: boolean;
	timeIsUp: boolean;

	constructor() {
		const RATE_IN_MS = 500;

		this.timerId = null;
		this.tickRate = RATE_IN_MS / FPS;

		this.isTimeAdvancing = false;
		this.isTraveling = false;
		this.isSleeping = false;
		this.timeIsUp = false;

		const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
		this.startTime = addHours(startOfCurrentWeek, 9); // Monday at 9 am
		this.endTime = addHours(addDays(this.startTime, 7), 8); // Sunday at 5 pm
		this.currentTime = this.startTime;
	}

	// Starts the clock and advances the time by 1 minute every 1.5 seconds
	public start = () => {
		const oneMinuteInSeconds = 60;
		this.timerId = setInterval(() => this.advanceTime(oneMinuteInSeconds), 1500);
	};

	public getCurrentTime = (): string => {
		return format(this.currentTime, 'EEEE h:mm aaa');
	};

	public fastForward = (hours: number) => {
		this.stop();
		this.isTimeAdvancing = true;

		const ONE_HOUR_IN_SECONDS = 3600;
		const totalSecondsToAdd = hours * ONE_HOUR_IN_SECONDS;
		let secondsAdded = 0;

		this.timerId = setInterval(() => {
			const secondsToAddThisTick = Math.min(
				totalSecondsToAdd - secondsAdded,
				ONE_HOUR_IN_SECONDS / FPS
			);
			this.advanceTime(secondsToAddThisTick);
			secondsAdded += secondsToAddThisTick;

			// Returns the clock to normal speed once the fast forward is complete
			if (secondsAdded >= totalSecondsToAdd) {
				this.stop();
				this.start();

				if (this.isTimeAdvancing) this.isTimeAdvancing = false;
				if (this.isTraveling) this.isTraveling = false;
				if (this.isSleeping) this.isSleeping = false; // Wake up Neo...
			}
		}, this.tickRate);
	};

	// Advances the time by the specified number of seconds and checks if the clock should sleep or if time is up
	private advanceTime = (seconds: number) => {
		this.currentTime = addSeconds(this.currentTime, seconds);

		this.checkShouldSleep();
		this.checkTimeIsUp();
	};

	// Stops the clock by clearing the interval
	private stop = () => {
		if (this.timerId) clearInterval(this.timerId);
	};

	// Checks if the current hour is 22 (10 PM)
	// If so, it fast forwards the clock by 10 hours
	private checkShouldSleep = () => {
		const currentHour = this.currentTime.getHours();
		const shouldSleep = currentHour === 22 && !this.isSleeping;

		if (shouldSleep) {
			this.isSleeping = true;
			this.fastForward(10);
		}
	};

	// Checks if the current time is after the end time.
	// If so, it stops the clock
	private checkTimeIsUp = () => {
		const isTimeUp = isAfter(this.currentTime, this.endTime);

		if (isTimeUp) {
			this.timeIsUp = true;
			this.stop();
		}
	};
}
