<script lang="ts">
	interface Props {
		hero?: boolean;
		children?: import('svelte').Snippet;
	}

	let { hero = false, children }: Props = $props();
</script>

<h1 class="h1 {hero ? 'h1--hero' : ''}">
	{@render children?.()}
</h1>

<style lang="scss">
	h1.h1 {
		font-size: 48px;
		margin-block: 0;
		letter-spacing: -0.05em;
		line-height: 1.1em;
		font-weight: 700;

		&--hero {
			font-size: 56px;
			margin-block: var(--spacing-l);
		}

		@media (max-width: 512px) {
			font-size: 40px;

			&--hero {
				font-size: 48px;
			}
		}
	}
</style>
