/**
 * Displays properly the evolution lineup of a particular Pokémon.
*/
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
                                )
                            }
                        </React.Fragment>
                    ))
                }
            </div>
        </div>
    );
};

PokeEvolution.propTypes = {
    evolutionLine: PropTypes.arrayOf(PropTypes.string).isRequired,
    evolutionSprites: PropTypes.arrayOf(PropTypes.string).isRequired,
    onEvolutionClick: PropTypes.func.isRequired
}