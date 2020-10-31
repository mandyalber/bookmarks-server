const express = require('express')
const { v4: uuid } = require('uuid')
const bookmarksRouter = express.Router()
const bodyParser = express.json()
const { isWebUri } = require('valid-url')
const bookmarksService = require('./bookmarks-service')
const logger = require('../logger')

const bookmarks = [{
    id: 0,
    title: 'Google',
    url: 'http://www.google.com',
    description: 'Internet-related services and products.',
    rating: '3',
}]

bookmarksRouter
    .route('/bookmarks')
    .get((req, res, next) => {
        bookmarksService.getAllBookmarks(req.app.get('db'))
            .then(bookmarks => {
                res.json(bookmarks)
            })
            .catch(next)
    })
    .post(bodyParser, (req, res) => {
        //Write a route handler for POST /bookmarks that accepts a JSON object representing a bookmark and adds it to the list of bookmarks after validation.
        console.log(req.body)
        const { title, url, description, rating } = req.body
        const ratingNum = parseInt(rating)

        if (!title) {
            logger.error(`Title is required: ${title}`)
            return res.status(400).send('Title is required')
        }
        if (!url || !isWebUri(url)) {
            logger.error(`Invalid URL: ${url}`)
            return res.status(400).send('A valid URL is required')
        }
        if (!rating || !Number.isInteger(ratingNum) || ratingNum < 0 || rating > 5) {
            logger.error(`invalid rating: ${rating}`)
            return res.status(400).send('A rating of 0 to 5 is required')
        }
        if (!description) {
            logger.error(`Description is required: ${description}`)
            return res.status(400).send('Description is required')
        }

        const id = uuid()
        const bookmark = {
            id,
            title,
            url,
            description,
            rating
        }

        bookmarks.push(bookmark);
        logger.info(`Bookmark with id ${id} created`)

        res.status(201).location(`http://localhost:8000/bookmarks/${id}`).json(bookmark)
    })

bookmarksRouter
    .route('/bookmarks/:id')
    .get((req, res, next) => {
        //Write a route handler for the endpoint GET /bookmarks/:id that returns a single bookmark with the given ID, return 404 Not Found if the ID is not valid
        const { id } = req.params;
        bookmarksService.getById(req.app.get('db'), id)
            .then(bookmark => {
                if (!bookmark) {
                    logger.error(`Bookmark with id ${id} not found.`)
                    return res.status(404).json({
                        error: { message: 'Bookmark Not Found'}
                    })
                }
                res.json(bookmark)
            })
            .catch(next)
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