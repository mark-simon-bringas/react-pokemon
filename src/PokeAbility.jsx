import React from "react";

const PokeAbility = ({ abilities }) => {
    return (
        <div className="abilities-wrapper">
            <p className="caption-fonts">Abilities</p>
            <div className="ability-list">
                {abilities.map((ability, index) => (
                    <div className="ability" key={index}>
                        <h4 className="body3-fonts">{ability.name.up}</h4>
                        <p className="body3-fonts">{ability.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PokeAbility;
