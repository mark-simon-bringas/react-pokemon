import React from "react";

const PokeEvolution = ({ evolutionLine, evolutionSprites }) => {
    const evolutions = evolutionLine.split(' → ');

    return (
        <div className="evolution-wrapper">
            <p className="caption-fonts">Evolution</p>
            <div className="evolution-list">
                {evolutions.map((name, index) => (
                    <React.Fragment key={index}>
                        <div className="evolution-item">
                            <img className="pokemon-evolution-sprite" src={evolutionSprites[index]} alt={name} />
                            <p className="body-evoname">{name}</p>
                        </div>
                        {/* Render arrow only if this is not the last evolution */}
                        {index < evolutions.length - 1 && (
                            <div className="evolution-arrow">→</div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default PokeEvolution;
