<header class="header">
	<slot />
</header>

<style lang="scss">
	@import '$lib/components/mixins.scss';

	header.header {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-s);
		margin-inline: var(--spacing-xl);
		margin-top: var(--spacing-xl);
	}
</style>
