export interface Suspect {
	name: string;
	hobby: string;
	hair: string;
	feature: string;
	vehicle: string;
	sex: 'Male' | 'Female';
}

export const SUSPECTS: Suspect[] = [
	{
		name: 'Julia Sanfrancisco',
		hobby: 'Mountain climbing',
		hair: 'Brown',
		feature: 'Mole on her left cheek',
		vehicle: 'Convertible',
		sex: 'Female'
	},
	{
		name: 'Pedro Sanantonio',
		hobby: 'Sailing',
		hair: 'Black',
		feature: 'Scar on his right cheek',
		vehicle: 'Motorcycle',
		sex: 'Male'
	}
];
