<section class="terminal-group">
	<slot />
</section>

<style lang="scss">
	section.terminal-group {
		@import '$lib/components/mixins.scss';
		@include plate;

		max-height: 400px;
		overflow-y: auto;

		--terminal-block: 24px;
		--terminal-inline: 20px;

		border-radius: var(--border-radius-l);
		margin-inline: var(--layout-inline);
	}
</style>
