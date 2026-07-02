<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<p class="p">
	{@render children?.()}
</p>

<style lang="scss">
	p.p {
		font-size: 18px;
		line-height: 150%;
		margin-block: 0.5em;
		width: 80%; // Looks prettier at this width 🤷‍♂️
		box-sizing: border-box;
		color: var(--color-neutral-150);

		&:first-child {
			margin-top: 0;
		}

		&:last-child {
			margin-bottom: 0;
		}
	}
</style>
