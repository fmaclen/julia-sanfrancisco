<script lang="ts">
	import LL from '../../i18n/i18n-svelte';
	import { fly, fade } from 'svelte/transition';

	export let currentTime: string = $LL.components.startTime();
	export let isClockTicking: boolean = false;
</script>

<time
	class="time {isClockTicking ? 'time--active' : ''}"
	in:fly={{ y: -24, duration: 750 }}
	out:fade={{ duration: 1750 }}
>
	{currentTime}
</time>

<style lang="scss">
	time.time {
		opacity: 0.5;
		transition: opacity 250ms;

		&--active {
			opacity: 1;
		}
	}
</style>
