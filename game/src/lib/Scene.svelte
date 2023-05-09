<script lang="ts">
	export let city: string;
	export let calendar: string;
</script>

<section class="scene">
	<div class="scene__details">
		<h1 class="h1">{city}</h1>
		<h3 class="h3">{calendar}</h3>
		<img src="locations/{city.toLowerCase()}.png" class="scene__img" alt={city} />
	</div>
</section>

<style lang="scss">
	@import './Scene.scss';
</style>
