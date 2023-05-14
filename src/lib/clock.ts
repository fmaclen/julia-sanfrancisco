import { addDays, addHours, addSeconds, format, isAfter, startOfWeek } from 'date-fns';

export const DELAY_IN_MS = 500;
const FPS = 60;

export default class Clock {
	startTime: Date;
	endTime: Date;
	currentTime: Date;
	timerId: NodeJS.Timer | null;
	tickRate: number;

	isWalking: boolean;
	isFlying: boolean;
	isSleeping: boolean;
	isTimeUp: boolean;

	constructor() {
		this.timerId = null;
		this.tickRate = DELAY_IN_MS / FPS;

		this.isWalking = false;
		this.isFlying = false;
		this.isSleeping = false;
		this.isTimeUp = false;

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

	public fastForward = (hours: number): Promise<boolean> => {
		return new Promise((resolve, reject) => {
			this.stop();

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

					if (this.isWalking) this.isWalking = false;
					if (this.isFlying) this.isFlying = false;
					if (this.isSleeping) this.isSleeping = false; // Wake up Neo...

					resolve(false);
				}
			}, this.tickRate);
		});
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
			this.isWalking = false;
			this.isFlying = false;
			this.isSleeping = true;
			this.fastForward(10);
		}
	};

	// Checks if the current time is after the end time.
	// If so, it stops the clock
	private checkTimeIsUp = () => {
		const timeIsUp = isAfter(this.currentTime, this.endTime);

		if (timeIsUp) {
			this.isTimeUp = true;
			this.stop();
		}
	};
}
