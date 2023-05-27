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
		letter-spacing: -0.05em;
		line-height: 1.1em;
		font-weight: 700;

		&--hero {
			font-size: 56px;
			margin-block: var(--spacing-l);
		}
	}
</style>
