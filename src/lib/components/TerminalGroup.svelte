<section class="terminal-group">
	<slot />
</section>

<style lang="scss">
	section.terminal-group {
		@import '$lib/components/mixins.scss';
		@include plate;

		// HACK: ideally the parent grid would be the one to set the height
		max-height: 380px;
		padding-inline: unset;
		overflow-y: auto;

		--terminal-block: 24px;
		--terminal-inline: 20px;

		border-radius: var(--border-radius-l);
		margin-inline: var(--layout-inline);
		padding-block: var(--terminal-block);

		> :global(section.typewriter-container),
		> :global(section.terminal-form) {
			border-top: 1px dashed var(--color-neutral-500);

			&:first-child {
				border-top: unset;
				padding-top: unset;
			}

			&:last-child {
				padding-bottom: unset;
			}
		}
	}
</style>
