import { addDays, addHours, addSeconds, format, isAfter, startOfWeek } from 'date-fns';

const FPS = 60;
const ONE_SECOND = 1000;
const ONE_HOUR_IN_SECONDS = 3600;

export default class Clock {
	startTime: Date;
	endTime: Date;
	currentTime: Date;
	timerId: NodeJS.Timer | null;
	tickRate: number;

	constructor() {
		this.timerId = null;
		this.tickRate = ONE_SECOND / FPS; // 60 fps

		const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
		this.startTime = addHours(startOfCurrentWeek, 9); // Monday at 9 am
		this.endTime = addHours(addDays(this.startTime, 7), 8); // Sunday at 5 pm
		this.currentTime = this.startTime;
	}

	public startClock = () => {
		// Advances time by 1 minute every 1.5 seconds
		const oneMinuteInSeconds = 60;
		this.timerId = setInterval(() => this.advanceTime(oneMinuteInSeconds), 1500);
	};

	public getCurrentTime = (): string => {
		return format(this.currentTime, 'EEEE h:mm aaa');
	};

	public fastForward = (hours: number) => {
		this.stopClock();

		const totalSecondsToAdd = hours * ONE_HOUR_IN_SECONDS;
		let secondsAdded = 0;

		this.timerId = setInterval(() => {
			const secondsToAddThisTick = Math.min(
				totalSecondsToAdd - secondsAdded,
				ONE_HOUR_IN_SECONDS / FPS
			);
			this.advanceTime(secondsToAddThisTick);
			secondsAdded += secondsToAddThisTick;

			if (secondsAdded >= totalSecondsToAdd) {
				this.stopClock();
				this.startClock();
			}
		}, this.tickRate);
	};

	private advanceTime = (seconds: number) => {
		this.currentTime = addSeconds(this.currentTime, seconds);

		this.checkShouldSleep();
		this.checkTimeIsUp();
	};

	private stopClock = () => {
		if (this.timerId) clearInterval(this.timerId);
	};

	private checkShouldSleep = () => {
		const currentHour = this.currentTime.getHours();
		if (currentHour === 22) this.fastForward(10);
	};

	private checkTimeIsUp = () => {
		if (isAfter(this.currentTime, this.endTime)) this.stopClock();
	};
}
