<script lang="ts">
	import Controls from '$lib/components/Controls.svelte';

	export let src: string[] = [];
	// export let captions: string[] = [];

	// player state
	let paused: boolean = true;
	let current_time: number;
	let duration;
	let volume: number = 1;
	// let on_subtitles: boolean;
	// let is_loading: boolean;
	let is_fullscreen: boolean;
	// let show_controls: boolean;
	let player_instance: HTMLDivElement;

	// video vars
	let is_client = typeof window !== 'undefined' ? true : false;
</script>

<div
	bind:this={player_instance}
	class="relative flex h-full w-full items-center justify-center bg-black"
>
	<video
		bind:paused
		bind:currentTime={current_time}
		bind:duration
		bind:volume
		class="h-auto w-full"
	>
		{#each src as source}
			<source src={source} />
		{/each}
		<track kind="captions" />
	</video>
	<Controls
		{player_instance}
		{duration}
		bind:paused
		bind:current_time
		bind:volume
		bind:is_fullscreen
	/>
</div>
