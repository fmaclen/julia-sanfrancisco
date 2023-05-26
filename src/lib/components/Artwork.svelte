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

		&::after,
		&::before {
			content: '';
			position: absolute;
			width: 100%;
			left: 0;
		}

		// Top gradient
		&::after {
			top: 0;
			height: 33%;

			// Eased gradient
			background: linear-gradient(
				to bottom,
				hsl(0, 0%, 0%) 0%,
				hsla(0, 0%, 0%, 0.987) 8.1%,
				hsla(0, 0%, 0%, 0.951) 15.5%,
				hsla(0, 0%, 0%, 0.896) 22.5%,
				hsla(0, 0%, 0%, 0.825) 29%,
				hsla(0, 0%, 0%, 0.741) 35.3%,
				hsla(0, 0%, 0%, 0.648) 41.2%,
				hsla(0, 0%, 0%, 0.55) 47.1%,
				hsla(0, 0%, 0%, 0.45) 52.9%,
				hsla(0, 0%, 0%, 0.352) 58.8%,
				hsla(0, 0%, 0%, 0.259) 64.7%,
				hsla(0, 0%, 0%, 0.175) 71%,
				hsla(0, 0%, 0%, 0.104) 77.5%,
				hsla(0, 0%, 0%, 0.049) 84.5%,
				hsla(0, 0%, 0%, 0.013) 91.9%,
				hsla(0, 0%, 0%, 0) 100%
			);
		}

		// Bottom gradient
		&::before {
			bottom: 0;
			height: 66%;

			// Eased gradient
			background: linear-gradient(
				to top,
				hsl(0, 0%, 0%) 0%,
				hsla(0, 0%, 0%, 0.987) 8.1%,
				hsla(0, 0%, 0%, 0.951) 15.5%,
				hsla(0, 0%, 0%, 0.896) 22.5%,
				hsla(0, 0%, 0%, 0.825) 29%,
				hsla(0, 0%, 0%, 0.741) 35.3%,
				hsla(0, 0%, 0%, 0.648) 41.2%,
				hsla(0, 0%, 0%, 0.55) 47.1%,
				hsla(0, 0%, 0%, 0.45) 52.9%,
				hsla(0, 0%, 0%, 0.352) 58.8%,
				hsla(0, 0%, 0%, 0.259) 64.7%,
				hsla(0, 0%, 0%, 0.175) 71%,
				hsla(0, 0%, 0%, 0.104) 77.5%,
				hsla(0, 0%, 0%, 0.049) 84.5%,
				hsla(0, 0%, 0%, 0.013) 91.9%,
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

		image-rendering: -moz-crisp-edges;
		image-rendering: -o-crisp-edges;
		image-rendering: -webkit-optimize-contrast;
		image-rendering: crisp-edges;
		-ms-interpolation-mode: nearest-neighbor;
	}
</style>
