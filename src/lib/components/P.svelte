<p class="p">
	<slot />
</p>

<style lang="scss">
	@import '$lib/components/mixins.scss';

	p.p {
		font-size: 20px;
		line-height: 150%;
		margin-block: 1em;
		width: 100%;
		box-sizing: border-box;
		color: var(--color-neutral-150);
	}
</style>
