/**
 * Displays properly the evolution lineup of a particular Pokémon.
*/
<<<<<<< HEAD
import React from "react";
import PropTypes from 'prop-types';

export default function PokeEvolution({ evolutionLine, evolutionSprites }) {
    const evolutions = evolutionLine.split(' → ');
    
    return (
        <div className="evolution-wrapper">
            <p className="caption-fonts">Evolution</p>
            <div className="evolution-list">
                {
                    evolutions.map((name, index) => (
                        <React.Fragment key={index}>
                            <div className="evolution-item">
                                <img 
                                    className="pokemon-evolution-sprite" 
                                    src={evolutionSprites[index]} 
                                    alt={name} 
                                />
                                <p className="body-evoname">{name}</p>
                            </div>
                            {/* Render arrow only if this is not the last evolution */}
                            {
                                index < evolutions.length - 1 && (
                                    <div className="evolution-arrow">→</div>
=======
import React from 'react';
import PropTypes from 'prop-types';

export default function PokeEvolution({ evolutionLine, evolutionSprites, onEvolutionClick }) {
    return (
        <>
            <p>Evolution Line:</p>
            <div className="pokemon-evolution-line">
                {
                    evolutionLine.map((name, index) => (
                        <React.Fragment key={name}>
                        <div className="pokemon-evolution-item" onClick={() => onEvolutionClick(name)}>
                            <img 
                                src={evolutionSprites[index]}
                                alt={name} 
                                title={name.charAt(0).toUpperCase() + name.slice(1)}
                                className="pokemon-evolution-sprite"
                            />
                            <span className='pokemon-evolution-name'>
                                {name.charAt(0).toUpperCase() + name.slice(1)}
                            </span>
                        </div>
                            {
                                index < evolutionLine.length - 1 && (
                                    <span className="pokemon-evolution-arrow">
                                        →
                                    </span>
>>>>>>> main
                                )
                            }
                        </React.Fragment>
                    ))
                }
            </div>
<<<<<<< HEAD
        </div>
    );
};
=======
        </>
    )
}
>>>>>>> main

PokeEvolution.propTypes = {
    evolutionLine: PropTypes.arrayOf(PropTypes.string).isRequired,
    evolutionSprites: PropTypes.arrayOf(PropTypes.string).isRequired,
    onEvolutionClick: PropTypes.func.isRequired
<<<<<<< HEAD
}
=======
}
>>>>>>> main
