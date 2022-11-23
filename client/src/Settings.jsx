import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';

export function Settings(props) {
  // Website picker
  // Sort options
  const [isOpen, setIsOpen] = useState(false);
  const [iconClass, setIconClass] = useState('settings-icon');
  const [optionsClass, setOptionsClass] = useState('options');

  const changeSite = (event) => {
    console.log('site: ' + event.target.value);
    props.setSite(event.target.value);
  };

  const changeSort = (event) => {
    console.log('sort: ' + event.target.value);
    props.setSort(event.target.value);
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
    isOpen
      ? setIconClass('settings-icon rotate120')
      : setIconClass('settings-icon');
    isOpen ? setOptionsClass('options slide-in') : setOptionsClass('options');
  };

  return (
    <div className="settings">
      <div className={optionsClass}>
        <div className="pick-site">
          <p>Site</p>
          <select onChange={changeSite}>
            <option value="google">Google</option>
            <option value="stackexchange">Stack Exchange</option>
          </select>
        </div>
        <div className="pick-sort">
          <p>Sort By</p>
          <select onChange={changeSort}>
            <option value="Date">Date</option>
            <option value="Relevancy">Relevancy</option>
          </select>
        </div>
      </div>
      <div className="icon">
        <FontAwesomeIcon
          icon={faGear}
          className={iconClass}
          onClick={handleClick}
        />
      </div>
    </div>
  );
}
