<nav class="nav">
	<slot />
</nav>

<style lang="scss">
	@import '$lib/components/mixins.scss';

	nav.nav {
		display: flex;
		height: max-content;
		justify-content: center;
		column-gap: 8px;
		margin-inline: var(--layout-inline);
	}
</style>
