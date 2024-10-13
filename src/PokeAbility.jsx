/**
 * Displays properly the abilities of a particular Pokémon.
*/
import PropTypes from 'prop-types';

export default function PokeAbility({ abilities }) {
    return (
        <>
            <div className="pokemon-ability">
                <p>Abilities:</p>
                {
                    abilities.map(({name, desc}) => (
                        <div key={name} className="pokemon-ability-item">
                            <strong>{name}:</strong> {desc}
                        </div>
                    ))
                }
            </div>
        </>
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
