import { ARGENTINA } from "./atlases/argentina"

const startTime = "Monday 9:00 am"
const endTime = "Sunday 5:00 pm"

const sex = 'Male'
const pronoun = 'he'
const pronounConjugation = 'his'
const vehicle = 'motorcycle'
const hairColor = 'blonde'

const currency = new Intl.DisplayNames(['en-US'], { type: 'currency' }).of(ARGENTINA.currency)
const dictionary = ARGENTINA.language
const flagColors = ARGENTINA.flag
const leader = ARGENTINA.leader

const city = ARGENTINA.city
const toDo = ARGENTINA.toDo[0]
const see = ARGENTINA.see[0]
const trade = ARGENTINA.trade[0]
const study = ARGENTINA.study[0]
const stolen = ARGENTINA.stolen[0]

export const BRIEFING = [
  `National treasure stolen from ${city}. The treasure has been identified as ${stolen}. ${sex} suspect reported at the scene of the crime. `
]

export const LOCATION_CLUES = [
  `All I know is that ${pronoun} was researching ${study}.`,
  `All I know is that ${pronoun} asked about the exchange rate for ${currency}.`,
  `All I know is that ${pronoun} planned to ${toDo}.`,
  `I saw the person you're looking for and ${pronoun} asked about the exchange rate for ${currency}.`,
  `I saw the person you're looking for and ${pronoun} planned to explore ${see}.`,
  `A suspicious person was here and ${pronoun} planned to ${toDo}.`,
  `A suspicious person was here and ${pronoun} wanted to study ${study}.`,
  `A suspicious person was here and ${pronoun} asked about the exchange rate for ${currency}.`,
  `A suspicious person was here and ${pronoun} changed ${pronounConjugation} money to ${currency}.`,
  `I saw the person you're looking for and ${pronoun} wanted to know about ${study}.`,
  `I saw the person you're looking for and ${pronoun} was researching ${study}.`,
  `A reliable source told me ${pronoun} changed ${pronounConjugation} money to ${currency}.`,
  `A reliable source told me ${pronoun} wanted to ${toDo}.`,
  `A reliable source told me ${pronoun} wanted a guide to ${study}.`,
  `A reliable source told me ${pronoun} had a ${dictionary} in ${pronounConjugation} pocket.`,
  `A reliable source told me ${pronoun} she wanted —a guide to Italian gestures—.`,
  `Sources tell me ${pronoun} asked questions about ${study}.`,
  `Sources tell me ${pronoun} was interested in ${study}.`,
  `Sources tell me ${pronoun} asked many questions about ${study}.`,
  `Sources tell me ${pronoun} planned to ${toDo}.`,
  `Sources tell me ${pronoun} asked when was the best time of the year to ${toDo}.`,
  `My sources tell me ${pronoun} planned to ${toDo}.`,
  `My sources tell me ${pronoun} was heading to ${see}.`,
  `My sources tell me ${pronoun} asked for a map of ${see}.`,
  `My sources tell me ${pronoun} kept asking about ${study}.`,
  `My sources tell me ${pronoun} was carrying a ${dictionary} phrase book.`,
  `My sources tell me ${pronoun} drove away in a vehicle flying ${flagColors}.`,
  `My sources tell me ${pronoun} where ${pronounConjugation} could find the best collection of ${trade}.`,
  `The person you are looking for was here and ${pronoun} said ${pronoun} wanted to ${toDo}.`,
  `The person you are looking for was here and ${pronoun} asked about ${toDo}.`,
  `The person you are looking for was here and ${pronoun} changed ${pronounConjugation} money to ${currency}.`,
  `The person you are looking for was here and ${pronoun} left in a plane with ${flagColors} on it's wing.`,
  `The person you are looking for was here and ${pronoun} wanted to know if there were any five-start hotels on ${see}.`,
  `The person you are looking for was here and ${pronoun} checked out all the books on ${study}.`,
  `I heard ${pronoun} was researching ${study}.`,
  `I heard ${pronoun} changed ${pronounConjugation} money to ${currency}.`,
  `I heard ${pronoun} was going ${toDo} with the ${leader}`,
]

const SUSPECT_CLUES = [
  `${pronoun} had a large ring on.`,
  `${pronoun} had an ugly tattoo.`,
  `${pronoun} tried to conceal a tattoo.`,
  `I noticed a tattoo on ${pronounConjugation} arm.`,
  `${pronoun} had a tattoo on ${pronounConjugation} arm.`,
  `${pronoun} arrived on a ${vehicle}.`, // on a motorcycle
  `${pronoun} arrived in a ${vehicle}.`, // in a private limo
  `${pronoun} had ${hairColor} hair.`,
  `${pronoun} said that ${pronounConjugation} enjoyed playing tennis.`,
  `${pronoun} had ${pronounConjugation} driver along.`,
  `${pronoun} was riding a motorbike.`,
  `${pronoun} mentioned ${pronoun} liked seafood.`,
]
