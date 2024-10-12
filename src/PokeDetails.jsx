import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function PokeDetails() {
    const { pokemon } = useParams();
    const [pokeData, setPokeData] = useState(null);
    const API_URL = 'https://pokeapi.co/api/v2';
    const regionIdMax = [
        {name: "Kanto", idMax: 151},
        {name: "Johto", idMax: 251},
        {name: "Hoenn", idMax: 386},
        {name: "Sinnoh", idMax: 493},
        {name: "Unova", idMax: 649},
        {name: "Kalos", idMax: 721},
        {name: "Alola", idMax: 809},
        {name: "Galar", idMax: 905},
        {name: "Paldea", idMax: 1025}
    ];

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
                        .replace(/\u000C/g, ' ')
                        .trim()
                    : "Description not found.";
                // * evolution line (e.g., Bulbasaur -> Ivysaur -> Venusaur)
                const evolutionLine = determineEvolutionChain(pokeEvolutionData.data.chain);
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
                    evolutionLine, 
                    genderRatio, 
                    region, 
                    cry
                });
            } catch (err) {
                console.error("ERROR: Error in fetching Pokémon data:", err);
            }
        };
        fetchPokeData();
    }, [pokemon]);

    const determinePokeRegion = (id) => {
        return regionIdMax.find(region => region.idMax >= id).name;
    };

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

    return (
        <>
        {
            pokeData ? (
                /*
                * PokéDex Number + Pokemon Name
                * Species
                * Sprite / Model
                * Description
                * Height
                * Weight
                * Type(s)
                * Abilities
                * Base Stats
                * Gender Ratio
                * Region
                * Cry
                */
                <div>
                    <h2 className="pokemon-name">
                        &#x2116; {pokeData.id}: {
                            pokeData.name.charAt(0).toUpperCase() + 
                            pokeData.name.slice(1)
                        }
                    </h2>
                    <p className="pokemon-species">{pokeData.species}</p>
                    <img 
                        src={pokeData.sprites.front_default} 
                        alt={pokeData.name} 
                        title={pokeData.name.charAt(0).toUpperCase() + pokeData.name.slice(1)}
                        className="pokemon-sprite" 
                    />
                    <p className="pokemon-">Description: {pokeData.description}</p>
                    <p className="pokemon-height">Height: {pokeData.height}</p>
                    <p className="pokemon-weight">Weight: {pokeData.weight}</p>
                    <p className="pokemon-type">
                        Types: {
                            pokeData.types.map(t => 
                                t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)
                            ).join(', ')
                        }
                    </p>
                    <p className="pokemon-ability">Abilities: {pokeData.abilities.map(a => a.ability.name).join(', ')}</p>
                    <div className="pokemon-base-stats">
                        <p>Base Stats:</p>
                        <ul>
                            {
                                pokeData.stats.map((statsData) => (
                                    <li key={statsData.stat.name}>
                                        {
                                            statsData.stat.name.charAt(0).toUpperCase() + 
                                            statsData.stat.name.slice(1)}: {statsData.base_stat
                                        }
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <p className="pokemon-evolution-line">Evolution Line: {pokeData.evolutionLine}</p>
                    <p className="pokemon-gender-ratio">
                        Gender Ratio:
                        {
                            pokeData.genderRatio === "Genderless"
                                ? " Genderless"
                                : ` Male: ${pokeData.genderRatio[1]}% Female: ${pokeData.genderRatio[0]}%`
                        }
                    </p>
                    <p className="pokemon-region">Region: {pokeData.region}</p>
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
