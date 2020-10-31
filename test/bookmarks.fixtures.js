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

module.exports = {
    makeBookmarksArray,
}