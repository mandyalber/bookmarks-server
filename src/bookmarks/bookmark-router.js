const express = require('express')
const bookmarksRouter = express.Router()
const jsonParser = express.json()
const xss = require('xss')
const { isWebUri } = require('valid-url')
const bookmarksService = require('./bookmarks-service')
const logger = require('../logger')
const path = require('path')

const serializeBookmark = bookmark => ({
    id: bookmark.id,
    title: xss(bookmark.title),
    url: xss(bookmark.url),
    description: xss(bookmark.description),
    rating: bookmark.rating,
})

bookmarksRouter
    .route('/')
    .get((req, res, next) => {
        //Refactor your GET methods and tests to ensure that all bookmarks get sanitized.
        bookmarksService.getAllBookmarks(req.app.get('db'))
            .then(bookmarks => {
                res.json(bookmarks.map(serializeBookmark))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        /*Refactor your POST handler to support inserting bookmarks into the database.
        If your POST endpoint responds with the newly created bookmark, make sure that appropriate fields get sanitized.*/
        console.log(req.body)
        const { title, url, description, rating } = req.body
        const newBookmark = { title, url, description, rating }
        const ratingNum = parseInt(rating)

        for (const [key, value] of Object.entries(newBookmark))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
        if (!isWebUri(url)) {
            logger.error(`Invalid URL: ${url}`)
            return res.status(400).send({ error: { message :'A valid URL is required'}})
        }
        if (!Number.isInteger(ratingNum) || ratingNum < 0 || ratingNum > 5) {
            logger.error(`invalid rating: ${rating}`)
            return res.status(400).send({ error: { message: 'A rating of 0 to 5 is required'}})
        }

        bookmarksService.insertBookmark(req.app.get('db'), newBookmark)
            .then(bookmark => {
                res.status(201)
                .location(path.posix.join(req.originalUrl, `/${bookmark.id}`))
                .json(serializeBookmark(bookmark))
            })
            .catch(next)
    })

bookmarksRouter
    .route('/:id')
    .all((req, res, next) => {
        const { id } = req.params
        bookmarksService.getById(req.app.get('db'), id)
            .then(bookmark => {
                if (!bookmark) {
                    logger.error(`Bookmark with id ${id} not found.`)
                    return res.status(404).json({
                        error: { message: 'Bookmark Not Found' }
                    })
                }
                res.bookmark = bookmark
                next()
            })
            .catch(next)
    })
    .get((req, res) => {
        //Refactor your GET methods and tests to ensure that all bookmarks get sanitized.
        res.json(serializeBookmark(res.bookmark))
    })
    .delete((req, res, next) => {
        //Refactor your DELETE handler to support removing bookmarks from the database
        const { id } = req.params
        bookmarksService.deleteBookmark(req.app.get('db'), id)
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
    // Add an endpoint to support updating bookmarks using a PATCH request
    .patch(jsonParser, (req, res, next) => {
        const { title, url, description, rating } = req.body
        const bookmarkToUpdate = { title, url, description, rating }

        const numberOfValues = Object.values(bookmarkToUpdate).filter(Boolean).length
           if (numberOfValues === 0) {
             return res.status(400).json({
               error: {
                 message: `Request body must contain either 'title', 'url', 'rating' or 'description'`
               }
             })
           }

        bookmarksService.updateBookmark(req.app.get('db'), req.params.id, bookmarkToUpdate)
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = bookmarksRouter
