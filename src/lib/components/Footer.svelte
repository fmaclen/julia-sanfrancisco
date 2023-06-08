<footer class="footer">
	<slot />
</footer>

<style lang="scss">
	footer.footer {
		display: flex;
		flex-direction: column;
		gap: var(--layout-block);
		margin-top: auto;
		margin-bottom: var(--layout-block);
	}
</style>
