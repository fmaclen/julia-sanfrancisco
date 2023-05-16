export interface Suspect {
	name: string;
	hobby: string;
	hair: string;
	feature: string;
	vehicle: string;
	sex: string;
	pronoun: string;
	possessivePronoun: string;
}

export const SUSPECTS: Suspect[] = [
	{
		name: 'Julia Sanfrancisco',
		hobby: 'mountain climbing',
		hair: 'brown',
		feature: 'mole on her left cheek',
		vehicle: 'convertible',
		sex: 'female',
		pronoun: 'she',
		possessivePronoun: 'her'
	},
	{
		name: 'Pedro Sanantonio',
		hobby: 'sailing',
		hair: 'black',
		feature: 'scar on his right cheek',
		vehicle: 'motorcycle',
		sex: 'male',
		pronoun: 'he',
		possessivePronoun: 'his'
	}
];
