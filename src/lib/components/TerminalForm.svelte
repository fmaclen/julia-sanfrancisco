<script>
	import { slide } from 'svelte/transition';
</script>

<section class="terminal-form" in:slide>
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
		border-top: 1px dashed var(--color-neutral-500);

		&:first-child {
			border-top: unset;
		}
	}
</style>
