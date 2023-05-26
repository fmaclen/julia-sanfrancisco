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
			height: 60%;

			// Eased gradient
			background: linear-gradient(
				to bottom,
				hsla(0, 0%, 0%, 0.9) 0%,
				hsla(0, 0%, 0%, 0.889) 0.8%,
				hsla(0, 0%, 0%, 0.856) 2.9%,
				hsla(0, 0%, 0%, 0.806) 6.4%,
				hsla(0, 0%, 0%, 0.742) 11%,
				hsla(0, 0%, 0%, 0.667) 16.6%,
				hsla(0, 0%, 0%, 0.583) 23.1%,
				hsla(0, 0%, 0%, 0.495) 30.4%,
				hsla(0, 0%, 0%, 0.405) 38.3%,
				hsla(0, 0%, 0%, 0.317) 46.7%,
				hsla(0, 0%, 0%, 0.233) 55.4%,
				hsla(0, 0%, 0%, 0.158) 64.4%,
				hsla(0, 0%, 0%, 0.094) 73.5%,
				hsla(0, 0%, 0%, 0.044) 82.5%,
				hsla(0, 0%, 0%, 0.011) 91.4%,
				hsla(0, 0%, 0%, 0) 100%
			);
		}

		// Bottom gradient
		&::before {
			bottom: 0;
			height: 60%;

			// Eased gradient
			background: linear-gradient(
				to top,
				hsla(0, 0%, 0%, 0.9) 0%,
				hsla(0, 0%, 0%, 0.889) 0.8%,
				hsla(0, 0%, 0%, 0.856) 2.9%,
				hsla(0, 0%, 0%, 0.806) 6.4%,
				hsla(0, 0%, 0%, 0.742) 11%,
				hsla(0, 0%, 0%, 0.667) 16.6%,
				hsla(0, 0%, 0%, 0.583) 23.1%,
				hsla(0, 0%, 0%, 0.495) 30.4%,
				hsla(0, 0%, 0%, 0.405) 38.3%,
				hsla(0, 0%, 0%, 0.317) 46.7%,
				hsla(0, 0%, 0%, 0.233) 55.4%,
				hsla(0, 0%, 0%, 0.158) 64.4%,
				hsla(0, 0%, 0%, 0.094) 73.5%,
				hsla(0, 0%, 0%, 0.044) 82.5%,
				hsla(0, 0%, 0%, 0.011) 91.4%,
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
