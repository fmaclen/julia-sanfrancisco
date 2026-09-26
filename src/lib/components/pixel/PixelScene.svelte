<script lang="ts">
	interface Props {
		tall: string;
		wide: string;
		dimmed?: boolean;
	}

	let { tall, wide, dimmed = false }: Props = $props();
</script>

<!-- Full-screen scene behind the UI. Narrower screens get the portrait version, wider ones the
     landscape version, so the crop stays gentle at every size. -->
<div class="absolute inset-0">
	<picture>
		<source media="(max-aspect-ratio: 9/10)" srcset={tall} />
		<img src={wide} alt="" class="pixel-crisp block h-full w-full object-cover" />
	</picture>
	<div
		class={[
			'absolute inset-0 transition-colors duration-300',
			dimmed
				? 'bg-[#0b0a10cc]'
				: 'bg-linear-to-b from-[#0b0a1088] via-transparent via-20% to-[#0b0a10dd]'
		]}
	></div>
</div>
