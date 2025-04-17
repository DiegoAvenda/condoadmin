<script>
	let { data } = $props();
</script>

<p>hello {data.username}</p>

<form method="post" use:enhance action="/?/signOut">
	<button>Logout</button>
</form>
