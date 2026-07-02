<script lang="ts">
	import LL from '$i18n/i18n-svelte';
	import { fly, fade } from 'svelte/transition';

	interface Props {
		currentTime?: string;
		isClockTicking?: boolean;
	}

	let { currentTime = $LL.components.startTime(), isClockTicking = false }: Props = $props();
</script>

<time
	class="time {isClockTicking ? 'time--active' : ''}"
	in:fly|global={{ y: -24, duration: 750 }}
	out:fade={{ duration: 250 }}
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
