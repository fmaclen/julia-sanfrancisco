<header class="header">
	<slot />
</header>

<style lang="scss">
	@import '$lib/components/mixins.scss';

	header.header {
		@include plate;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-s);
		margin-inline: 20px;
	}
</style>
