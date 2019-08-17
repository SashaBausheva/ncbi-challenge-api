// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/

// pull in Mongoose model for examples
const Sequence = require('../models/sequence')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /examples
router.get('/sequences', (req, res, next) => {
  Sequence.find()
    .then(sequences => {
      // `examples` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return sequences.map(sequence => sequence.toObject())
    })
    // respond with status 200 and JSON of the examples
    .then(sequences => res.status(200).json({ sequences: sequences }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /examples/5a7db6c74d55bc51bdf39793
router.get('/sequences/:id', (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Sequence.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "example" JSON
    .then(sequence => res.status(200).json({ sequence: sequence.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /examples
router.post('/sequences', (req, res, next) => {
  // set owner of new example to be current user
  console.log('req seq', req.body.sequence.sequence)
  console.log('is match true?', req.body.sequence.sequence.match(/[^GCTA]/))
  if (req.body.sequence.sequence.match(/[^GCTA]/)) {
    res.status(422).send({ message: 'Sequence must contain only CATG letters!' })
  } else {
    Sequence.create(req.body.sequence)
      // respond to succesful `create` with status 201 and JSON of new "example"
      .then(sequence => {
        res.status(201).json({ sequence: sequence.toObject() })
      })
      // if an error occurs, pass it off to our error handler
      // the error handler needs the error message and the `res` object so that it
      // can send an error message back to the client
      .catch(next)
  }
})

// UPDATE
// PATCH /examples/5a7db6c74d55bc51bdf39793
router.patch('/sequences/:id', removeBlanks, (req, res, next) => {
  Sequence.findById(req.params.id)
    .then(handle404)
    .then(sequence => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner

      // pass the result of Mongoose's `.update` to the next `.then`
      return sequence.update(req.body.sequence)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /examples/5a7db6c74d55bc51bdf39793
router.delete('/sequences/:id', (req, res, next) => {
  Sequence.findById(req.params.id)
    .then(handle404)
    .then(sequence => {
      // delete the example ONLY IF the above didn't throw
      sequence.remove()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
