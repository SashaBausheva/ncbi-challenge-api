const mongoose = require('mongoose')

const sequenceSchema = new mongoose.Schema({
  sequenceDescription: {
    type: String,
    required: true
  },
  sequenceName: {
    type: String,
    required: true
  },
  sequence: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Sequence', sequenceSchema)
