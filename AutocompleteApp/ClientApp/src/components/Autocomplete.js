import React, { useState, useEffect } from 'react';

const Autocomplete = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [emptyResult, setEmptyResult] = useState(false);
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!searchTerm.length) {
      setEmptyResult(false);
      setItems([]);
    }
    else {
      fetch("WorldCities?searchTerm=" + searchTerm)
        .then(res => res.json())
        .then(
          (result) => {
            setEmptyResult(searchTerm.length > 0 && result.length == 0);
            setItems(result);
          },
          (error) => {
            setEmptyResult(false);
            setItems([]);

            console.log(error);
          }
        );
    }
  }, [searchTerm]);

  return (
    <div className="d-flex flex-column align-items-center" style={{ marginTop: '20vh' }}>
      <h1>Autocomplete</h1>
      <input type="search"
        className="form-control mt-3 mb-2"
        placeholder="Enter city name..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        onFocus={_ => setIsOpen(true)}
        onBlur={_ => setIsOpen(false)}
      />
      {isOpen &&
        <div>
          <ul>
            {items.length > 0 ?
              items.map((item, index) => (
                <li key={index} onMouseDown={_ => setSearchTerm(item.name)}>
                  {item.name}, {item.country} [{item.subCountry} | {item.geoNameId}]
                </li>
              ))
              : emptyResult && <li>No results found.</li>
            }
          </ul>
        </div>
      }
    </div>
  );
}

export default Autocomplete;