<script lang="ts">
	import type { DataPoint } from '@/types';

    // Props
	let { data }: { data: DataPoint[] } = $props();

    // Derived
	const maxCPM = $derived(Math.max(...data.map((d) => d.cpm)));
	const maxTime = $derived(Math.max(...data.map((d) => d.time)));

    // Constants
	const chartWidth = 600;
	const chartHeight = 200;
	const padding = 40;
</script>

{#if data.length > 0}
	<div class="bg-secondary p-6 rounded-xl mb-6">
		<div class="text-sm uppercase tracking-wider text-foreground/60 mb-4">CPM Over Time</div>
		<svg viewBox={`0 0 ${chartWidth} ${chartHeight + padding}`} class="w-full h-auto">
			<!-- Grid lines -->
			{#each [0, 0.25, 0.5, 0.75, 1] as ratio}
				<line
					x1={padding}
					y1={padding + chartHeight * (1 - ratio)}
					x2={chartWidth - padding}
					y2={padding + chartHeight * (1 - ratio)}
					stroke="#e2e8f0"
					stroke-width="1"
				/>
				<text
					x={padding - 5}
					y={padding + chartHeight * (1 - ratio) + 4}
					text-anchor="end"
					font-size="12"
					fill="#64748b"
				>
					{Math.round(maxCPM * ratio)}
				</text>
			{/each}

			<!-- Flow state background -->
			{#each data as point, i}
				{#if point.inFlow && i > 0}
					{@const x1 = padding + ((data[i - 1]?.time || 0) / maxTime) * (chartWidth - 2 * padding)}
					{@const x2 = padding + (point.time / maxTime) * (chartWidth - 2 * padding)}
					<rect
						x={x1}
						y={padding}
						width={x2 - x1}
						height={chartHeight}
						fill="#eab308"
						opacity="0.1"
					/>
				{/if}
			{/each}

			<!-- Line chart -->
			{#if data.length > 1}
				<polyline
					points={data
						.map((d) => {
							const x = padding + (d.time / maxTime) * (chartWidth - 2 * padding);
							const y = padding + chartHeight - (d.cpm / maxCPM) * chartHeight;
							return `${x},${y}`;
						})
						.join(' ')}
					fill="none"
					stroke="#0284c7"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			{/if}

			<!-- Data points -->
			{#each data as point}
				{@const x = padding + (point.time / maxTime) * (chartWidth - 2 * padding)}
				{@const y = padding + chartHeight - (point.cpm / maxCPM) * chartHeight}
				<circle
					cx={x}
					cy={y}
					r="4"
					fill={point.inFlow ? '#eab308' : '#0284c7'}
					stroke="white"
					stroke-width="2"
				/>
			{/each}

			<!-- X-axis label -->
			<text
				x={chartWidth / 2}
				y={chartHeight + padding + 20}
				text-anchor="middle"
				font-size="12"
				fill="#64748b"
			>
				Time (seconds)
			</text>

			<!-- Legend -->
			<circle cx={chartWidth - 120} cy={20} r="4" fill="#0284c7" />
			<text x={chartWidth - 110} y={24} font-size="12" fill="#64748b">Normal</text>
			<circle cx={chartWidth - 50} cy={20} r="4" fill="#eab308" />
			<text x={chartWidth - 40} y={24} font-size="12" fill="#64748b">Flow</text>
		</svg>
		<div class="text-xs text-foreground/50 mt-2 text-center">
			Flow state: Typing at 80%+ of your average speed
		</div>
	</div>
{/if}

