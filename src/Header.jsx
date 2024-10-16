import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Filters from "./Filters";
import pokeballImage from './assets/pokeball.svg'; // Ensure the correct path to your image
import backgroundMusic from './assets/bg-music.mp3'; // Add your background music file
import clickSound from './assets/emerald_0005.wav'; // Use your click sound file

export default function Header({ input, search, region }) {
    const audioRef = useRef(null);
    const clickAudioRef = useRef(null); // Reference for click sound
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayMusic = () => {
        const audio = audioRef.current;
        if (audio && !isPlaying) {
            audio.volume = 0.2;
            audio.play().catch(error => console.error('Music autoplay prevented:', error));
            setIsPlaying(true); // Update the state to track the audio is playing
        }
    };

    const playClickSound = () => {
        const clickAudio = clickAudioRef.current;
        if (clickAudio) {
            clickAudio.currentTime = 0; // Reset to start
            clickAudio.volume = 1; // Adjust volume as needed
            clickAudio.play().catch(error => console.error('Click sound playback failed:', error));
        }
    };

    useEffect(() => {
        // Play music after interaction (i.e., user clicks or presses a button)
        window.addEventListener('click', handlePlayMusic);

        return () => {
            window.removeEventListener('click', handlePlayMusic); // Clean up listener
        };
    }, []);

    return (
        <header className="header">
            {/* Branding and Home link */}
            <div className="logo">
                <Link to="/" style={{ textDecoration: 'none' }} className="logo-container" onClick={playClickSound}>
                    <img src={pokeballImage} alt="PokéBall" className="logo clickable-image" />
                    <h1 title="PokéDex | Home" className="pokedex-title">PokéDex</h1>
                </Link>
            </div>
            
            {/* Search bar */}
            <div className="search-bar">
                <input 
                    type="text" 
                    placeholder="Search Pokémon" 
                    title="Search Pokémon"
                    className="input-bar"
                    onChange={input}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            search();
                            playClickSound(); // Play click sound on Enter key
                        }
                    }}
                />
                <button 
                    title="Search" 
                    className="search-button"
                    onClick={() => {
                        search();
                        playClickSound(); // Play click sound on button click
                    }}
                >
                    <img src="src\assets\search.svg" alt="" />
                </button>
                <Filters onRegionChange={region}  />
            </div>

            {/* Background Music */}
            <audio ref={audioRef} src={backgroundMusic} loop />
            <audio ref={clickAudioRef} src={clickSound} /> {/* Click sound audio */}
        </header>
    );
}

// PropTypes for the Header component
Header.propTypes = {
    input: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    region: PropTypes.func.isRequired,
};
