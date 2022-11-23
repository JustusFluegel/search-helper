import parse from 'html-react-parser';

export function SortedResults(props) {
  // Sort
  let results = [];
  const raw = props.rawArticles;
  if (raw && raw.length > 0) {
    //debugger;
    switch (props.sort) {
      case 'date':
        // sort raw by date, mutating raw
        //raw.forEach();
        break;
      case 'relevant':
        break;
      default:
        console.log('default sort');
    }
    results = raw;
    console.table(results);
  }

  const resultsList = results.map((item) => {
    // using props.sort -- default
    // sort articles and set resultsList
    console.log(item);
    return (
      <li key={item.id}>
        <a href={item.link} target="_blank" rel="nooperner noreferrer">
          {parse(item.title)}
        </a>
      </li>
    );
  });

  return (
    <div className="articles">
      <h3>Results</h3>
      <ul>{resultsList}</ul>
    </div>
  );
}
