# Julia Sanfrancisco

Chase Julia and her accomplices across different countries, unraveling clues, solving puzzles, and expanding your geography knowledge in this exciting detective game.

🕹️ [**Play it now**](https://julia.fernando.is) — 💻 Devlog on [**Discord**](https://discord.com/channels/532702198040100874/1108858794831790080) & [**Twitter**](https://twitter.com/fmaclen/)

![Collage of artwork from the game](https://github.com/fmaclen/julia-sanfrancisco/blob/main/static/open-graph.png?raw=true)

---

## About the project

**Julia Sanfrancisco** is a clone of the 80s MS-DOS game [Where in the World is Carmen Sandiego?](https://archive.org/details/msdos_Where_in_the_World_is_Carmen_Sandiego_Enhanced_1989).
This project is meant as a proof-of-concept for leveraging generative AI to create the game and it's assets.

### Short-term roadmap

- Implement the game mechanics from the original game
- Generate updated clues for the cities featured in the original game
- Generate new artwork for the cities featured in the original game
- Implement a new mobile-based UI with improved UX

Follow the [current progress here](https://github.com/fmaclen/julia-sanfrancisco/issues).

---

## Development

### Current stack

- Written in Typescript using [`SvelteKit`](https://kit.svelte.dev).
- There is no backend, the game runs entirely on the browser.
- Your `name`, `score` and current `play session` is stored locally on your device.
- Clues have been generated with OpenAI's [`GPT-4`](https://openai.com/research/gpt-4).
- Artwork was generated with Stable Diffusion using [`deliberate_v2`](https://civitai.com/models/4823/deliberate).

### Contribute

The game is currently open for contributions. If you want to help, please join the [Discord server](https://discord.com/channels/532702198040100874/1108858794831790080) and/or check the [issues](https://github.com/fmaclen/julia-sanfrancisco/issues) for tasks that need to be done.

### Environment setup

To run the development environment locally:

- Clone the repository.
- Copy `.env.example` and rename it to `.env`.
- Then run:

```bash
npm install

npm run start
```

To create a production version of the game:

```bash
npm run build
```

## References

- Wikipedia: [Where in the World Is Carmen Sandiego?](<https://en.wikipedia.org/wiki/Where_in_the_World_Is_Carmen_Sandiego%3F_(1985_video_game)>)
