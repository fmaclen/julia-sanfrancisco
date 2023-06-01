export interface TerminalLine {
	id?: number;
	text?: string;
	name?: string;
	label?: string;
	type?: 'title' | 'input' | 'select';
}

export interface TerminalRow {
	id?: number;
	text: string;
	isTitle?: boolean;
}

// import { tick } from 'svelte';

// interface TypewriterOptions {
//     speed: number;
// }

// interface TransitionConfig {
//     duration: () => Promise<number>;
//     tick: (t: number) => Promise<void>;
//     teardown: () => Promise<void>;
// }

// export function typewriter(node: HTMLElement, { speed = 50 }: TypewriterOptions): TransitionConfig {
//     const text = node.textContent;
//     node.textContent = '';

//     return {
//         async duration() {
//             return text ? text.length * speed : 0;
//         },
//         async tick(t) {
//             const i = Math.floor(t * (text ? text.length : 0));
//             node.textContent = text ? text.slice(0, i) : '';
//         },
//         async teardown() {
//             node.textContent = text;
//         },
//     };
// }
