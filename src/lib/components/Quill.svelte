<script>
	let { postContent = '', isAnonymous = false, postType = 'general', attachments = [] } = $props();

	$derived((remainingChars = 500 - postContent.length));
	$derived((isSubmitDisabled = !postContent.trim() || isSubmitting));

	let isSubmitting = false;
	let error = '';

	function handleFileUpload(e) {
		const files = Array.from(e.target.files);
		if (attachments.length + files.length > 5) {
			error = 'Máximo 5 archivos permitidos';
			return;
		}
		attachments = [...attachments, ...files];
	}

	function removeAttachment(index) {
		attachments = attachments.toSpliced(index, 1);
	}

	async function handleSubmit() {
		if (!postContent.trim()) {
			error = 'El contenido del post no puede estar vacío';
			return;
		}

		isSubmitting = true;
		error = '';

		try {
			// Simular envío a API
			await new Promise((resolve) => setTimeout(resolve, 1000));

			console.log('Post enviado:', {
				content: postContent,
				isAnonymous,
				type: postType,
				attachments: attachments.map((f) => f.name)
			});

			// Resetear formulario
			postContent = '';
			isAnonymous = false;
			postType = 'general';
			attachments = [];

			// En una app real, podrías emitir un evento o usar un store
			alert('¡Post publicado con éxito!');
		} catch (err) {
			error = 'Error al crear el post. Por favor intenta nuevamente.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="mx-auto mb-6 max-w-2xl rounded-lg bg-white p-6 shadow-md">
	<h2 class="mb-4 text-xl font-bold text-gray-800">Crear nuevo post</h2>

	{#if error}
		<div class="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
			{error}
		</div>
	{/if}

	<div class="mb-4">
		<textarea
			bind:value={postContent}
			maxlength="500"
			class="w-full rounded-lg border px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			rows="4"
			placeholder="¿Qué quieres compartir con la comunidad?"
		></textarea>
		<div class="mt-1 text-xs text-gray-500">
			{remainingChars} caracteres restantes
		</div>
	</div>

	<div class="mb-4 flex flex-wrap gap-4">
		<!-- Tipo de post -->
		<div class="min-w-[200px] flex-1">
			<label class="mb-2 block text-sm font-bold text-gray-700" for="postType">
				Tipo de post
			</label>
			<select
				id="postType"
				bind:value={postType}
				class="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			>
				<option value="general">General</option>
				<option value="announcement">Anuncio</option>
				<option value="event">Evento</option>
				<option value="question">Pregunta</option>
				<option value="urgent">Urgente</option>
			</select>
		</div>

		<!-- Opción anónimo -->
		<label class="flex cursor-pointer items-center">
			<input
				type="checkbox"
				bind:checked={isAnonymous}
				class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
			/>
			<span class="ml-2 block text-sm text-gray-700"> Publicar como anónimo </span>
		</label>
	</div>

	<!-- Adjuntos -->
	<div class="mb-4">
		<label class="mb-2 block text-sm font-bold text-gray-700">Adjuntos</label>
		<div class="flex items-center gap-2">
			<label
				class="cursor-pointer rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
			>
				<span>Añadir archivos</span>
				<input
					type="file"
					class="hidden"
					multiple
					on:change={handleFileUpload}
					accept="image/*, .pdf, .doc, .docx"
				/>
			</label>
			<span class="text-sm text-gray-500">Máx. 5 archivos</span>
		</div>

		{#if attachments.length > 0}
			<div class="mt-2 space-y-2">
				{#each attachments as file, index}
					<div class="flex items-center justify-between rounded bg-gray-50 p-2">
						<div class="flex items-center">
							{@const isImage = file.type.startsWith('image/')}
							<snippet>
								{#if isImage}
									<svg
										class="mr-2 h-5 w-5 text-blue-500"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
								{:else}
									<svg
										class="mr-2 h-5 w-5 text-gray-500"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
										/>
									</svg>
								{/if}
							</snippet>
							<span class="max-w-xs truncate text-sm">{file.name}</span>
							<span class="ml-2 text-xs text-gray-500">
								({(file.size / 1024).toFixed(1)} KB)
							</span>
						</div>
						<button
							on:click={() => removeAttachment(index)}
							class="text-red-500 hover:text-red-700"
							aria-label="Eliminar archivo"
						>
							<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
								/>
							</svg>
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Botón de enviar -->
	<div class="flex justify-end">
		<button
			on:click={handleSubmit}
			disabled={isSubmitDisabled}
			class="rounded-lg px-4 py-2 font-medium text-white transition-colors
			   {isSubmitDisabled ? 'cursor-not-allowed bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}"
		>
			{isSubmitting ? 'Publicando...' : 'Publicar'}
		</button>
	</div>
</div>
