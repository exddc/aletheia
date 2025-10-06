<script lang="ts">
  import { onMount } from 'svelte';
  import { cn } from '$lib/utils';
  import type { Key } from '$lib/types';

  // Props
  const { class: className }: { class: string } = $props();

  // Constants
  const BG_COLOR = 'bg-[#67666b]';
  const KEY_BG_COLOR = 'bg-[#161920]';
  const KEY_TEXT_COLOR = 'text-[#c2c5ca]';
  const KEY_ACTIVE_BG_COLOR = 'bg-[#1f2125]';
  const BORDER_COLOR = 'border-transparent';
  const KEY_BORDER_RADIUS = 'rounded-md';
  const FONT_FAMILY = 'font-sans';
  const KEY_INSET_BORDER_COLOR = 'border-b-zinc-700';

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
      { code: 'Backspace', symbol: '⌫', label: '', size: 1.5, align: 'right' },
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
      { code: 'Backslash', label: '\\', shiftLabel: '|', size: 1 },
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
      { code: 'Enter', symbol: '↩︎', label: '', size: 1.75, align: 'right' },
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
      { code: 'ShiftRight', symbol: '⇧', label: '', size: 2.25, align: 'right' },
    ],
    [
      { code: 'ControlLeft', symbol: '⌃', label: 'control', size: 1.25, align: 'left' },
      { code: 'AltLeft', symbol: '⌥', label: 'option', size: 1.25, align: 'left' },
      { code: 'MetaLeft', symbol: '⌘', label: 'command', size: 1.5, align: 'left' },
      { code: 'Space', label: '', size: 6 },
      { code: 'MetaRight', symbol: '⌘', label: 'command', size: 1.5, align: 'right' },
      { code: 'AltRight', symbol: '⌥', label: 'option', size: 1.25, align: 'right' },
      { code: 'ControlRight', symbol: '⌃', label: 'control', size: 1.25, align: 'right' },
    ],
  ];

  // State
  let pressedKeys = $state<Record<string, boolean>>({});

  // Functions
  function handleKeyDown(event: KeyboardEvent) {
    pressedKeys[event.code] = true;
  }

  function handleKeyUp(event: KeyboardEvent) {
    delete pressedKeys[event.code];
  }

  function handleMouseDown(code: string) {
    pressedKeys[code] = true;
  }

  function handleMouseUp(code: string) {
    delete pressedKeys[code];
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

<div id="keyboard" class={cn(className, 'mx-auto w-full max-w-3xl')}>
  <div class={cn('flex w-full flex-col gap-1 rounded-lg border p-1 shadow-lg', BG_COLOR, BORDER_COLOR, FONT_FAMILY, className)}>
    {#each keyboardLayout as row}
      <div class="flex w-full justify-center gap-1">
        {#each row as key}
          <button
            class={cn(
              'flex min-h-[50px] basis-0 cursor-pointer flex-col items-stretch justify-center border-b-2 px-2 py-1 text-sm transition-all duration-75 ease-in-out',
              KEY_BORDER_RADIUS,
              KEY_TEXT_COLOR,
              KEY_INSET_BORDER_COLOR,
              {
                'translate-y-px border-b-0': pressedKeys[key.code],
              },
              pressedKeys[key.code] ? KEY_ACTIVE_BG_COLOR : KEY_BG_COLOR,
            )}
            style="flex-grow: {key.size || 1}; text-align: {key.align || 'center'}"
            onmousedown={() => handleMouseDown(key.code)}
            onmouseup={() => handleMouseUp(key.code)}
            onmouseleave={() => handleMouseUp(key.code)}
          >
            {#if key.shiftLabel}
              <div class="px-1 text-xs">{key.shiftLabel}</div>
              <div class="px-1 text-base">{key.label}</div>
            {:else}
              <div class="px-1">
                {#if key.symbol && !key.label}
                  <span class="text-xl font-light">{key.symbol}</span>
                {:else if key.symbol && key.label}
                  <div class="leading-none">
                    <div class="text-lg font-light">{key.symbol}</div>
                    <div class="mt-0.5 text-[10px] tracking-wider">{key.label}</div>
                  </div>
                {:else}
                  <span class="text-sm leading-none">{key.label}</span>
                {/if}
              </div>
            {/if}
          </button>
        {/each}
      </div>
    {/each}
  </div>
</div>
