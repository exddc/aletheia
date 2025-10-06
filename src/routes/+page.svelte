<script lang="ts">
    import type { DataPoint, WordPerformance } from "@/types";
    import CPMChart from "@/components/CPMChart.svelte";
    import WordPerformanceViz from "@/components/WordPerformance.svelte";
	import Keyboard from "@/components/Keyboard.svelte";

    // Constants
	const text = "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.";

    // State
	let currentIndex = $state<number>(0);
	let isComplete = $state<boolean>(false);
	let startTime = $state<number | null>(null);
	let elapsedTime = $state<number>(0);
	let timerInterval: number | null = null;
	let errorCount = $state<number>(0);
	let correctFirstTry = $state<number>(0);
	let hasErrorOnCurrentChar = $state<boolean>(false);
	let charTimestamps = $state<number[]>([]);
	

    // Functions
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key.length > 1 && event.key !== ' ') return;
		
		if (currentIndex < text.length) {
			if (event.key === text[currentIndex]) {
				if (currentIndex === 0) {
					startTime = Date.now();
					startTimer();
				}
				
				charTimestamps.push(Date.now());
				
				if (!hasErrorOnCurrentChar) {
					correctFirstTry++;
				}
				hasErrorOnCurrentChar = false;
				
				currentIndex++;
				if (currentIndex === text.length) {
					isComplete = true;
					stopTimer();
				}
			} else {
				if (!hasErrorOnCurrentChar) {
					hasErrorOnCurrentChar = true;
				}
				errorCount++;
			}
		}
	}

	function startTimer() {
		timerInterval = window.setInterval(() => {
			if (startTime) {
				elapsedTime = Date.now() - startTime;
			}
		}, 10);
	}

	function stopTimer() {
		if (timerInterval !== null) {
			clearInterval(timerInterval);
			timerInterval = null;
		}
	}

	function reset() {
		currentIndex = 0;
		isComplete = false;
		startTime = null;
		elapsedTime = 0;
		errorCount = 0;
		correctFirstTry = 0;
		hasErrorOnCurrentChar = false;
		charTimestamps = [];
		stopTimer();
	}

	function formatTime(ms: number): string {
		const seconds = Math.floor(ms / 1000);
		const milliseconds = Math.floor((ms % 1000) / 10);
		return `${seconds}.${milliseconds.toString().padStart(2, '0')}s`;
	}

	function calculateWPM(): number {
		if (elapsedTime === 0) return 0;
		const words = text.length / 5;
		const minutes = elapsedTime / 1000 / 60;
		return Math.round(words / minutes);
	}

	function calculateAccuracy(): number {
		const totalAttempts = correctFirstTry + (text.length - correctFirstTry);
		if (totalAttempts === 0) return 100;
		return Math.round((correctFirstTry / text.length) * 100);
	}

	function calculateCPM(): number {
		if (elapsedTime === 0) return 0;
		const minutes = elapsedTime / 1000 / 60;
		return Math.round(text.length / minutes);
	}

	function getCPMData(): DataPoint[] {
		if (!startTime || charTimestamps.length === 0) return [];
		
		const dataPoints: DataPoint[] = [];
		const windowSize = 10;
		const flowThreshold = 0.8;
		
		const avgCPM = calculateCPM();
		
		for (let i = windowSize; i <= charTimestamps.length; i++) {
			const windowStart = charTimestamps[i - windowSize];
			const windowEnd = charTimestamps[i - 1];
			const timeDiff = (windowEnd - windowStart) / 1000 / 60;
			
			if (timeDiff > 0) {
				const cpm = windowSize / timeDiff;
				const relativeTime = (windowEnd - startTime) / 1000;
				const inFlow = cpm >= avgCPM * flowThreshold;
				
				dataPoints.push({
					time: relativeTime,
					cpm: Math.round(cpm),
					inFlow
				});
			}
		}
		
		return dataPoints;
	}

	function getWordPerformance(): WordPerformance[] {
		if (!startTime || charTimestamps.length === 0) return [];
		
		const words = text.split(' ');
		const performances: WordPerformance[] = [];
		let charIndex = 0;
		const avgCPM = calculateCPM();
		
		for (const word of words) {
			const wordLength = word.length;
			const wordStart = charTimestamps[charIndex];
			const wordEnd = charTimestamps[charIndex + wordLength - 1];
			
			if (wordStart && wordEnd) {
				const timeDiff = (wordEnd - wordStart) / 1000 / 60;
				const wordCPM = timeDiff > 0 ? wordLength / timeDiff : 0;
				
				let performance: 'excellent' | 'good' | 'average' | 'slow';
				if (wordCPM >= avgCPM * 1.2) {
					performance = 'excellent';
				} else if (wordCPM >= avgCPM) {
					performance = 'good';
				} else if (wordCPM >= avgCPM * 0.7) {
					performance = 'average';
				} else {
					performance = 'slow';
				}
				
				performances.push({
					word,
					avgCPM: Math.round(wordCPM),
					performance
				});
			}
			
			charIndex += wordLength + 1;
		}
		
		return performances;
	}

