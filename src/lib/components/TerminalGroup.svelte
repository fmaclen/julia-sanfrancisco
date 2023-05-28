<section class="terminal-group">
	<slot />
</section>

<style lang="scss">
	section.terminal-group {
		background-color: rgba(10, 10, 10, 0.8);
		-webkit-backdrop-filter: blur(4px);
		backdrop-filter: blur(4px);

		padding-inline: unset;
		max-height: 50dvh;
		overflow-y: auto;

		--terminal-block: 24px;

		border-radius: var(--border-radius-l);
		margin-inline: var(--layout-inline);
		padding-block: var(--terminal-block);
	}
</style>
