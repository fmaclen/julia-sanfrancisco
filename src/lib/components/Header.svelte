<header class="header">
	<slot />
</header>

<style lang="scss">
	header.header {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-s);
		margin-inline: var(--layout-inline);
		margin-top: var(--layout-block);
	}
</style>
