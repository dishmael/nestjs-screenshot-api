# NestJS Screenshot Service

A NestJS-powered API service that utilizes **Puppeteer** to capture screenshots of a specified URL.

## Features
- Fetches screenshots of websites using Puppeteer
- Returns images in PNG format (base64 string)
- Utilizes rate limiting for free and paid tiers (WIP)
- Utilizes authentication to determine tier (WIP)

## Installation

Clone the repository:

```sh
git clone https://github.com/yourusername/nestjs-screenshot-service.git
cd nestjs-screenshot-service
```

## Testing Site (Svelte 5)

```ts
<script lang="ts">
	let url = $state('');
	let imageSrc: string = $state('');
	let isLoading = $state(false);

	async function getScreenshot(url: string) {
		try {
			isLoading = true;
			imageSrc = '';

			const response = await fetch('http://localhost:3000/api/screenshot/v1', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ url })
			});

			if (!response.ok) {
				throw new Error(`Error: ${response.status} - ${await response.text()}`);
			}

			const jsonResponse = await response.json();
			imageSrc = jsonResponse.rawImage;
		} catch (error) {
			console.error('Failed to fetch screenshot:', error);
		} finally {
			isLoading = false; // Stop loading
		}
	}
</script>

<div class="flex min-h-screen flex-col items-start bg-gray-100 p-6">
	<h1 class="mb-4 text-3xl font-bold text-gray-800">Screen Capture Test Page</h1>

	<div class="space-y-4 rounded-lg bg-white p-4 shadow-lg">
		<input
			type="text"
			bind:value={url}
			placeholder="Enter URL to screenshot"
			class="w-64 h-10 rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
		/>
		<button
			class="w-48 h-10 rounded-md bg-blue-600 ml-4 px-6 py-2 text-sm text-center text-white transition hover:bg-blue-700 disabled:opacity-50"
			onclick={() => getScreenshot(url)}
			disabled={isLoading}
		>
			{isLoading ? 'Processing...' : 'Generate Screenshot'}
		</button>
	</div>

	{#if isLoading}
		<p class="mt-6 text-gray-600">Loading...</p>
	{/if}

	{#if imageSrc}
		<div class="mt-6 w-full">
			<img class="rounded-lg shadow-lg" src={imageSrc} alt="Screenshot" />
		</div>
	{/if}
</div>
```