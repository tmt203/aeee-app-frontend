<script lang="ts">
</script>

<section class="flex min-h-screen flex-col items-center justify-center bg-slate-300">
	<div class="flex w-9/12 flex-col rounded-xl bg-white p-8 shadow-md xl:w-3/12">
		<!-- Area: Logo -->
		<div class="mb-8 flex justify-center">
			<a href="/" class="w-fit">
				<img src="/images/logo.png" alt="Logo" class="h-8 w-auto" />
			</a>
		</div>

		<!-- Area: Form -->
		<slot />
	</div>
</section>
