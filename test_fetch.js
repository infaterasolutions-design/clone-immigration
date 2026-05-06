fetch('http://localhost:3000/one-big-beautiful-bill-immigration-fees-visa-rules-enforcement-changes')
  .then(res => res.text())
  .then(text => {
    if (text.includes('"nextArticle":{')) {
      console.log('FOUND NEXT ARTICLE OBJECT');
    } else if (text.includes('"nextArticle":null')) {
      console.log('NEXT ARTICLE IS NULL');
    } else {
      console.log('NOT FOUND AT ALL');
    }
  })
  .catch(err => console.error(err));
