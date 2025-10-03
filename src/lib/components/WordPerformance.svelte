<script lang="ts">
	import type { WordPerformance } from '@/types';

	// Props
	let { words }: { words: WordPerformance[] } = $props();

	// Functions
	function getWordClass(performance: string): string {
		switch (performance) {
			case 'excellent':
				return 'bg-primary text-primary-foreground';
			case 'good':
				return 'bg-accent text-accent-foreground';
			case 'average':
				return 'bg-secondary-foreground/10 text-foreground';
			case 'slow':
				return 'bg-destructive/20 text-destructive';
			default:
				return '';
		}
	}
</script>

{#if words.length > 0}
	<div class="bg-secondary p-6 rounded-xl mb-6">
		<div class="text-sm uppercase tracking-wider text-foreground/60 mb-4">
			Word-by-Word Performance
		</div>
		<div class="flex flex-wrap gap-2 justify-center mb-4">
			{#each words as wordData}
				<span
					class={`px-3 py-2 rounded-lg font-mono text-sm transition-transform hover:scale-110 cursor-default ${getWordClass(wordData.performance)}`}
					title={`${wordData.avgCPM} CPM`}
				>
					{wordData.word}
				</span>
			{/each}
		</div>
		<div class="flex justify-center gap-4 text-xs">
			<div class="flex items-center gap-2">
				<div class="w-3 h-3 rounded bg-primary"></div>
				<span class="text-foreground/70">Excellent (120%+)</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="w-3 h-3 rounded bg-accent"></div>
				<span class="text-foreground/70">Good (100%+)</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="w-3 h-3 rounded bg-secondary-foreground/10"></div>
				<span class="text-foreground/70">Average (70%+)</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="w-3 h-3 rounded bg-destructive/20"></div>
				<span class="text-foreground/70">Slow (&lt;70%)</span>
			</div>
		</div>
	</div>
{/if}

