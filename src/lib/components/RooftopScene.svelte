<script lang="ts">
	import {
		SCENE_HEIGHT,
		SCENE_WIDTH,
		type TimeOfDay,
		type Weather,
		createRooftopScene
	} from '$lib/pixel-art/rooftops';

	interface Props {
		timeOfDay?: TimeOfDay;
		weather?: Weather;
	}

	let { timeOfDay = 'night', weather = 'clear' }: Props = $props();

	let canvas: HTMLCanvasElement;
	let scene: ReturnType<typeof createRooftopScene> | undefined;

	$effect(() => {
		scene = createRooftopScene(canvas);
		return () => scene?.destroy();
	});

	$effect(() => {
		scene?.setVariant(timeOfDay, weather);
	});
</script>

<canvas
	class="rooftop-scene"
	bind:this={canvas}
	width={SCENE_WIDTH}
	height={SCENE_HEIGHT}
	aria-label="A detective chases Julia across the rooftops"
></canvas>

<style lang="scss">
	canvas.rooftop-scene {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		// On wide screens the scene crops vertically; keep the roofs clear of the intro text.
		object-position: 50% 60%;
		image-rendering: pixelated;
	}
</style>
