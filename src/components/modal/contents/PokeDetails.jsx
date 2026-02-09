// Util
import { calculatePercentage } from '../../../utils/IntUtils';
import { getStatLabel, getMaxStat } from '../../../utils/OtherUtils';
// Components
import ProgressBar from '../../others/ProgressBar/ProgressBar';
// Utilities
import { capitalize, extractRomanNumerals } from '../../../utils/StringUtils';
// Assets
import External from '../../../assets/icons/external.svg?react'
// CSS
import './PokeDetails.css';

// Load type icons as URLs using Vite's glob import (eager) so we don't use `require` in the browser
const typeIcons = import.meta.glob('/src/assets/poke-types/*.ico', { eager: true, as: 'url' });

function getTypeIcon(name) {
  const key = Object.keys(typeIcons).find(k => k.endsWith(`/${name}.ico`));
  return key ? typeIcons[key] : null;
}

/**
 * PokeDetails component for displaying detailed information about a Pokemon.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.pokeData - Data containing information about the Pokemon.
 * @param {string} props.colorScheme - The color scheme to be applied.
 * @returns {JSX.Element} The PokeDetails component.
 */
const PokeDetails = ({ pokeData, colorScheme }) => {
  
  return (
    <>
      <div className={`content bb-${colorScheme}`}>
        <div className='visual'>
          <p className={`id c-${colorScheme}`}>
            #{pokeData.id < 10 ? `00${pokeData.id}` : pokeData.id < 100 ? `0${pokeData.id}` : pokeData.id}
          </p>
          <div>
            <img src={pokeData.artwork.default.front} alt={`${pokeData.name.en}-official-artwork`} />
          </div>
          <p className='name-en'>{capitalize(pokeData.name.en)}</p>
          <p className='name-jp'>{pokeData.name.jp}</p>
        </div>
        <div className='information'>
          <div className='desc'>
            <h2>DESCRIPTION</h2>
            <p>
              {pokeData.pokedex_entry}
            <a 
                className={`c-${colorScheme}`} 
                href={`https://www.pokemon.com/us/pokedex/${pokeData.name.en}`} 
                target='_blank' 
                rel="noreferrer"> 
                <External className={`c-${colorScheme}`} /> 
              </a>
            </p>
          </div>
          <PokeChar data={pokeData} colorScheme={colorScheme} />
          <PokeStats stats={pokeData.stats} colorScheme={colorScheme} />
        </div>
      </div>
    </>
  );
};

function PokeChar({data, colorScheme}) {
  return (
    <div className='char'>
      <h2>CHARACTERISTICS</h2>
      <div className='container'>
        <div className='details'>
          <div className='type'>
            <h3>Type(s):</h3>
            {data.types.map(({ type }) => { 
              const src = getTypeIcon(type.name);
              return <img key={type.name} src={src} alt={type.name}/>; 
            })}
          </div>

          <div className='height'>
            <h3>Height:</h3>
            <p>{Math.round(data.height * 0.328084)} ft</p>
          </div>

          <div className='weight'>
            <h3>Weight:</h3>
            <p>{Math.round(data.weight* 0.220462262)} lbs</p>
          </div>
        </div>

        <div className='ability'>
          <h3>Abilities:</h3>
          {data.abilities.map(({ ability, slot }) => {
            return <p key={ability.name}>
              <span>Slot {slot}: </span>
              <span className={`c-${colorScheme}`}>
                {capitalize(ability.name)}
              </span>
            </p>;
          })}
        </div>

        <div className='evolution'>
          {data?.evolution.length > 1 &&
            <>
              <h3>Evolution:</h3>
              <div className='wrapper'>
                {data?.evolution.map(( item ) => {
                  return data.name.en !== item.name.en && 
                    <img key={item.name.en} 
                      src={item.artwork.default.front}
                      alt={`evolution-${item.name}`}
                    />; 
                })}
              </div>
            </>
          }
        </div>

        <div className='others'>
          <p>Region: <span>{capitalize(data.region)}</span></p>
          <p>Generation: <span>{extractRomanNumerals(data.generation)}</span></p>
        </div>
      </div>
    </div>
  );
}

function PokeStats({stats, colorScheme}) {
  return (
    <div className='stat'>
      <h2>STATISTICS</h2>
      <div className='container'>
        {stats.map(({ stat, base_stat }) => {
          return (
            <div key={stat.name} style={{ 'marginTop': '0.5rem' }}>
              <span style={{ 'width': '10%' }}>
                {getStatLabel(stat.name)}
              </span>
              
              <ProgressBar percentage={calculatePercentage(base_stat, getMaxStat(stat.name))} color={`bg-${colorScheme}`} />

              <span style={{ 'width': '10%', 'textAlign': 'center' }}>
                {base_stat}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PokeDetails;
