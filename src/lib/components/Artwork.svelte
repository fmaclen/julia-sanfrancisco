<script lang="ts">
	import { fade } from 'svelte/transition';

	export let src: string;
	export let isHidden: boolean = false;
	export let isDisabled: boolean = false;
	export let isHighContrast: boolean = true;
</script>

<div
	in:fade
	class="artwork
		{isHidden ? 'artwork--hidden' : ''}
		{isDisabled ? 'artwork--disabled' : ''}
		{isHighContrast ? 'artwork--high-contrast' : ''}
	"
>
	<img class="artwork__img" {src} alt="Illustration of scene" />
</div>

<style lang="scss">
	div.artwork {
		position: absolute;
		inset: 0;
		z-index: 0;
		opacity: 1;
		transition: filter 1500ms, opacity 500ms;

		&::after,
		&::before {
			content: '';
			position: absolute;
			width: 100%;
			height: 33%;
			left: 0;
			right: 0;
			opacity: 0.65;
			transition: height 1000ms, opacity 1000ms;
		}

		// Top gradient
		&::after {
			top: 0;

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
			bottom: -1px; // The bottom edge of the gradient glitches when it animates, this fixes it

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

		&--high-contrast {
			&::after {
				opacity: 0.85;
				height: 50%;
			}

			&::before {
				opacity: 0.95;
				height: 75%;
			}
		}

		&--hidden {
			opacity: 0;
		}

		&--disabled {
			filter: grayscale(100%) brightness(0.5) blur(4px);
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

		border-radius: 16px;

		@media (max-width: 512px) {
			border-bottom-left-radius: unset;
			border-bottom-right-radius: unset;
			overflow: hidden;
		}
	}
</style>
