export interface Suspect {
	name: string;
	hobby: string;
	hair: string;
	feature: string;
	vehicle: string;
	sex: string;
	pronouns: {
		subject: string;
		possessive: string;
		object: string;
	};
}

export const SUSPECTS: Suspect[] = [
	{
		name: 'Julia Sanfrancisco',
		hobby: 'mountain climbing',
		hair: 'brown',
		feature: 'mole on her left cheek',
		vehicle: 'convertible',
		sex: 'Female',
		pronouns: {
			subject: 'she',
			possessive: 'her',
			object: 'her'
		}
	},
	{
		name: 'Pedro Sanantonio',
		hobby: 'sailing',
		hair: 'black',
		feature: 'scar on his right cheek',
		vehicle: 'motorcycle',
		sex: 'Male',
		pronouns: {
			subject: 'he',
			possessive: 'his',
			object: 'him'
		}
	}
];
