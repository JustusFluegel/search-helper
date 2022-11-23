import React, { useState } from 'react';
import { Searcher } from './modules/searcher.js';
import { Settings } from './Settings.jsx';
import { useNavigate } from 'react-router-dom';

const searcher = new Searcher('languagelearning');

export function Search(props) {
  const navigate = useNavigate();

  const [question, setQuestion] = useState('');
  let site = props.site;
  let sort = props.sort;

  const updateResults = async () => {
    if (!question) {
      return <div>No question given.</div>;
    } //'how to --good learn chinese !-happy --expensive';
    //debugger;
    let sq = searcher.toSearchQuery(question);
    console.log(sq);
    console.log(site);
    switch (site) {
      case 'stackexchange':
        props.setRawArticles(
          await searcher.searchStackExchange('languagelearning', sq, sort)
        );
        break;
      case 'google':
        props.setRawArticles(await searcher.searchGoogle(sq, sort));
        break;
      default:
        props.setRawArticles([
          { title: 'dummytitle', link: 'dummylink', id: 'dummyid' },
        ]);
    }
    // console.table(rawArticles);
  };

  const handleSiteChange = (newSite) => {
    props.setSite(newSite);
    site = newSite;
    console.log(newSite);
    updateResults();
  };

  const handleSortChange = (newSort) => {
    props.setSort(newSort);
    sort = newSort;
    console.log(newSort);
    updateResults();
  };

  return (
    <>
      <Settings
        site={site}
        setSite={handleSiteChange}
        setSort={handleSortChange}
      />
      <form
        className="search-bar"
        onSubmit={(event) => {
          updateResults();
          event.preventDefault();
          navigate('/results');
        }}
      >
        <label>
          <input
            className="search-bar-input"
            type="text"
            value={question}
            placeholder="Enter a question or search terms..."
            onChange={(event) => {
              setQuestion(event.target.value);
            }}
          />
        </label>
        <input className="search-bar-submit" type="submit" value="Search" />
      </form>
    </>
  );
}
