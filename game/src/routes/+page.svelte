<script lang="ts">
	import { onMount } from 'svelte';
	import Scene from '../lib/Scene.svelte';
	import { City, Place, type Game, Character, Rank } from '../lib/scenarios';
	import { format } from 'date-fns';

	// const SECONDS_IN_WEEK = 604_800;
	// const SECONDS_IN_DAY = 86_400;
	// const DAYS_OF_THE_WEEK = [
	// 	'Monday',
	// 	'Tuesday',
	// 	'Wednesday',
	// 	'Thursday',
	// 	'Friday',
	// 	'Saturday',
	// 	'Sunday'
	// ];

	// const DEFAULT_TICK = 2000;
	// let tick = 2000;
	// let today = DAYS_OF_THE_WEEK[0];
	// let hour = 12;
	// let minutes = 0;

	// function updateClock() {
	// 	if (minutes === 59) {
	// 		minutes = 0;
	// 		hour += 1;
	// 	} else {
	// 		minutes += 1;
	// 	}
	// }

	// const interval = setInterval(updateClock, tick);

	// let currentCity = CITIES[0].city;

	// function travelTo(index: number) {
	// 	tick = tick / 10; // Speed up tick rate by 4x

	// 	setTimeout(() => {
	// 		currentCity = CITIES[index].city;
	// 		tick = DEFAULT_TICK;
	// 	}, 3000);
	// }

	// $: console.log(interval);

	const currentGame: Game = {
		locations: [
			{
				city: City.AMSTERDAM,
				scenes: [
					{
						place: Place.AIRPORT,
						character: Character.PILOT,
						dialog: `No idea ${Rank.GUMSHOE}`
					}
				],
				travelTo: [City.BANGKOK, City.BUENOS_AIRES, City.MUMBAI]
			}
		],
		suspect: {
			name: 'Julia Sanfrancisco',
			hair: 'Brunette',
			hobby: 'Writing prompts',
			vehicle: 'Convertible'
		},
		stolenItem: 'The Eiffel Tower',
		currentTime: 1672549200000 / 1000
	};

  onMount(()=>{
    const interval = setInterval(() => {
      currentGame.currentTime += 1000 * 60; // A minute every 2 seconds
    }, 2000);

    return ()=> clearInterval(interval);
  })
</script>

<Scene city={'Miami'} calendar={format(currentGame.currentTime, 'EEEE hh:mm aaa')} />
<!-- 
<nav class="scene__nav">
	<button class="scene__button" on:click={() => console.log('ZINGG')}>Miami</button>
	<button class="scene__button" on:click={() => console.log('ZINGG')}>Charleston</button>
	<button class="scene__button" on:click={() => console.log('ZINGG')}>Amsterdam</button>
	<button class="scene__button" on:click={() => console.log('ZINGG')}>Buenos Aires</button>
</nav> -->
