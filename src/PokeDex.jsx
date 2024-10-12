import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from "./Header";
import PokeDetails from "./PokeDetails";

export default function PokeDex() {
    const [pokemon, setPokemon] = useState('');
    const [pokemonList, setPokemonList] = useState([]);
    const [filteredPokemonList, setFilteredPokemonList] = useState([]);
    const [activePokeRegion, setActivePokeRegion] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const API_URL = 'https://pokeapi.co/api/v2';
    const navigate = useNavigate();
    const regions = {
        all:    {name: "all", idStart: 1, idEnd: 1025},
        kanto:  {name: "kanto", idStart: 1, idEnd: 151},
        johto:  {name: "johto", idStart: 152, idEnd: 251},
        hoenn:  {name: "hoenn", idStart: 252, idEnd: 386},
        sinnoh: {name: "sinnoh", idStart: 387, idEnd: 493},
        unova:  {name: "unova", idStart: 494, idEnd: 649},
        kalos:  {name: "kalos", idStart: 650, idEnd: 721},
        alola:  {name: "alola", idStart: 722, idEnd: 809},
        galar:  {name: "galar", idStart: 810, idEnd: 905},
        paldea: {name: "paldea", idStart: 906, idEnd: 1025}
    };

    useEffect(() => {
        const fetchAllPokemon = async () => {
            try {
                const response = await axios.get(`${API_URL}/pokemon?limit=1025`);
                setPokemonList(response.data.results);
                setFilteredPokemonList(response.data.results);
            } catch (err) {
                console.error("ERROR: Error in fetching Pokémon list:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllPokemon();
    }, []);

    const handleFilters = (searchTerm, region) => {
        const isNumber = !isNaN(searchTerm) && searchTerm.trim() !== '';
        const filteredList = pokemonList.filter((pokemon, index) => {
            const id = (index + 1).toString();
            const inRegion = !region || (id >= region.idStart && id <= region.idEnd);
            if (isNumber) {
                return inRegion && id.toString().startsWith(searchTerm);
            } else {
                return inRegion && pokemon.name.startsWith(searchTerm);
            }
        });
        setFilteredPokemonList(filteredList);
    }

    const handleInputChange = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setPokemon(searchTerm);
        handleFilters(searchTerm, activePokeRegion);
    };

    const handleSearch = async () => {
        if (!pokemon.trim()) {
            return;
        }
        navigate(`/${pokemon}`);
    };
    
    const handleRegionChange = async (regionName) => {
        const region = regions[regionName.toLowerCase()];
        setActivePokeRegion(region);
        handleFilters(pokemon, region);
    };
    
    const handlePokeCard = async (pokemon) => {
        navigate(`/${pokemon}`);
    };

    return (
        <>
            <Header 
                input={handleInputChange} 
                search={handleSearch}
                region={handleRegionChange}
            />
            <Routes>
                <Route path="/" element=
                    {
                        isLoading ? (
                            // TODO: Change temporary loading screen to rotating Pokéball.
                            <p>Loading...</p>
                        ) : (
                            filteredPokemonList.length > 0 ? (
                                <div className="pokemon-grid">
                                    {
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
                                    }
                                </div>
                            ) : (
                                <p>No Pokémon found.</p>
                            )
                        )
                    }
                />
                <Route path="/:pokemon" element={<PokeDetails />} />
            </Routes>
        </>
    );
}
