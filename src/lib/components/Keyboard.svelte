<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { cn } from '$lib/utils';

	// --- Constants ---
	const BG_COLOR = 'bg-[#67666b]';
	const KEY_BG_COLOR = 'bg-[#161920]';
	const KEY_TEXT_COLOR = 'text-[#c2c5ca]';
	const KEY_ACTIVE_BG_COLOR = 'bg-[#1f2125]';
	const BORDER_COLOR = 'border-transparent';
	const KEY_BORDER_RADIUS = 'rounded-md';
	const FONT_FAMILY = 'font-sans';
	const KEY_INSET_BORDER_COLOR = 'border-b-zinc-700';

	type Key = {
		code: string;
		label: string;
		shiftLabel?: string;
		size?: number;
		align?: 'left' | 'right' | 'center';
		symbol?: string;
	};

	const keyboardLayout: Key[][] = [
		[
			{ code: 'Backquote', label: '`', shiftLabel: '~' },
			{ code: 'Digit1', label: '1', shiftLabel: '!' },
			{ code: 'Digit2', label: '2', shiftLabel: '@' },
			{ code: 'Digit3', label: '3', shiftLabel: '#' },
			{ code: 'Digit4', label: '4', shiftLabel: '$' },
			{ code: 'Digit5', label: '5', shiftLabel: '%' },
			{ code: 'Digit6', label: '6', shiftLabel: '^' },
			{ code: 'Digit7', label: '7', shiftLabel: '&' },
			{ code: 'Digit8', label: '8', shiftLabel: '*' },
			{ code: 'Digit9', label: '9', shiftLabel: '(' },
			{ code: 'Digit0', label: '0', shiftLabel: ')' },
			{ code: 'Minus', label: '-', shiftLabel: '_' },
			{ code: 'Equal', label: '=', shiftLabel: '+' },
			{ code: 'Backspace', symbol: '⌫', label: '', size: 1.5, align: 'right' }
		],
		[
			{ code: 'Tab', symbol: '⇥', label: '', size: 1.5, align: 'left' },
			{ code: 'KeyQ', label: 'Q' },
			{ code: 'KeyW', label: 'W' },
			{ code: 'KeyE', label: 'E' },
			{ code: 'KeyR', label: 'R' },
			{ code: 'KeyT', label: 'T' },
			{ code: 'KeyY', label: 'Y' },
			{ code: 'KeyU', label: 'U' },
			{ code: 'KeyI', label: 'I' },
			{ code: 'KeyO', label: 'O' },
			{ code: 'KeyP', label: 'P' },
			{ code: 'BracketLeft', label: '[', shiftLabel: '{' },
			{ code: 'BracketRight', label: ']', shiftLabel: '}' },
			{ code: 'Backslash', label: '\\', shiftLabel: '|', size: 1 }
		],
		[
			{ code: 'CapsLock', symbol: '⇪', label: '', size: 1.75, align: 'left' },
			{ code: 'KeyA', label: 'A' },
			{ code: 'KeyS', label: 'S' },
			{ code: 'KeyD', label: 'D' },
			{ code: 'KeyF', label: 'F' },
			{ code: 'KeyG', label: 'G' },
			{ code: 'KeyH', label: 'H' },
			{ code: 'KeyJ', label: 'J' },
			{ code: 'KeyK', label: 'K' },
			{ code: 'KeyL', label: 'L' },
			{ code: 'Semicolon', label: ';', shiftLabel: ':' },
			{ code: 'Quote', label: "'", shiftLabel: '"' },
			{ code: 'Enter', symbol: '↩︎', label: '', size: 1.75, align: 'right' }
		],
		[
			{ code: 'ShiftLeft', symbol: '⇧', label: '', size: 2.25, align: 'left' },
			{ code: 'KeyZ', label: 'Z' },
			{ code: 'KeyX', label: 'X' },
			{ code: 'KeyC', label: 'C' },
			{ code: 'KeyV', label: 'V' },
			{ code: 'KeyB', label: 'B' },
			{ code: 'KeyN', label: 'N' },
			{ code: 'KeyM', label: 'M' },
			{ code: 'Comma', label: ',', shiftLabel: '<' },
			{ code: 'Period', label: '.', shiftLabel: '>' },
			{ code: 'Slash', label: '/', shiftLabel: '?' },
			{ code: 'ShiftRight', symbol: '⇧', label: '', size: 2.25, align: 'right' }
		],
		[
			{ code: 'ControlLeft', symbol: '⌃', label: 'control', size: 1.25, align: 'left' },
			{ code: 'AltLeft', symbol: '⌥', label: 'option', size: 1.25, align: 'left' },
			{ code: 'MetaLeft', symbol: '⌘', label: 'command', size: 1.5, align: 'left' },
			{ code: 'Space', label: '', size: 6 },
			{ code: 'MetaRight', symbol: '⌘', label: 'command', size: 1.5, align: 'right' },
			{ code: 'AltRight', symbol: '⌥', label: 'option', size: 1.25, align: 'right' },
			{ code: 'ControlRight', symbol: '⌃', label: 'control', size: 1.25, align: 'right' }
		]
	];

	let pressedKeys = new Set<string>();

	function handleKeyDown(event: KeyboardEvent) {
		pressedKeys.add(event.code);
		pressedKeys = pressedKeys;
	}

	function handleKeyUp(event: KeyboardEvent) {
		pressedKeys.delete(event.code);
		pressedKeys = pressedKeys;
	}

	function handleMouseDown(code: string) {
		pressedKeys.add(code);
		pressedKeys = pressedKeys;
	}

	function handleMouseUp(code: string) {
		pressedKeys.delete(code);
		pressedKeys = pressedKeys;
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	});
</script>

<div
	class={cn(
		'flex flex-col gap-1 p-1 rounded-lg w-full max-w-3xl mx-auto shadow-lg border',
		BG_COLOR,
		BORDER_COLOR,
		FONT_FAMILY
	)}
>
	{#each keyboardLayout as row}
		<div class="flex justify-center gap-1 w-full">
			{#each row as key}
				<button
					class={cn(
						'flex flex-col items-stretch justify-center min-h-[50px] px-2 py-1 border-b-2 text-sm cursor-pointer transition-all duration-75 ease-in-out basis-0',
						KEY_BORDER_RADIUS,
						KEY_TEXT_COLOR,
						KEY_INSET_BORDER_COLOR,
						{
							'translate-y-px border-b-0': pressedKeys.has(key.code)
						},
						pressedKeys.has(key.code) ? KEY_ACTIVE_BG_COLOR : KEY_BG_COLOR
					)}
					style="flex-grow: {key.size || 1}; text-align: {key.align || 'center'}"
					on:mousedown={() => handleMouseDown(key.code)}
					on:mouseup={() => handleMouseUp(key.code)}
					on:mouseleave={() => handleMouseUp(key.code)}
				>
					{#if key.shiftLabel}
						<div class="text-xs px-1">{key.shiftLabel}</div>
						<div class="text-base px-1">{key.label}</div>
					{:else}
						<div class="px-1">
							{#if key.symbol && !key.label}
								<span class="text-xl font-light">{key.symbol}</span>
							{:else if key.symbol && key.label}
								<div class="leading-none">
									<div class="text-lg font-light">{key.symbol}</div>
									<div class="text-[10px] mt-0.5 tracking-wider">{key.label}</div>
								</div>
							{:else}
								<span class="leading-none text-sm">{key.label}</span>
							{/if}
						</div>
					{/if}
				</button>
			{/each}
		</div>
	{/each}
</div>
