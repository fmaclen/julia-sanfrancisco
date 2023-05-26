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
		padding-inline: var(--spacing-xl);

		@media (max-width: 512px) {
			padding-inline: var(--spacing-l);
		}

		&:last-child {
			margin-bottom: var(--spacing-xl);
		}
	}
</style>
