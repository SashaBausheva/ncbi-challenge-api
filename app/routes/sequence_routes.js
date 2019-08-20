// Express docs: http://expressjs.com/en/api.html
const express = require('express')
const Sequence = require('../models/sequence')

// const customErrors = require('../../lib/custom_errors')

// const handle404 = customErrors.handle404
// const removeBlanks = require('../../lib/remove_blank_fields')

const router = express.Router()

router.get('/sequences', (req, res, next) => {
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
  console.log('req seq', req.body.sequence.sequence)
  console.log('is match true?', req.body.sequence.sequence.match(/[^GCTA]/))
  if (req.body.sequence.sequence.match(/[^GCTA]/)) {
    res.status(422).send({ message: 'Sequence must contain only CATG letters!' })
  } else {
    Sequence.create(req.body.sequence)
      .then(sequence => {
        res.status(201).json({ sequence: sequence.toObject() })
      })
      .catch(next)
  }
})

router.post('/upload', (req, res, next) => {
  function asyncPostFunction (item, insertedItems, resolve, reject) {
    if (item.sequence.match(/[^GCTA]/)) {
      console.log('Error hit CATG', item.sequence)
      res.status(422).send({ message: 'Sequence must contain only letters representing the four nucleotide bases (C, A, T, G)' })
      reject()
    } else {
      Sequence.count({sequence: item.sequence}, function (err, count) {
        if (count > 0) {
          // console.log('Sequence exists')
          reject()
          next(err)
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
  let insertedItems = []
  let requests = (req.body.sequences).map((item) => {
    return new Promise((resolve, reject) => {
      asyncPostFunction(item, insertedItems, resolve, reject)
    })
  })

  Promise.all(requests)
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
