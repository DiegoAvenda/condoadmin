<script>
	import { checkout } from '$lib/utils/checkout.svelte.js';

	let { data } = $props();

	const today = new Date();
	const hours = [9, 10, 11, 12, 13, 14, 15];

	const appointmentsMap = new Map(data.appointments.map((app) => [app.date.getTime(), app]));

	const now = new Date();
	const today9am = now.setHours(9, 0, 0, 0);

	const dates = [];

	for (let day = 0; day < 7; day++) {
		for (let hour = 9; hour <= 15; hour++) {
			const newDate = new Date(today9am);
			newDate.setDate(now.getDate() + day);
			newDate.setHours(hour, 0, 0, 0);

			dates.push(newDate);
		}
	}

	const headerDates = dates.filter((date, index) => index % 7 === 0);

	let modalElement;
	let selectedAppointment = $state(null);

	function openModal(date) {
		checkout.date = date;
		selectedAppointment = appointmentsMap.get(date.getTime());
		modalElement?.showModal();
	}

	let editing = $state(false);

	function editingToggle() {
		editing = !editing;
	}
</script>

<div class="m-8 md:mx-24 lg:mx-36">
	<div class="mb-4 flex items-center justify-center gap-8">
		<div class="flex items-center gap-2">
			<span>Libre</span>
			<div class="h-5 w-5 border border-black bg-green-500"></div>
		</div>

		<div class="flex items-center gap-2">
			<span>En mantenimiento</span>
			<div class="h-5 w-5 border border-white bg-black"></div>
		</div>

		<div class="flex items-center gap-2">
			<span>Fiesta</span>
			<div class="h-5 w-5 border border-white bg-white"></div>
		</div>
	</div>

	<div class="mb-2 grid grid-cols-8">
		<div class="border text-center font-semibold">Hour</div>
		{#each headerDates as date}
			<div class="border text-center font-semibold">
				{date.toLocaleDateString('en-US', {
					weekday: 'short',
					day: '2-digit',
					month: '2-digit'
				})}
			</div>
		{/each}
	</div>

	<div class="grid grid-cols-8">
		{#each hours as hour}
			<div class="border text-center font-semibold">{hour}:00</div>
			{#each Array(7) as _, day}
				{#if dates[day * 7 + (hour - 9)]}
					{@const currentDate = dates[day * 7 + (hour - 9)]}
					{@const hasAppointment = appointmentsMap.has(currentDate.getTime())}
					<div class="border p-1 text-center" class:bg-white={hasAppointment}>
						<button
							class="h-full w-full"
							aria-label="appointment slot"
							disabled={hasAppointment && !data.admin}
							onclick={() => openModal(currentDate)}
						>
						</button>
					</div>
				{/if}
			{/each}
		{/each}
	</div>
</div>

<dialog bind:this={modalElement} class="modal">
	<div class="modal-box">
		{#if selectedAppointment}
			<h3 class="text-lg font-bold">Booked</h3>
			{#if editing}
				<form action="?/update" method="post">
					<input type="hidden" value={selectedAppointment.id} name="id" />
					<input
						name="name"
						type="text"
						class="w-full rounded border p-2"
						value={selectedAppointment.name}
						required
					/>
					<button class="btn">Edit</button>
				</form>
			{:else}
				<p class="py-4">
					Booked by: <span class="font-semibold">{selectedAppointment.name}</span>
				</p>
			{/if}
			{#if !editing}
				<button onclick={() => editingToggle()} class="btn">Edit</button>
			{/if}
			<form action="?/delete" method="post">
				<input type="hidden" value={selectedAppointment.id} name="id" />
				<button class="btn">Delete</button>
			</form>
			<div class="modal-action">
				<form method="dialog">
					<button class="btn">Close</button>
				</form>
			</div>
		{:else}
			<h3 class="text-lg font-bold">Booking</h3>
			<p class="py-4">Confirm your appointment booking</p>
			<div class="modal-action">
				<a class="btn" href="/checkout">Book</a>
				<form method="dialog">
					<button class="btn">Close</button>
				</form>
			</div>
		{/if}
	</div>
</dialog>
