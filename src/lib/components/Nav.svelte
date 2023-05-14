<nav class="nav">
	<slot />
</nav>

<style lang="scss">
	@import '$lib/components/mixins.scss';

	nav.nav {
		display: flex;
		box-sizing: border-box;
		width: 100%;
		margin-top: auto;
		height: max-content;
		padding-inline: 20px;
		gap: var(--spacing-m);
	}
</style>
