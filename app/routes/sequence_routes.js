// Express docs: http://expressjs.com/en/api.html
const express = require('express')
const Sequence = require('../models/sequence')

// const customErrors = require('../../lib/custom_errors')

// const handle404 = customErrors.handle404
// const removeBlanks = require('../../lib/remove_blank_fields')

const router = express.Router()

router.get('/sequences', (req, res, next) => {
  // find all sequences
  Sequence.find()
    .then(sequences => {
      return sequences.map(sequence => sequence.toObject())
    })
    .then(sequences => res.status(200).json({ sequences: sequences }))
    .catch(next)
})

// router.get('/sequences/:id', (req, res, next) => {
//   Sequence.findById(req.params.id)
//     .then(handle404)
//     .then(sequence => res.status(200).json({ sequence: sequence.toObject() }))
//     .catch(next)
// })

router.post('/sequences', (req, res, next) => {
  // check if sequence includes letters other than C, A, T, and G
  if (req.body.sequence.sequence.match(/[^GCTA]/)) {
    res.status(422).send({ message: 'Sequence must contain only letters C, A, T, and G!' })
  // if not, then...
  } else {
    // check if this sequence is already in the database
    Sequence.count({sequence: req.body.sequence.sequence}, function (err, count) {
      if (count > 0) {
        // handle error is it already exists
        next(err)
      // if not, proceed to sequence creation
      } else {
        Sequence.create(req.body.sequence)
          .then(sequence => {
            res.status(201).json({ sequence: sequence.toObject() })
          })
          .catch(next)
      }
    })
  }
})

router.post('/upload', (req, res, next) => {
  function asyncPostFunction (item, insertedItems, resolve, reject) {
    // for each sequence
    // check if sequence includes letters other than C, A, T, and G
    if (item.sequence.match(/[^GCTA]/)) {
      console.log('Error hit CATG', item.sequence)
      res.status(422).send({ message: 'Sequence must contain only letters representing the four nucleotide bases (C, A, T, G)' })
      reject()
    } else {
      // check if this sequence is already in the database
      Sequence.count({sequence: item.sequence}, function (err, count) {
        if (count > 0) {
          // console.log('Sequence exists')
          // if yes, handle error
          reject()
          next(err)
        // if not, proceed to sequence creation
        } else {
          Sequence.create(item)
            .then(() => {
              // console.log('inserting items')
              insertedItems.push(item)
              resolve()
            })
            .catch((err) => {
              next(err)
            })
        }
      })
    }
  }

  // console.log('STARTING REQUEST -------------------------------')
  // keep track of inserted items to be able to return them in response
  let insertedItems = []
  // create a promise for sequences
  let requests = (req.body.sequences).map((item) => {
    return new Promise((resolve, reject) => {
      asyncPostFunction(item, insertedItems, resolve, reject)
    })
  })

  Promise.all(requests)
  // only send back data when all promises have been resolved
    .then(() => {
      // console.log('all sequences inserted')
      res.status(201).send({ sequences: insertedItems })
    })
    .catch((err) => {
      next(err)
      // console.log('ERROR with sequence insert')
    })
})

// router.patch('/sequences/:id', removeBlanks, (req, res, next) => {
//   Sequence.findById(req.params.id)
//     .then(handle404)
//     .then(sequence => {
//       return sequence.update(req.body.sequence)
//     })
//     .then(() => res.sendStatus(204))
//     .catch(next)
// })
//
// router.delete('/sequences/:id', (req, res, next) => {
//   Sequence.findById(req.params.id)
//     .then(handle404)
//     .then(sequence => {
//       sequence.remove()
//     })
//     .then(() => res.sendStatus(204))
//     .catch(next)
// })

module.exports = router
