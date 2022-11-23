import './App.css';
import { Search } from './Search';
import React, { useState } from 'react';
import { SortedResults } from './SortedResults';
import { SavedResults } from './SavedResults';
import { Routes, Route, json } from 'react-router-dom';

function App() {
  const [sort, setSort] = useState('default');
  const [rawArticles, setRawArticles] = useState();
  const [site, setSite] = useState('google');

  return (
    <div className="App">
      <a href="/">
        <h1>Search Helper</h1>
      </a>
      <div className="search">
        <Search
          setRawArticles={setRawArticles}
          setSort={setSort}
          sort={sort}
          setSite={setSite}
          site={site}
        />
        <Routes>
          <Route
            path="/results"
            element={
              <SortedResults
                rawArticles={rawArticles}
                sort={sort}
                site={site}
              />
            }
          />
          <Route path="/saved" element={<SavedResults />} />
        </Routes>
      </div>
      <button
        onClick={async () => {
          await fetch('http://localhost:3001/api/createUser', {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: 'Winston',
            }),
          })
            .then((res) => res.json())
            .then((response) => console.log(response));
          // console.log(res);
        }}
      >
        CLICK ME
      </button>
    </div>
  );
}

export default App;
