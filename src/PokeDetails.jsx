/**
 * Displays the PokéDex information of a particular pokemon.
*/
import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PokeEvolution from "./PokeEvolution";
import PokeAbility from "./PokeAbility";

export default function PokeDetails() {
    const { pokemon } = useParams();
    const [pokeData, setPokeData] = useState(null);
    const API_URL = 'https://pokeapi.co/api/v2';
    const navigate = useNavigate();
    // wrapped in useMemo() function so that it doesn't get recalculated on every render
    const regionIdMax = useMemo(() => [
        {name: "Kanto", idMax: 151},
        {name: "Johto", idMax: 251},
        {name: "Hoenn", idMax: 386},
        {name: "Sinnoh", idMax: 493},
        {name: "Unova", idMax: 649},
        {name: "Kalos", idMax: 721},
        {name: "Alola", idMax: 809},
        {name: "Galar", idMax: 905},
        {name: "Paldea", idMax: 1025}
    ], []);
    
    // main navigation function to go to the correct pokemon pages
    const navigateToPokemon = (name) => {
        navigate(`/${name.toLowerCase()}`);
    };

    // runs when left arrow is clicked; goes to the previous pokemon basing from its id
    const getPrevPokemon = async (id) => {
        if (id > 1) {
            const prev = await axios.get(`${API_URL}/pokemon/${id - 1}`).then(response =>  response.data.name);
            return prev;
        } else {
            return null;
        }
    };
    
    // runs when right arrow is clicked; goes to the next pokemon basing from its id
    const getNextPokemon = async (id) => {
        if (id < 1025) {
            const next = await axios.get(`${API_URL}/pokemon/${id + 1}`).then(response =>  response.data.name);
            return next;
        } else {
            return null;
        }
    };
    
    // wrapped in useCallback() function to prevent unnecessary re-renders
    const determinePokeRegion = useCallback((id) => {
        return regionIdMax.find(region => region.idMax >= id).name;
    }, [regionIdMax]);

    // fetches data to display for the PokeAbility component
    const fetchAbilityDetails = async (abilityUrl) => {
        const abilityDetails = [];
        for (const url of abilityUrl) {
            const response = await axios.get(url);
            abilityDetails.push({
                name: response.data.name.charAt(0).toUpperCase() + response.data.name.slice(1),
                desc: response.data.effect_entries.find(entry => entry.language.name === 'en')?.effect || "Description not available."
            });
        }
        return abilityDetails;
    };

    // determines evolution chain of the pokemon
    const determineEvolutionChain = (chain) => {
        const evos = [
            chain.species.name.charAt(0).toUpperCase() + 
            chain.species.name.slice(1)
        ];
        let curr = chain;
        
        while (curr.evolves_to.length > 0) {
            curr = curr.evolves_to[0];
            evos.push(
                curr.species.name.charAt(0).toUpperCase() +
                curr.species.name.slice(1)
            );
        }
        return evos.join(' → ');
    };

    // fetches data to display for the PokeEvolution component
    const fetchEvolutionSprites = async (evolutionLine) => {
        const sprites = [];
        for (const name of evolutionLine) {
            const response = await axios.get(`${API_URL}/pokemon/${name.toLowerCase()}`);
            sprites.push(response.data.sprites.front_default);
        }
        return sprites;
    };

    // calculates gender ratio basing from the rate value of female pokemon
    const calculateGenderRatio = (rate) => {
        if (rate === -1) {
            return "Genderless";
        } else {
            const femaleRate = (rate / 8) * 100;
            const maleRate = 100 - femaleRate;
            // Female Percentage    = genderRatioData[0]
            // Male Percentage      = genderRatioData[1]
            const genderRatioData = [femaleRate.toFixed(2), maleRate.toFixed(2)];
            return genderRatioData;
        }
    };

    // main data fetch
    useEffect(() => {
        const fetchPokeData = async () => {
            try {
                const response = await axios.get(`${API_URL}/pokemon/${pokemon}`);
                const pokeSpeciesData = await axios.get(`${API_URL}/pokemon-species/${response.data.id}`);
                const pokeEvolutionData = await axios.get(pokeSpeciesData.data.evolution_chain.url);
                
                // * species (e.g., Seed Pokémon)
                const englishDesc = pokeSpeciesData.data.flavor_text_entries.find(entry => entry.language.name === 'en');
                const species = response.data.species = pokeSpeciesData.data.genera
                    .find(genus => genus.language.name === 'en')
                    .genus;
                // * description
                const description = response.data.description = englishDesc
                    ? englishDesc.flavor_text
                        .replace(/&#\d+;/g, '')
                        .replace(/[^a-zA-ZéÉ\s,.!?'-]/g, '')
                        .replace(/\n/g, ' ')
                        .replace(/\f/g, ' ')
                        .trim()
                    : "Description not found.";
                // * abiility (e.g., Overgrown: <description>, Chlorophyll: <description>)
                const abilityDetails = await fetchAbilityDetails(response.data.abilities.map(a => a.ability.url));
                // * evolution line (e.g., Bulbasaur -> Ivysaur -> Venusaur)
                const evolutionLine = determineEvolutionChain(pokeEvolutionData.data.chain);
                const evolutionSprites = await fetchEvolutionSprites(evolutionLine.split(' → '));
                // * gender ratio (e.g., 87.5% male, 12.5% female)
                const genderRatio = calculateGenderRatio(pokeSpeciesData.data.gender_rate);
                // * region (e.g., Kanto)
                const region = response.data.region = determinePokeRegion(response.data.id);
                // * cry - taken from external repo
                const cry = `https://veekun.com/dex/media/pokemon/cries/${response.data.id}.ogg`;
                
                setPokeData({
                    ... response.data, 
                    species, 
                    description, 
                    abilityDetails, 
                    evolutionLine, 
                    evolutionSprites, 
                    genderRatio, 
                    region, 
                    cry
                });
            } catch (err) {
                console.error("ERROR: Error in fetching Pokémon data:", err);
            }
        };
        fetchPokeData();
        // re-runs hook to fetch and update details whenever a new pokemon is selected/searched 
        // re-runs determinePokeRegion() function in case of new function logic, since it depends on regionIdMax
    }, [pokemon, determinePokeRegion]);

    return (
        <>
        {
            pokeData ? (
                // already contains class names for styling
                <div>
                    {/*Pokemon Name and National PokéDex ID */}
                    <div className="pokemon-navigation">
                        {
                            pokeData.id > 1 && (
                                <h2 onClick={() => getPrevPokemon(pokeData.id).then(navigateToPokemon)} className="pokemon-previous">
                                    ←
                                </h2>
                            )
                        }
                        <h2 className="pokemon-name">
                            &#x2116; {pokeData.id}: {
                                pokeData.name.charAt(0).toUpperCase() + 
                                pokeData.name.slice(1)
                            }
                        </h2>
                        {
                            pokeData.id < 1025 && (
                                <h2 onClick={() => getNextPokemon(pokeData.id).then(navigateToPokemon)} className="pokemon-next">
                                    →
                                </h2>
                            )
                        }
                    </div>
                    {/* Species */}
                    <p className="pokemon-species">{pokeData.species}</p>
                    {/* Sprite */}
                    <img 
                        src={pokeData.sprites.front_default} 
                        alt={pokeData.name} 
                        title={pokeData.name.charAt(0).toUpperCase() + pokeData.name.slice(1)}
                        className="pokemon-sprite" 
                    />
                    {/* Description */}
                    <p className="pokemon-description">Description: {pokeData.description}</p>
                    {/* Height */}
                    <p className="pokemon-height">Height: {parseFloat((pokeData.height / 10).toFixed(2))} meters</p>
                    {/* Weight */}
                    <p className="pokemon-weight">Weight: {parseFloat((pokeData.weight * 100).toFixed(5))} grams</p>
                    {/* Types */}
                    <p className="pokemon-type">
                        Types: {
                            pokeData.types.map(t => 
                                t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)
                            ).join(', ')
                        }
                    </p>
                    {/* Abilities */}
                    <PokeAbility abilities={pokeData.abilityDetails} />
                    {/* Base Statistics */}
                    <div className="pokemon-base-stats">
                        <p>Base Stats:</p>
                        {
                            pokeData.stats.map((statsData) => (
                                <p key={statsData.stat.name} className="pokemon-base-stats-name">
                                    {
                                        (() => {
                                            // for text readability
                                            switch (statsData.stat.name) {
                                                case 'hp':
                                                    return 'HP';
                                                case 'special-attack':
                                                    return 'Sp. Atk';
                                                case 'special-defense':
                                                    return 'Sp. Def';
                                                default:
                                                    return statsData.stat.name.charAt(0).toUpperCase() + statsData.stat.name.slice(1);
                                            }
                                        })()
                                    }: {statsData.base_stat}
                                </p>
                            ))
                        }
                    </div>
                    {/* Evolution Lineup */}
                    <PokeEvolution 
                        evolutionLine={pokeData.evolutionLine.split(' → ')}
                        evolutionSprites={pokeData.evolutionSprites}
                        onEvolutionClick={navigateToPokemon}
                    />
                    {/* Gender Ratio */}
                    <p className="pokemon-gender-ratio">
                        Gender Ratio:
                        {
                            pokeData.genderRatio === "Genderless"
                                ? " Genderless"
                                : ` Male: ${pokeData.genderRatio[1]}% Female: ${pokeData.genderRatio[0]}%`
                        }
                    </p>
                    {/* Region */}
                    <p className="pokemon-region">Region: {pokeData.region}</p>
                    {/* Cry */}
                    <p className="pokemon-cry">
                        Pokémon Cry:
                        <audio controls key={pokeData.id}>
                            <source src={pokeData.cry} type="audio/ogg" />
                        </audio>
                    </p>
                </div>
            ) : (
                // TODO: Change temporary loading screen to rotating Pokéball.
                <p>Loading...</p>
            )
        }
        </>
    );
};
