# Bookmarks Server

This server implements route handlers for the following endpoints:

*GET /bookmarks that returns a list of bookmarks

*GET /bookmarks/:id that returns a single bookmark with the given ID, return 404 Not Found if the ID is not valid

*POST /bookmarks that accepts a JSON object representing a bookmark and adds it to the list of bookmarks after validation.

*DELETE /bookmarks/:id that deletes the bookmark with the given ID.




