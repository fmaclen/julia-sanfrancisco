<nav class="nav">
	<slot />
</nav>

<style lang="scss">
	@import '$lib/components/mixins.scss';

	nav.nav {
		display: flex;
		box-sizing: border-box;
		width: 100%;
		height: max-content;
		gap: var(--spacing-m);
		margin-top: auto;
		padding-bottom: var(--spacing-xl);
		padding-inline: var(--spacing-xl);
	}
</style>
