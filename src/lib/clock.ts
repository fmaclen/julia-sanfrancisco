import { addDays, addHours, addMinutes, format, isAfter, startOfWeek } from 'date-fns';

export default class Clock {
	startTime: Date;
	endTime: Date;
	currentTime: Date;
	timerId: NodeJS.Timer | null;
	tickRate: number;

	constructor() {
		this.timerId = null;
		this.tickRate = 1000 / 60; // 60 fps

		const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
		this.startTime = addHours(startOfCurrentWeek, 9); // Monday at 9 am
		this.endTime = addHours(addDays(this.startTime, 7), 8); // Sunday at 5 pm
		this.currentTime = this.startTime;
	}

	public startClock = () => {
		// Advanecs time by 1 minute every 1.5 seconds
		this.timerId = setInterval(() => this.advanceTime(), 1500);
	};

	public getCurrentTime = (): string => {
		return format(this.currentTime, 'EEEE hh:mm aaa');
	};

	public fastForward = (hours: number) => {
		this.stopClock();

		const minutesToAdvance = 60 / hours / this.tickRate;
		this.timerId = setInterval(() => this.advanceTime(minutesToAdvance), this.tickRate);

		setTimeout(() => {
			this.stopClock();
			this.startClock();
		}, hours * 1000);
	};

	private stopClock = () => {
		if (this.timerId) clearInterval(this.timerId);
	};

	private advanceTime = (minutes = 1) => {
		this.currentTime = addMinutes(this.currentTime, minutes);
		this.checkShouldSleep();
		this.checkTimeIsUp();
	};

	private checkShouldSleep = () => {
		const currentHour = this.currentTime.getHours();
		if (currentHour === 22) this.fastForward(10);
	};

	private checkTimeIsUp = () => {
		if (isAfter(this.currentTime, this.endTime)) this.stopClock();
	};
}
