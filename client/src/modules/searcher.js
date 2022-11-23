/**
 * @instance A SearchQuery with key terms, ignored words, required words, and tags.
 */
class SearchQuery {
  terms = [''];
  ignore = [''];
  require = [''];
  tags = [''];
}

const SEAPI = 'https://api.stackexchange.com/2.3/search/advanced';
const GoogleAPI = 'https://customsearch.googleapis.com/customsearch/v1';

/**
 * A class containing methods to search a source.
 */
export class Searcher {
  /**
   * Given a search query containing terms and operators/operands,
   * returns a SearchQuery object.
   * @param {string} search The search query as a string.
   * @returns {SearchQuery} The query as a SearchQuery object.
   * @operators '--', '!-', 't-'
   * @example
   * Given: 'how to play piano --practice !-easy t-fast'
   * -> terms = ['how', 'to', 'play', 'piano']
   * -> ignore = ['practice']
   * -> require = ['easy']
   * -> tags = ['fast']
   */
  toSearchQuery(search) {
    if (typeof search != 'string') {
      throw new Error('Search is not a string.');
    }
    const sq = new SearchQuery();
    sq.ignore = findOperands(search, '--'); // Find ignores
    sq.require = findOperands(search, '!-'); // Find requires
    sq.tags = findOperands(search, 't-'); // Find requires
    // Find the rest
    let terms = search;
    sq.ignore.concat(sq.require).forEach((word) => {
      terms = terms.replace(word, '');
    });
    terms =
      ' ' +
      terms
        .replaceAll('--', '')
        .replaceAll('!-', '')
        .replaceAll('t-', '')
        .replace(/\s+/g, ' ')
        .trim();
    sq.terms = findOperands(terms, ' ');
    return sq;
  }

  /**
   * Takes a SearchQuery instance and returns a list of relevant articles from Stack Exchange.
   * @async
   * @param {string} site The site property in the SE API call.
   * @param {SearchQuery} query The SearchQuery.
   * @returns {Promise<{title, link, id}[]>} An array of {title, link, id} objects.
   */
  async searchStackExchange(site, query) {
    if (!(query instanceof SearchQuery)) {
      throw new Error('Query is not a SearchQuery.');
    }
    let reqURL = SEAPI;
    reqURL += '?pagesize=30&order=desc&sort=relevance';
    if (query.terms.length > 0) {
      reqURL += `&q=${query.terms.join('%20')}`;
    }
    if (query.require.length > 0) {
      reqURL += `&body=${query.require.join('%20')}`;
    }
    if (site) {
      reqURL += `&site=${site}`;
    }

    console.log('Request: ' + reqURL);
    let articles;
    try {
      const response = await fetch(reqURL);
      const body = await response.json();
      let items = body.items;
      console.log();
      articles = [];
      items.forEach((item) => {
        articles.push({
          title: item.title,
          link: item.link,
          id: item.question_id,
        });
      });
    } catch (Error) {
      articles = [
        {
          title: 'StackExchange search count limit reached',
          link: '',
          id: '-1',
        },
      ];
    } finally {
      return articles;
    }
  }

  /**
   * Takes a SearchQuery instance and returns a list of relevant search results from Google.
   * @async
   * @param {SearchQuery} query The SearchQuery.
   * @returns {Promise<{title, link, id}[]>} An array of {title, link, id} objects.
   */
  async searchGoogle(query) {
    if (!(query instanceof SearchQuery)) {
      throw new Error('Query is not a SearchQuery.');
    }
    let reqURL = GoogleAPI;
    reqURL +=
      '?key=AIzaSyCMCksg_d6ca9srsVFNrBUzA1wbkLsfyRs&cx=33f51b3ea70b34663';
    if (query.terms.length > 0) {
      reqURL += `&q=${query.terms.join('%20')}`;
    }
    if (query.require.length > 0) {
      reqURL += `&exactTerms=${query.require.join('%20')}`;
    }
    if (query.ignore.length > 0) {
      reqURL += `&excludeTerms=${query.ignore.join('%20')}`;
    }

    console.log('Request: ' + reqURL);
    let articles;
    try {
      const response = await fetch(reqURL);
      const body = await response.json();
      let items = body.items;
      console.log();
      articles = [];
      items.forEach((item) => {
        articles.push({ title: item.title, link: item.link, id: item.cacheId });
      });
    } catch (Error) {
      articles = [
        { title: 'Google search count limit reached', link: '', id: '-1' },
      ];
    } finally {
      return articles;
    }
  }
}

/**
 * Finds operands in a string denoted by (operator)(operand).
 * @param {string} string The full string to search.
 * @param {string} operator The operator to check for (e.g. --, !-, t-).
 * @returns {string[]} An array of found operands.
 *
 * @example
 * var prompt = 'how to --good learn chinese --happy --expensive';
 * findOperands(prompt, '-');
 * -> ['good', 'happy', 'expensive']
 */
function findOperands(string, operator) {
  const operands = [];
  let index = string.indexOf(operator, 0);
  while (index !== -1) {
    let spaceIndex = string.indexOf(' ', index + 1);
    if (spaceIndex === -1) {
      spaceIndex = string.length;
    }
    operands.push(string.slice(index + 1, spaceIndex));
    index = string.indexOf(operator, index + 1);
  }
  return operands;
}
