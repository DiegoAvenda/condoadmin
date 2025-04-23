<script>
	let posts = [];
	let title = '';
	let content = '';

	function createPost() {
		if (!title.trim() || !content.trim()) return;

		posts = [
			{
				id: Date.now(),
				title,
				content,
				createdAt: new Date()
			},
			...posts
		];

		title = '';
		content = '';
	}
</script>

<div class="mx-auto max-w-2xl space-y-6 p-4">
	<!-- Formulario para crear post -->
	<div class="space-y-4 rounded-2xl bg-white p-6 shadow-md">
		<h2 class="text-xl font-bold text-gray-800">Nuevo aviso</h2>
		<input
			class="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			placeholder="Título"
			bind:value={title}
		/>
		<textarea
			class="h-28 w-full resize-none rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			placeholder="Escribe el contenido aquí..."
			bind:value={content}
		></textarea>
		<button
			class="rounded-xl bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
			on:click={createPost}
		>
			Publicar
		</button>
	</div>

	<!-- Lista de posts -->
	<div class="space-y-4">
		{#each posts as post (post.id)}
			<div class="rounded-2xl bg-white p-4 shadow">
				<h3 class="text-lg font-semibold text-gray-800">{post.title}</h3>
				<p class="mt-2 whitespace-pre-line text-gray-700">{post.content}</p>
				<p class="mt-2 text-sm text-gray-400">
					{new Date(post.createdAt).toLocaleString()}
				</p>
			</div>
		{/each}
	</div>
</div>
