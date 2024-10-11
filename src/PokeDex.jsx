import React, { useState, useEffect } from "react";
import axios from 'axios';
import Header from "./Header";

export default function PokeDex() {
    const [pokemon, setPokemon] = useState('');
    const [pokeData, setPokeData] = useState(null);
    const [pokemonList, setPokemonList] = useState([]);
    const [filteredPokemonList, setFilteredPokemonList] = useState([]);
    const API_URL = 'https://pokeapi.co/api/v2';
    const regions = {
        all: { 
            name: "all", idStart: 1, idEnd: 1025
        },
        kanto: { 
            name: "kanto", idStart: 1, idEnd: 151 
        },
        johto: { 
            name: "johto", idStart: 152, idEnd: 251 
        },
        hoenn: { 
            name: "hoenn", idStart: 252, idEnd: 386 
        },
        sinnoh: { 
            name: "sinnoh", idStart: 387, idEnd: 493 
        },
        unova: { 
            name: "unova", idStart: 494, idEnd: 649 
        },
        kalos: { 
            name: "kalos", idStart: 650, idEnd: 721 
        },
        alola: { 
            name: "alola", idStart: 722, idEnd: 809 
        },
        galar: { 
            name: "galar", idStart: 810, idEnd: 905 
        },
        paldea: {
            name: "paldea", idStart: 906, idEnd: 1025
        }
    };

    useEffect(() => {
        const fetchAllPokemon = async () => {
            try {
                const response = await axios.get(`${API_URL}/pokemon?limit=100000`);
                setPokemonList(response.data.results);
                setFilteredPokemonList(response.data.results); // Initialize filtered list
            } catch (err) {
                console.error("ERROR: Error in fetching Pokémon list:", err);
            }
        };
        fetchAllPokemon();
    }, []);
    
    const getPokeData = async (pokemon) => {
        try {
            const response = await axios.get(`${API_URL}/pokemon/${pokemon}`);
            console.log("Data fetched.");
            return response.data;
        } catch (err) {
            console.error("ERROR: Error in fetching data:", err);
        }
    };

    const getPokeDesc = async (id) => {
        try {
            const response = await axios.get(`${API_URL}/pokemon-species/${id}`);
            return response.data;
        } catch (err) {
            console.error("ERROR: Error in fetching description:", err);
        }
    };

    const handleInputChange = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setPokemon(searchTerm);

        const isNumber = !isNaN(searchTerm) && searchTerm.trim() !== '';
        const filteredList = pokemonList.filter((pokemon, index) => {
            const id = (index + 1).toString();
            if (isNumber) {
                return id.startsWith(searchTerm);
            } else {
                return pokemon.name.startsWith(searchTerm);
            }
        });
        setFilteredPokemonList(filteredList);
    };

    const handleSearch = async () => {
        if (!pokemon.trim()) {
            return;
        }
        const data = await getPokeData(pokemon);
        if (data) {
            const pokeDesc = await getPokeDesc(data.id);
            if (pokeDesc) {
                const englishDesc = pokeDesc.flavor_text_entries.find(entry => entry.language.name === 'en');
                data.description = englishDesc
                    ? englishDesc.flavor_text
                        .replace(/&#\d+;/g, '')
                        .replace(/[^\w\s,.!?'-]/g, '')
                        .replace(/\n/g, ' ')
                        .replace(/\u000C/g, ' ')
                        .trim()
                    : "Description not found.";
                setPokeData(data);
            }
        }
    };
    
    const handleRegionChange = async (regionName) => {
        const region = regions[regionName.toLowerCase()];
        if (!region) {
            setFilteredPokemonList(pokemonList);
            return;
        }
        const filteredList = pokemonList.filter((pokemon, index) => {
            const id = index + 1;
            return (id >= region.idStart) && (id <= region.idEnd);
        });
        setFilteredPokemonList(filteredList)
    };
    
    const handlePokeCard = async (pokemon) => {
        const data = await getPokeData(pokemon);
        if (data) {
            const pokeDesc = await getPokeDesc(data.id);
            if (pokeDesc) {
                const englishDesc = pokeDesc.flavor_text_entries.find(entry => entry.language.name === 'en');
                data.description = englishDesc
                    ? englishDesc.flavor_text
                        .replace(/&#\d+;/g, '')
                        .replace(/[^\w\s,.!?'-]/g, '')
                        .replace(/\n/g, ' ')
                        .replace(/\u000C/g, ' ')
                        .trim()
                    : "Description not found.";
                setPokeData(data);
            }
        }
    };

    return (
        <div>
            <Header 
                input={handleInputChange} 
                search={handleSearch}
                region={handleRegionChange}
            />
            {pokeData ? (
                <div>
                    <h2>{pokeData.name.charAt(0).toUpperCase() + pokeData.name.slice(1)}</h2>
                    <img src={pokeData.sprites.front_default} alt={pokeData.name} />
                    <p>Height: {pokeData.height}</p>
                    <p>Weight: {pokeData.weight}</p>
                    <p>Type: {pokeData.types.map(t => t.type.name).join(', ')}</p>
                    <p>Description: {pokeData.description}</p>
                </div>
            ) : (
                <div className="pokemon-grid">
                    {filteredPokemonList.length > 0 ? (
                        filteredPokemonList.map((pokemon, index) => {
                            const regionId = pokemon.url.split('/')[6];
                            return (
                                <div className="pokemon-card" key={index} onClick={() => handlePokeCard(pokemon.name)}>
                                    <p className="id-number">{`#${regionId}`}</p>
                                    <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${regionId}.png`} alt={pokemon.name} />
                                    <span className="pokemon-name">{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</span>
                                </div>
                            );
                        })
                    ) : (
                        <p>No Pokémon found</p>
                    )}
                </div>
            )}
        </div>
    );
}
