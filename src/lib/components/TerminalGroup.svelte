<section class="terminal-group">
	<slot />
</section>

<style lang="scss">
	section.terminal-group {
		@import '$lib/components/mixins.scss';
		@include plate;

		max-height: 50dvh;
		padding-inline: unset;
		overflow-y: auto;

		--terminal-block: 24px;

		border-radius: var(--border-radius-l);
		margin-inline: var(--layout-inline);
		padding-block: var(--terminal-block);
	}
</style>
