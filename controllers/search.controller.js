const { response } = require('express')
const { ObjectId } = require('mongoose').Types

const { Movie } = require('../models')

const collectionsAllowed = ['movies']

const searchTrailers = async (term = '', res = response) => {

   const isMongoID = ObjectId.isValid(term)

   if (isMongoID) {
      const movie = await Movie.findById(term)
      return res.json({
         results: (movie) ? [movie] : []
      })
   } else if (!isMongoID) {
      const regex = new RegExp(term, 'i')
      const filter = { $and: [{ $or: [{ title: regex }, { directors: regex }] }, { state: true }] }

      const movies = await Movie.find(filter)
      const total = await Movie.countDocuments(filter)

      res.json({
         total,
         results: movies
      })
   }

}

const search = (req, res = response) => {

   const { collection, term } = req.params

   if (!collectionsAllowed.includes(collection)) {
      res.status(400).json({
         msg: `This collection:${collection.toUpperCase()} is not allowed`,
         collectionsAllowed: `[${collectionsAllowed}]`
      })
   }

   switch (collection) {
      case 'movies':
         searchTrailers(term, res)
         break


      default:
         res.status(500).json({
            msg: "'This search haven't been implemented yet"
         })
   }

}


module.exports = {
   search
}