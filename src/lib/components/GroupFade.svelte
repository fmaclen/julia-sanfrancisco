<script>
	import { fade } from 'svelte/transition';
</script>

<div class="transition-container" transition:fade>
	<slot />
</div>

<style lang="scss">
	div.transition-container {
		width: 100%;
		height: 100%;
	}
</style>
