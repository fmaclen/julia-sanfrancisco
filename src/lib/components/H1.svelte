<script lang="ts">
	export let hero: boolean = false;
</script>

<h1 class="h1 {hero ? 'h1--hero' : ''}">
	<slot />
</h1>

<style lang="scss">
	h1.h1 {
		font-size: 48px;
		margin-block: 0;
		transform: translateX(-3px); // Aligned visually with `<Time />`
		letter-spacing: -0.05em;

		&--hero {
			font-size: 56px;
			margin-block: var(--spacing-l);
		}
	}
</style>
