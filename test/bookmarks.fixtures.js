function makeBookmarksArray() {
    return [
        {
            id: 1,
            title: 'First test post!',
            url: 'http://www.one.com',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
            rating: '5'
        },
        {
            id: 2,
            title: 'Second test post!',
            url: 'http://www.two.com',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. ',
            rating: '4'
        },
        {
            id: 3,
            title: 'Third test post!',
            url: 'http://www.three.com',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
            rating: '3'
        },
        {
            id: 4,
            title: 'Fourth test post!',
            url: 'http://www.four.com',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. ',
            rating: '2'
        },
    ];
}

function makeMaliciousBookmark() {
    const maliciousBookmark = {
      id: 911,
      url: 'http://somenonsense.com',
      title: 'Naughty naughty very naughty <script>alert("xss");</script>',
      description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
      rating: '4'
    }
    const expectedBookmark = {
      ...maliciousBookmark,
      title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
    }
    return {
      maliciousBookmark,
      expectedBookmark,
    }
  }

module.exports = {
    makeBookmarksArray,
    makeMaliciousBookmark,
}