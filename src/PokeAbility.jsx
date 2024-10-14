/**
 * Displays properly the abilities of a particular Pokémon.
*/
import PropTypes from 'prop-types';

export default function PokeAbility({ abilities }) {
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

PokeAbility.propTypes = {
    abilities: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            desc: PropTypes.string.isRequired
        })
    ).isRequired
};