</script>

<svelte:window onkeydown={handleKeyDown} />

<div class="flex flex-col justify-center items-center min-h-screen gap-8">
	<div class="flex flex-col justify-center items-center h-screen gap-8">
		<div id="top-bar" class="w-full h-16 grid grid-cols-3 justify-center items-center px-8 top-0 absolute">
			<span class="text-xl text-primary text-left">
				Aletheia
			</span>
			<div class="text-2xl font-mono font-bold text-primary text-center">
				{formatTime(elapsedTime)}
			</div>
			<a href="/login" class="text-xl text-primary text-right">Login</a>
		</div>
		<div class="flex flex-col justify-center items-center gap-8 w-full pb-24">
			{#if isComplete}
				<div class="text-center max-w-2xl">
					<div class="text-4xl font-bold text-primary mb-8">Complete! 🎉</div>
					
					<!-- Main Stats Grid -->
					<div class="grid grid-cols-2 gap-6 mb-8">
						<!-- WPM -->
						<div class="bg-secondary p-6 rounded-xl border-2 border-primary">
							<div class="text-5xl font-bold text-primary mb-2">{calculateWPM()}</div>
							<div class="text-sm uppercase tracking-wider text-foreground/60">WPM</div>
						</div>
						
						<!-- Accuracy -->
						<div class="bg-secondary p-6 rounded-xl border-2 border-accent">
							<div class="text-5xl font-bold text-accent mb-2">{calculateAccuracy()}%</div>
							<div class="text-sm uppercase tracking-wider text-foreground/60">Accuracy</div>
						</div>
					</div>
					
					<!-- CPM Over Time Chart -->
					<CPMChart data={getCPMData()} />
					
					<!-- Word Performance Visualization -->
					<WordPerformanceViz words={getWordPerformance()} />
					
					<!-- Detailed Stats -->
					<div class="bg-secondary p-6 rounded-xl mb-6 space-y-3">
						<div class="flex justify-between items-center">
							<span class="text-foreground/70">Time</span>
							<span class="font-mono font-bold text-foreground">{formatTime(elapsedTime)}</span>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-foreground/70">Characters per Minute</span>
							<span class="font-mono font-bold text-foreground">{calculateCPM()}</span>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-foreground/70">Correct on First Try</span>
							<span class="font-mono font-bold text-primary">{correctFirstTry} / {text.length}</span>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-foreground/70">Total Errors</span>
							<span class="font-mono font-bold text-destructive">{errorCount}</span>
						</div>
					{#if getCPMData().length > 0}
						{@const flowPoints = getCPMData().filter(d => d.inFlow).length}
						{@const totalPoints = getCPMData().length}
						{@const flowPercentage = Math.round((flowPoints / totalPoints) * 100)}
						<div class="flex justify-between items-center">
							<span class="text-foreground/70">Time in Flow</span>
							<span class="font-mono font-bold text-accent">{flowPercentage}%</span>
						</div>
					{/if}
					</div>
					
					<button 
						onclick={reset}
						class="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium text-lg hover:opacity-90 transition-opacity"
					>
						Try Again
					</button>
				</div>
			{:else}
				<div class="text-lg text-foreground/60 font-medium uppercase tracking-widest">
					Start the timer by typing the text below
				</div>
			{/if}
			
			<div class="text-2xl font-mono leading-relaxed text-center max-w-4xl">
				{#each text.split('') as char, index}
					{#if index < currentIndex}
						<span class="text-primary">{char}</span>
					{:else if index === currentIndex}
						<span class="bg-accent text-accent-foreground">{char}</span>
					{:else}
						<span class="text-foreground/30">{char}</span>
					{/if}
				{/each}
			</div>
		</div>
		<Keyboard class="absolute bottom-4" />
	</div>
</div>