import Clock, { DEADLINE_MINUTES } from '$lib/clock.svelte';
import { getFormattedTime } from '$lib/game';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

describe('clock', () => {
	let clock: Clock;

	beforeEach(() => {
		vi.useFakeTimers();
		clock = new Clock();
	});

	afterEach(() => {
		clock.stop();
		vi.useRealTimers();
	});

	test('starts at Monday 9:00am and formats in both locales', () => {
		expect(clock.elapsedMinutes).toBe(0);
		expect(getFormattedTime(clock.elapsedMinutes, 'en')).toBe('Monday 9:00 am');
		expect(getFormattedTime(clock.elapsedMinutes, 'es')).toBe('Lunes 9:00 am');
		expect(getFormattedTime(3264, 'en')).toBe('Wednesday 3:24 pm');
		expect(getFormattedTime(3264, 'es')).toBe('Miércoles 3:24 pm');
	});

	test('normal ticking advances one virtual minute per 1.5 real seconds', () => {
		clock.start();

		vi.advanceTimersByTime(1499);
		expect(clock.elapsedMinutes).toBe(0);

		vi.advanceTimersByTime(1);
		expect(clock.elapsedMinutes).toBe(1);

		vi.advanceTimersByTime(3000);
		expect(clock.elapsedMinutes).toBe(3);
	});

	test('fastForward(2) lands exactly 120 minutes later and resets mode flags', async () => {
		clock.isWalking = true;

		const fastForward = clock.fastForward(2);
		await vi.advanceTimersByTimeAsync(1000);
		await fastForward;

		expect(clock.elapsedMinutes).toBe(120);
		expect(clock.isWalking).toBe(false);
		expect(clock.isFlying).toBe(false);
		expect(clock.isSleeping).toBe(false);
	});

	test('fast-forward crossing 10:00pm completes before sleeping to 8:00am next day', async () => {
		clock.restore(720);
		clock.isWalking = true;

		const fastForward = clock.fastForward(2);
		await vi.advanceTimersByTimeAsync(1000);

		expect(clock.elapsedMinutes).toBe(840);
		expect(clock.isWalking).toBe(false);
		expect(clock.isSleeping).toBe(true);

		await vi.advanceTimersByTimeAsync(4500);
		await fastForward;

		expect(clock.elapsedMinutes).toBe(1380);
		expect(getFormattedTime(clock.elapsedMinutes, 'en')).toBe('Tuesday 8:00 am');
		expect(clock.isSleeping).toBe(false);
	});

	test('pause freezes elapsedMinutes and resume continues', () => {
		clock.start();
		clock.pause();

		vi.advanceTimersByTime(4500);
		expect(clock.elapsedMinutes).toBe(0);

		clock.resume();
		vi.advanceTimersByTime(1500);
		expect(clock.elapsedMinutes).toBe(1);
	});

	test('isTimeUp flips at exactly 9,120 minutes and the ticker stops', () => {
		clock.restore(DEADLINE_MINUTES - 1);
		clock.start();

		vi.advanceTimersByTime(1500);
		expect(clock.elapsedMinutes).toBe(DEADLINE_MINUTES);
		expect(clock.isTimeUp).toBe(true);

		vi.advanceTimersByTime(1500);
		expect(clock.elapsedMinutes).toBe(DEADLINE_MINUTES);
	});

	test('overlapping fast-forwards advance to the combined target without overlap', async () => {
		const first = clock.fastForward(2);
		const second = clock.fastForward(2);

		await vi.advanceTimersByTimeAsync(2000);
		await Promise.all([first, second]);

		expect(clock.elapsedMinutes).toBe(240);
		expect(clock.isWalking).toBe(false);
		expect(clock.isFlying).toBe(false);
		expect(clock.isSleeping).toBe(false);
	});

	test('restore resumes saved elapsedMinutes and resets legacy strings', () => {
		clock.restore(4321);
		expect(clock.elapsedMinutes).toBe(4321);
		expect(getFormattedTime(clock.elapsedMinutes, 'en')).toBe('Thursday 9:01 am');

		clock.restore('2026-07-01T00:00:00.000Z');
		expect(clock.elapsedMinutes).toBe(0);
	});
});
