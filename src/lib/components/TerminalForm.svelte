<section class="terminal-form">
	<slot />
</section>

<style lang="scss">
	section.terminal-form {
		display: grid;
		align-items: center;
		grid-template-columns: repeat(2, auto);
		gap: var(--terminal-inline);
		padding-block: var(--terminal-block);
		padding-inline: var(--terminal-inline);

		&:last-child {
			padding-bottom: unset;
		}
	}
</style>
