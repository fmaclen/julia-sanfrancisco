<p class="p">
	<slot />
</p>

<style lang="scss">
	@import '$lib/components/mixins.scss';

	p.p {
		@include plate;
		font-size: 16px;
		line-height: 150%;
		margin-block: 0;
		width: 100%;
		box-sizing: border-box;
	}
</style>
