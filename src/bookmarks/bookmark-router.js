const express = require('express')
const { v4: uuid } = require('uuid')
const bookmarksRouter = express.Router()
const bodyParser = express.json()
const { isWebUri } = require('valid-url')
const logger = require('../logger')

const bookmarks = [{
    id: 0,
    title: 'Google',
    url: 'http://www.google.com',
    rating: '3',
    desc: 'Internet-related services and products.'
}]

bookmarksRouter
    .route('/bookmarks')
    .get((req, res) => {
        //Write a route handler for the endpoint GET /bookmarks that returns a list of bookmarks
        res.json(bookmarks)
    })
    .post(bodyParser, (req, res) => {
        //Write a route handler for POST /bookmarks that accepts a JSON object representing a bookmark and adds it to the list of bookmarks after validation.
        const { title, url, rating, desc } = req.body

        if (!title) {
            logger.error(`Title is required: ${title}`)
            return res.status(400).send('Title is required')
        }
        if (!url || !isWebUri(url)) {
            logger.error(`Invalid URL: ${url}`)
            return res.status(400).send('A valid URL is required')
        }
        if (!rating || !Number.isInteger(rating) || rating < 0 || rating > 5){
            logger.error(`invalid rating: ${rating}`)
            return res.status(400).send('A rating of 0 to 5 is required')
        }
        
        const id = uuid()
        const bookmark = {
            id,
            title,
            url,
            rating,
            desc
        }

        bookmarks.push(bookmark);
        logger.info(`Bookmark with id ${id} created`)

        res.status(201).location(`http://localhost:8000/bookmarks/${id}`).json(bookmark)
    })

bookmarksRouter
    .route('/bookmarks/:id')
    .get((req, res) => {
        //Write a route handler for the endpoint GET /bookmarks/:id that returns a single bookmark with the given ID, return 404 Not Found if the ID is not valid
        const { id } = req.params;
        const bookmark = bookmarks.find(b => b.id == id)

        if (!bookmark) {
            logger.error(`Bookmark with id ${id} not found.`)
            return res.status(404).send('Bookmark Not Found')
        }

        res.json(bookmark) 
    })
    .delete((req, res) => {
        //Write a route handler for the endpoint DELETE /bookmarks/:id that deletes the bookmark with the given ID.
        const { id } = req.params

        const bookmarkIndex = bookmarks.findIndex(b => b.id == id)

        if (bookmarkIndex === -1) {
            logger.error(`Bookmark with id ${id} not found.`)
            return res.status(404).send('Bookmark Not found')
        }

        bookmarks.splice(bookmarkIndex, 1)

        logger.info(`Bookmark with id ${id} deleted.`)

        res.status(204).end()
    })

module.exports = bookmarksRouter