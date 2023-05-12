<script lang="ts">
	export let href: string;
	export let target: string = '';
	export let isActive: boolean = false;
</script>

<a class="a {isActive ? 'a--active' : ''}" {target} {href}>
	<slot />
</a>

<style lang="scss">
	@import '$lib/components/mixins.scss';

	a.a {
		@include plate;
		@include button;

		&:hover {
			filter: invert(1);
		}
	}
</style>
