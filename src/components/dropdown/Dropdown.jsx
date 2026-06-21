import React, { useState } from 'react';
import './Dropdown.css';

/**
 * Dropdown component for displaying a list of options.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.header - The header text for the dropdown.
 * @param {string[]} props.options - An array of available options.
 * @param {string} props.selectedOption - The currently selected option.
 * @param {Function} props.onSelect - Callback function for option selection.
 * @returns {JSX.Element} The dropdown component.
 */
const Dropdown = ({ header, options, selectedOption, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    /**
     * Handles the selection of an option by invoking the onSelect callback and toggling the dropdown.
     *
     * @param {string} option - The selected option.
     */
    const handleOptionSelect = (option) => {
        // Invoke the onSelect callback with the selected option
        onSelect(option);

        // Toggle the dropdown
        toggleDropdown();
    }
    
    /**
     * Toggles the dropdown's open/closed state.
     */
    const toggleDropdown = () => setIsOpen(!isOpen);
    
    return (
        <div className='dropdown' onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
            <div className='header'>
                {selectedOption ? selectedOption.name : header}
                 <i className={`arrow ${isOpen ? 'up' : 'down'}`} />
            </div>
            {isOpen && (
                <ul className="options">
                    {options.map(({name, value}) => (
                        <li
                            key={name}
                            className={`option ${value === selectedOption?.value ? 'selected' : ''}`}
                            onClick={() => handleOptionSelect(value === selectedOption?.value ? '' : {name, value})}
                        >
                        {name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )

}

export default Dropdown;