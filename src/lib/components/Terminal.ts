export interface TerminalLine {
	id?: number;
	text?: string;
	name?: string;
	label?: string;
	type?: 'title' | 'input' | 'select';
}
