<script lang="ts">
	export let src: string;
	export let isHidden: boolean = false;
	export let isDisabled: boolean = false;
</script>

<div class="artwork {isHidden ? 'artwork--hidden' : ''} {isDisabled ? 'artwork--disabled' : ''}">
	<img class="artwork__img" {src} alt="Illustration of scene" />
</div>

<style lang="scss">
	div.artwork {
		position: absolute;
		z-index: -1;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 1;
		transition: filter 1500ms, opacity 500ms;

		&::after {
			content: '';
			position: absolute;
			width: 100%;
			height: 25%;
			top: 0;
			left: 0;
			background-image: linear-gradient(
				to bottom,
				hsla(0, 0%, 0%, 0.76) 0%,
				hsla(0, 0%, 0%, 0.75) 8.1%,
				hsla(0, 0%, 0%, 0.723) 15.5%,
				hsla(0, 0%, 0%, 0.681) 22.5%,
				hsla(0, 0%, 0%, 0.627) 29%,
				hsla(0, 0%, 0%, 0.563) 35.3%,
				hsla(0, 0%, 0%, 0.492) 41.2%,
				hsla(0, 0%, 0%, 0.418) 47.1%,
				hsla(0, 0%, 0%, 0.342) 52.9%,
				hsla(0, 0%, 0%, 0.268) 58.8%,
				hsla(0, 0%, 0%, 0.197) 64.7%,
				hsla(0, 0%, 0%, 0.133) 71%,
				hsla(0, 0%, 0%, 0.079) 77.5%,
				hsla(0, 0%, 0%, 0.037) 84.5%,
				hsla(0, 0%, 0%, 0.01) 91.9%,
				hsla(0, 0%, 0%, 0) 100%
			);
		}
		&::before {
			content: '';
			position: absolute;
			width: 100%;
			height: 25%;
			bottom: 0;
			left: 0;
			background-image: linear-gradient(
				to top,
				hsla(0, 0%, 0%, 0.76) 0%,
				hsla(0, 0%, 0%, 0.75) 8.1%,
				hsla(0, 0%, 0%, 0.723) 15.5%,
				hsla(0, 0%, 0%, 0.681) 22.5%,
				hsla(0, 0%, 0%, 0.627) 29%,
				hsla(0, 0%, 0%, 0.563) 35.3%,
				hsla(0, 0%, 0%, 0.492) 41.2%,
				hsla(0, 0%, 0%, 0.418) 47.1%,
				hsla(0, 0%, 0%, 0.342) 52.9%,
				hsla(0, 0%, 0%, 0.268) 58.8%,
				hsla(0, 0%, 0%, 0.197) 64.7%,
				hsla(0, 0%, 0%, 0.133) 71%,
				hsla(0, 0%, 0%, 0.079) 77.5%,
				hsla(0, 0%, 0%, 0.037) 84.5%,
				hsla(0, 0%, 0%, 0.01) 91.9%,
				hsla(0, 0%, 0%, 0) 100%
			);
		}

		&--hidden {
			opacity: 0;
		}

		&--disabled {
			filter: grayscale(100%) blur(4px);
		}
	}

	img.artwork__img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
