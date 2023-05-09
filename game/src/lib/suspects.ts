
export interface Suspect {
	name: string;
	hobby: string;
	hair: string;
	feature: string;
	vehicle: string;
	sex: string;
	subjectPronoun: string;
	possesivePronoun: string;
}


export const SUSPECTS: Suspect[] = [
	{
		name: 'Julia Sanfrancisco',
		hobby: 'mountain climbing',
		hair: 'brown',
		feature: 'mole on her left cheek',
		vehicle: 'convertible',
		sex: 'female',
		subjectPronoun: 'she',
		possesivePronoun: 'her'
	},
	{
		name: 'Pedro Sanantonio',
		hobby: 'sailing',
		hair: 'black',
		feature: 'scar on his right cheek',
		vehicle: 'motorcycle',
		sex: 'male',
		subjectPronoun: 'he',
		possesivePronoun: 'his'
	}
];
