/**
 * Displays the general information of a Pokémon.
*/
import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PokeEvolution from "./PokeEvolution";
import PokeAbility from "./PokeAbility";

export default function PokeDetails() {
    const API_URL = 'https://pokeapi.co/api/v2';
    const { pokemon } = useParams();
    const [pokeData, setPokeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    // id of last pokemon for each region
    const regionIdMax = useMemo(() => [
        { name: "Kanto", idMax: 151 },
        { name: "Johto", idMax: 251 },
        { name: "Hoenn", idMax: 386 },
        { name: "Sinnoh", idMax: 493 },
        { name: "Unova", idMax: 649 },
        { name: "Kalos", idMax: 721 },
        { name: "Alola", idMax: 809 },
        { name: "Galar", idMax: 905 },
        { name: "Paldea", idMax: 1025 }
    ], []);
    // pokemon type colors
    const typeColors = {
        normal: "#A8A878",
        fire: "#F08030",
        water: "#6890F0",
        electric: "#F8D030",
        grass: "#78C850",
        ice: "#98D8D8",
        fighting: "#C03028",
        poison: "#A040A0",
        ground: "#E0C068",
        flying: "#A890F0",
        psychic: "#F85888",
        bug: "#A8B820",
        rock: "#B8A038",
        ghost: "#705898",
        dragon: "#7038F8",
        dark: "#705848",
        steel: "#B8B8D0",
        fairy: "#EE99AC"
    };
    // routes to certain pokemon in this page
    const navigateToPokemon = (name) => {
        navigate(`/${name.toLowerCase()}`);
    };
    // goes to previous pokemon when left arrow is clicked
    const getPrevPokemon = async (id) => {
        if (id > 1) {
            const prev = await axios.get(`${API_URL}/pokemon/${id - 1}`).then(response => response.data.name);
            return prev;
        } else {
            return null;
        }
    };
    // goes to next pokemon when right arrow is clicked
    const getNextPokemon = async (id) => {
        if (id < 1025) {
            const next = await axios.get(`${API_URL}/pokemon/${id + 1}`).then(response => response.data.name);
            return next;
        } else {
            return null;
        }
    };
    // identifies region of the pokemon basing from the id of the pokemon and the regionIdMax array
    const determinePokeRegion = useCallback((id) => {
        return regionIdMax.find(region => region.idMax >= id)?.name;
    }, [regionIdMax]);
    // fetches abilities of pokemon
    const fetchAbilityDetails = async (abilityUrls) => {
        const abilityDetails = [];
        for (const url of abilityUrls) {
            const response = await axios.get(url);
            abilityDetails.push({
                name: response.data.name.charAt(0).toUpperCase() + response.data.name.slice(1),
                desc: response.data.effect_entries.find(entry => entry.language.name === 'en')?.effect || "Description not available."
            });
        }
        return abilityDetails;
    };
    // identifies evo chain of pokemon
    const determineEvolutionChain = (chain) => {
        const evos = [
            chain.species.name.charAt(0).toUpperCase() + chain.species.name.slice(1)
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
    // fetches correct sprites of the pokemon in the evo chain
    const fetchEvolutionSprites = async (evolutionLine) => {
        const sprites = [];
        for (const name of evolutionLine) {
            const response = await axios.get(`${API_URL}/pokemon/${name.toLowerCase()}`);
            sprites.push(response.data.sprites.front_default);
        }
        return sprites;
    };
    // calculate gender ratio of pokemon
    const calculateGenderRatio = (rate) => {
        if (rate === -1) {
            return ["Genderless"];  // value for genderless is -1
        } else {
            const femaleRate = (rate / 8) * 100;    // value is based on female ratio, in eights
            const maleRate = 100 - femaleRate;
            // Female Percentage    = genderRatioData[0]
            // Male Percentage      = genderRatioData[1]
            return [femaleRate.toFixed(2), maleRate.toFixed(2)];
        }
    };

    useEffect(() => {
        const fetchPokeData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/pokemon/${pokemon}`);
                const pokeSpeciesData = await axios.get(`${API_URL}/pokemon-species/${response.data.id}`);
                const pokeEvolutionData = await axios.get(pokeSpeciesData.data.evolution_chain.url);
                const englishDesc = pokeSpeciesData.data.flavor_text_entries.find(entry => entry.language.name === 'en');
                // * species (e.g., Seed Pokémon)
                const species = pokeSpeciesData.data.genera.find(genus => genus.language.name === 'en').genus;
                // * description
                const description = englishDesc
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
                const region = determinePokeRegion(response.data.id);
                // * cry - taken from external repo
                const cry = `https://veekun.com/dex/media/pokemon/cries/${response.data.id}.ogg`;
                
                setPokeData({
                    ...response.data, 
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
                setError("Failed to fetch Pokémon data.");
                console.error("ERROR: Error in fetching Pokémon data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPokeData();
        // re-runs hook to fetch and update details whenever a new pokemon is selected/searched 
        // re-runs determinePokeRegion() function in case of new function logic, since it depends on regionIdMax
    }, [pokemon, determinePokeRegion]);

    if (loading) return <img className="loading" src="src\assets\loading_screen.gif" alt="" />; // loading screen
    if (error) return <p>{error}</p>; // error message

    return (
        <main className="detail-main main">
            <header className="header">
                <div className="header-wrapper">
                    <div className="header-wrap">
                        <a href="/" className="back-btn-wrap">
                            <img 
                                src="src/assets/back-to-home.svg" 
                                alt="back to home" 
                                className="back-btn" 
                                id="back-btn"
                            />
                        </a>
                        {/* NAME & NATIONAL POKEDEX ID */}
                        <div className="name-wrap">
                            <h1 className="name">
                                {pokeData ? pokeData.name.charAt(0).toUpperCase() + pokeData.name.slice(1) : ""}
                            </h1>
                        </div>
                    </div>
                    <div className="pokemon-id-wrap">
                        <p className="body2-fonts">
                            {pokeData ? `#${pokeData.id}` : ""}
                        </p>
                    </div>
                </div>
            </header>
            {/* SPRITE */}
            <div className="featured-img">
                <a 
                    href="#" 
                    className="arrow left-arrow" 
                    id="leftArrow" 
                    onClick={() => pokeData && getPrevPokemon(pokeData.id).then(prevName => navigateToPokemon(prevName))}
                >
                    <img src="src/assets/chevron_left.svg" alt="back" />
                </a>
                <div className="detail-img-wrapper">
                    <img 
                        src={pokeData ? pokeData.sprites.front_default : ""} 
                        alt={pokeData ? pokeData.name : ""} 
                        title={pokeData ? pokeData.name.charAt(0).toUpperCase() + pokeData.name.slice(1) : ""}
                        onClick={() => {
                            const cryAudio = new Audio(pokeData.cry);
                            cryAudio.play();
                        }}
                    />
                </div>
                <a 
                    href="#" 
                    className="arrow right-arrow" 
                    id="rightArrow" 
                    onClick={() => pokeData && getNextPokemon(pokeData.id).then(nextName => navigateToPokemon(nextName))}
                >
                    <img src="src/assets/chevron_right.svg" alt="forward" />
                </a>
            </div>
            {/* TYPE */}
            <div className="detail-card-detail-wrapper">
                <div className="power-wrapper">
                    {
                        pokeData && pokeData.types.map((t, index) => (
                            <p 
                                key={index} 
                                className={`body3-fonts type ${t.type.name}`} 
                                style={{ backgroundColor: typeColors[t.type.name] || "#000000" }}
                            >
                                {t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)}
                            </p>
                        ))
                    }
                </div>
                {/* WEIGHT, HEIGHT, REGION */}
                <p className="body2-fonts about-text">About</p>
                <div className="pokemon-detail-wrapper">
                    <div className="pokemon-detail-wrap">
                        <div className="pokemon-detail">
                            <img src="src/assets/weight.svg" alt="weight" />
                            <p className="body3-fonts weight">{pokeData ? (pokeData.weight / 10).toFixed(1) : ""} kg</p>
                        </div>
                        <p className="caption-fonts">Weight</p>
                    </div>
                    <div className="pokemon-detail-wrap">
                        <div className="pokemon-detail">
                            <img src="src/assets/height.svg" alt="height" />
                            <p className="body3-fonts height">{pokeData ? (pokeData.height / 10).toFixed(1) : ""} m</p>
                        </div>
                        <p className="caption-fonts">Height</p>
                    </div>
                    <div className="pokemon-detail-wrap">
                        <div className="pokemon-detail">
                            <img src="src/assets/location.svg" alt="region" className="location" />
                            <p className="body3-fonts">{pokeData?.region}</p>
                        </div>
                        <p className="caption-fonts">Region</p>
                    </div>
                </div>
                {/* DESCRIPTION */}
                <div className="description-wrapper">
                    <p className="description body3-fonts">{pokeData ? pokeData.description : ""}</p>
                </div>
                {/* GENDER RATIO */}
                <div className="gender-wrapper">
                    <p className="caption-fonts">Gender Ratio</p>
                    <div className="gender-container">
                        {
                            pokeData && pokeData.genderRatio[0] !== "Genderless" ? (
                                <>
                                    <div className="male-gender">
                                        <img className="gender-ico" src="src\assets\1.png" alt="" />
                                        <p className="body3-fonts">{pokeData.genderRatio[1]}% Male</p>
                                    </div>
                                    <div className="female-gender">
                                    <img className="gender-ico" src="src\assets\2.png" alt="" />
                                        <p className="body3-fonts">{pokeData.genderRatio[0]}% Female</p>
                                    </div>
                                </>
                            ) : (
                                <p className="body3-fonts genderless">{pokeData.genderRatio[0]}</p>
                            )
                        }
                    </div>
                </div>
                {/* STATUS */}
                <div className="stats-wrapper">
                    {
                        pokeData && pokeData.stats.map((statsData) => {
                            const statName = statsData.stat.name
                                .replace('hp', 'HP')
                                .replace('special-attack', 'Sp. Atk')
                                .replace('special-defense', 'Sp. Def');
                            // color is based on the first type of the pokemon
                            const statBarColor = (pokeData.types.length > 0) ? typeColors[pokeData.types[0].type.name] : "#000000";
                            return (
                                <div className="stat-wrap" key={statsData.stat.name}>
                                    <div className="stat">
                                        <p className="caption-fonts">{statName.charAt(0).toUpperCase() + statName.slice(1)}</p>
                                        <p className="stats-fonts">{statsData.base_stat}</p>
                                    </div>
                                    <div className="stat-bar">
                                        <div 
                                            className="progress-bar" 
                                            style={{ 
                                                backgroundColor: statBarColor, 
                                                width: `${statsData.base_stat / 2}%` 
                                            }}
                                        >
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                {/* ABILITIES */}
                <PokeAbility abilities={pokeData?.abilityDetails} />
                {/* EVOLUTION CHAIN */}
                <PokeEvolution evolutionLine={pokeData?.evolutionLine} evolutionSprites={pokeData?.evolutionSprites} />
            </div>
        </main>
    );
}
