import React, { useCallback, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarReg } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';
import { addLink, readUser, remLink } from './modules/useEndpoints';
import { getIdCookie, isLoggedIn } from './modules/cookieHandler';
import { useEffect } from 'react';

export function SortedResults(props) {
  const navigate = useNavigate();
  const [googleLinks, setGoogleLinks] = useState([]);
  const [seLinks, setSeLinks] = useState([]);

  const setStarredArrays = useCallback(async () => {
    if (props.isLoggedIn) {
      await readUser(getIdCookie()).then((res) =>
        res.json().then((res) => {
          setGoogleLinks(res.saved.google);
        })
      );
      await readUser(getIdCookie()).then((res) =>
        res.json().then((res) => {
          setSeLinks(res.saved.se);
        })
      );
    } else {
      setGoogleLinks([]);
      setSeLinks([]);
    }
  }, [props.isLoggedIn]);

  useEffect(() => {
    setStarredArrays();
  }, [setStarredArrays]);

  // Sort
  const results = props.rawArticles || [];
  if (results && results.length > 0) {
    switch (props.sort) {
      case 'date':
        // sort raw by date, mutating raw
        //raw.forEach();
        break;
      case 'relevancy':
        console.log('relevancy');
        break;
      case 'starred':
        // When sorting by starred, check in the right list
        switch (props.site) {
          case 'google':
            results.sort((a, b) => {
              if (googleLinks.some((item) => item.link === a.link)) {
                return -1;
              } else if (googleLinks.some((item) => item.link === b.link)) {
                return 1;
              }
              return 0;
            });
            break;
          case 'se':
            results.sort((a, b) => {
              if (seLinks.some((item) => item.link === a.link)) {
                return -1;
              } else if (seLinks.some((item) => item.link === b.link)) {
                return 1;
              }
              return 0;
            });
            break;
          default:
            console.error('Unknown Site');
        }
        break;
      default:
        console.log('default sort');
    }
    // console.table(results);
  }

  /**
   * Checks a link in the correct database if it is starred or not.
   * @param {String} link The link to find.
   * @param {String} site The site to check.
   * @returns A FontAwesome star icon, either a filled in or regular star if starred or not.
   */
  const checkStarred = (site, title, link) => {
    switch (site) {
      case 'google':
        if (googleLinks.some((item) => item.link === link)) {
          return (
            <button onClick={() => remFav(site, title, link)}>
              <FontAwesomeIcon icon={faStarSolid} />
            </button>
          );
        } else {
          return (
            <button onClick={() => addFav(site, title, link)}>
              <FontAwesomeIcon icon={faStarReg} />
            </button>
          );
        }
      case 'se':
        if (seLinks.some((item) => item.link === link)) {
          return (
            <button onClick={() => remFav(site, title, link)}>
              <FontAwesomeIcon icon={faStarSolid} />
            </button>
          );
        } else {
          return (
            <button onClick={() => addFav(site, title, link)}>
              <FontAwesomeIcon icon={faStarReg} />
            </button>
          );
        }
      default:
        return (
          <button onClick={() => addFav(link, site)}>
            <FontAwesomeIcon icon={faStarReg} />
          </button>
        );
    }
  };

  const addFav = async (site, title, link) => {
    if (isLoggedIn()) {
      await addLink(getIdCookie(), site, title, link);
      console.log(`Added link: ${link}`);
      setStarredArrays();
    } else {
      alert('You must be signed in to save search results!');
    }
  };
  const remFav = async (site, title, link) => {
    if (isLoggedIn()) {
      await remLink(getIdCookie(), site, title, link);
      console.log(`Removed link: ${link}`);
      setStarredArrays();
    }
  };

  let resultsList;
  resultsList = results.map((item) => {
    // using default props.sort
    // sort articles and set resultsList
    return (
      <li key={item.id}>
        <a href={item.link} target="_blank" rel="nooperner noreferrer">
          {item.title}
        </a>
        {checkStarred(props.site, item.title, item.link)}
      </li>
    );
  });

  return (
    <div className="articles">
      <div className="options">
        <button
          onClick={() => {
            navigate('/results');
          }}
        >
          <h3>Results</h3>
        </button>
        <button
          onClick={() => {
            if (isLoggedIn()) {
              navigate('/saved');
            } else {
              alert('You must be signed in to see saved searches!');
            }
          }}
        >
          <h3>Saved</h3>
        </button>
      </div>
      <ul>{resultsList}</ul>
    </div>
  );
}
