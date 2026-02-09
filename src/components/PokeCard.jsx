import { useEffect, useState } from "react";
// Component
import BouncingPokeball from "./others/BouncingPokeball/BouncingPokeball";
import ToggleShiny from "./others/ToggleShiny/ToggleShiny";
import Modal from "./modal/Modal";
import PokeDetails from "./modal/contents/PokeDetails";
// Service
import { getPokemonData } from "../service/pokeapi.js";
// Utils
import { removeHyphen, capitalize } from "../utils/StringUtils.js";
import { isObjectUndefined } from "../utils/ObjectUtils.js";
// Assets
import Wave1 from '../assets/waves/wave1.svg?react'
import Wave2 from '../assets/waves/wave2.svg?react'
import Wave3 from '../assets/waves/wave3.svg?react'
import Default from '../assets/default.png';
// CSS
import './PokeCard.css';

const PokeCard = ({ name }) => {
  const [pokeData, setPokeData] = useState(null);
  const [isShiny, setIsShiny] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch Pokemon data based on the updated name
    fetchPokemonData();
    // eslint-disable-next-line 
  }, [name]);

  /**
   * Fetches Pokemon data by name and updates the Pokemon data state.
   */
  const fetchPokemonData = async () => {
    try {
        // Set loading state to indicate data fetching
        setLoading(true);

        // Fetch Pokemon data from the API based on the provided name
        const apiData = await getPokemonData(name);
        setPokeData(apiData);
        
        setTimeout(function() {
          // Turn off loading state and set visibility state after a delay
          setLoading(false);

          setIsVisible(true);
          // Set visibility to false after another delay to remove visibility effect
          setTimeout(() => {
            setIsVisible(false);
          }, 600);
        }, 1200);

    } catch (error) {
      // Handle errors by logging to the console
        console.error("fetchPokemonData: err: " + error);
    }
  }

  /**
   * Determines the CSS class for applying a flashing effect based on visibility state.
   *
   * @returns {string} The CSS class for the flashing effect or an empty string.
   */
  const setFlash = () => isVisible ? 'flash' : '';
  
  /**
   * Retrieves the URL of the Pokemon image based on the shiny state.
   *
   * @returns {string|null} The URL of the Pokemon image or null if pokeData is undefined.
   */
  const getPokemonImage = () => isShiny ? pokeData?.artwork.shiny.front : pokeData?.artwork.default.front;

  /**
   * Retrieves the background color for the Pokemon display based on pokeData.
   *
   * @returns {string} The background color or 'default' if pokeData is undefined.
   */
  const getBackgroundColor = () => pokeData ? pokeData?.color : 'default';

  /**
   * Calculates the adjusted height for a Pokemon.
   *
   * @param {number} height - The original height of the Pokemon.
   * @returns {number} The adjusted height after adding 250 units.
   */
  const getPokemonHeight = (height) => height + 250;

  return (
    <>
    <div 
      key={name} 
      className={`card bg-${getBackgroundColor()} ${setFlash()}`}
      onClick={() => setIsModalOpen(isObjectUndefined(pokeData))}
    >
      { !loading ? (
          <>
            {pokeData?.hasShinyVer && (
              <ToggleShiny 
                showShiny={isShiny} 
                setShowShiny={(value) => setIsShiny(value)} 
              />
            )}
            <p className={`id ${isObjectUndefined(pokeData) ? '' : 'undefined' }`}>{`#${pokeData?.id || 'N/A'}`}</p>
            <p className={`name-en ${isObjectUndefined(pokeData) ? '' : 'undefined' }`}>{capitalize(removeHyphen(name))}</p>
            <p className={`region ${isObjectUndefined(pokeData) ? '' : 'undefined' }`}>{`Region: ${capitalize(pokeData?.region)}`}</p>
            <p className={`height ${isObjectUndefined(pokeData) ? '' : 'undefined' }`}>{`Height: ${pokeData?.height || 'N/A'}`}</p>
            <p className={`weight ${isObjectUndefined(pokeData) ? '' : 'undefined' }`}>{`Weight: ${pokeData?.weight || 'N/A'}`}</p>
            {pokeData ? (
              <img 
                src={getPokemonImage() ? getPokemonImage() : Default} 
                alt={`${pokeData?.id}-${pokeData?.name.en}-sprite`} 
                style={{height: getPokemonHeight(pokeData?.height)}}
              />
            ) : (
              <img 
                src={Default} 
                alt={`unavailable-pokemon-sprite`} 
                style={{height: 200}}
              />
            )}
            <p className="name-jp">{pokeData?.name.jp}</p>
          </>
      ) : (
        <BouncingPokeball />
      )}
    </div>

    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>

      <PokeDetails pokeData={pokeData} colorScheme={getBackgroundColor()}/>
      <div className="waves">
        <Wave1 className={`wave1 c-${getBackgroundColor()}`}/>
        <Wave2 className={`wave2 c-${getBackgroundColor()}`}/>
        <Wave3 className={`wave3 c-${getBackgroundColor()}`}/>
        <div className={`bottom bg-${getBackgroundColor()}`}></div>
      </div>

    </Modal>
    
    </>
  );
}

export default PokeCard;