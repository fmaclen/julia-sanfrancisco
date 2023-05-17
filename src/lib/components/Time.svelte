<script lang="ts">
	export let currentTime: string = 'Monday 9:00am';
	export let isClockTicking: boolean = false;
</script>

<time class="time {isClockTicking ? 'time--active' : ''}">{currentTime}</time>

<style lang="scss">
	time.time {
		opacity: 0.33;
		transition: opacity 250ms;

		&--active {
			opacity: 1;
		}
	}
</style>
