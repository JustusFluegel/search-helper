import { Search } from './Search';
import React, { useState } from 'react';
import { SortedResults } from './SortedResults';
import { SavedResults } from './SavedResults';
import { Routes, Route, Link } from 'react-router-dom';
import { Login } from './Login';

export function Main() {
  const [sort, setSort] = useState('default');
  const [rawArticles, setRawArticles] = useState();
  const [site, setSite] = useState('google');
  const [seSite, setSeSite] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="main">
        <Link to="/">
          <h1>Search Helper</h1>
        </Link>

        <div className="search">
          <Search
            setRawArticles={setRawArticles}
            sort={sort}
            setSort={setSort}
            site={site}
            setSite={setSite}
            seSite={seSite}
            setSeSite={setSeSite}
          />
          <Routes>
            <Route
              path="/results"
              element={
                <SortedResults
                  rawArticles={rawArticles}
                  sort={sort}
                  site={site}
                  isLoggedIn={isLoggedIn}
                />
              }
            />
            <Route
              path="/saved"
              element={<SavedResults site={site} isLoggedIn={isLoggedIn} />}
            />
          </Routes>
        </div>
      </div>
    </>
  );
}
