<script lang="ts">
	export let align: 'bottom' | undefined = undefined;
</script>

<section class="section {align ? `section--${align}` : ''}">
	<slot />
</section>

<style lang="scss">
	section.section {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding-inline: 20px;
		gap: var(--spacing-m);

		&--bottom {
			justify-content: flex-end;
		}
	}
</style>
