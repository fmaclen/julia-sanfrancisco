<h3 class="terminal-rows__h3">
	<slot />
</h3>

<style lang="scss">
	h3.terminal-rows__h3 {
		font-size: 0.8em;
		letter-spacing: 0.05em;
		font-weight: 700;
		text-transform: uppercase;
		margin-block: unset;
		font-family: var(--font-family-mono);
		color: var(--color-neutral-50);

		&::before {
			content: '> ';
		}
	}
</style>
