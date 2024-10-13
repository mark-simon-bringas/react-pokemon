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
                                )
                            }
                        </React.Fragment>
                    ))
                }
            </div>
        </>
    )
}

PokeEvolution.propTypes = {
    evolutionLine: PropTypes.arrayOf(PropTypes.string).isRequired,
    evolutionSprites: PropTypes.arrayOf(PropTypes.string).isRequired,
    onEvolutionClick: PropTypes.func.isRequired
}
