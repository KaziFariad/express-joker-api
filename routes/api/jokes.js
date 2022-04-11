'use strict';

const express = require('express');
const router = express.Router();
const Joke = require('../../models/Joke');

router
  .route('/')
  // get all jokes
  .get(async (req, res) => {
    res.send(await Joke.find());
  })

  // submit a joke
  .post(async (req, res) => {
    const joke = new Joke(req.body);
    await joke.save();
    res.status(201).send(joke);
  });

router
  .route('/:id')

  // get joke by Id
  .get((req, res) => {
    Joke.findById(req.params.id, (err, doc) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (doc) {
        res.send(doc);
        return;
      }
      res.status(404).json({
        message: 'joke with id ' + req.params.id + ' was not found.',
      });
    });
  })

  // update a joke
  .put((req, res) => {
    Joke.findByIdAndUpdate(req.params.id, req.body, (err, doc) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (doc) {
        res.send(`Joke with id: ${req.params.id} was updated`);
        return;
      }
      res.status(404).json({
        message: 'joke with id ' + req.params.id + ' was not found.',
      });
    });
  })

  // edit a joke
  .patch((req, res) => {
    const joke = { ...req.body };
    Joke.findByIdAndUpdate(req.params.id, { $set: joke }, (error, doc) => {
      if (error) {
        res.status(500).send(error);
        return;
      }
      if (doc) {
        Joke.findById(req.params.id, (err, doc) => {
          if (error) {
            res.status(500).send(error);
            return;
          }

          res.send(doc);
        });
        return;
      }

      res.status(404).json({
        message: 'joke with id ' + req.params.id + ' was not found.',
      });
    });
  })

  // delete a joke
  .delete((req, res) => {
    Joke.findByIdAndDelete(req.params.id, (err, doc) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (doc) {
        res.send(`Joke with id: ${req.params.id} was deleted`);
        return;
      }
      res.status(404).json({
        message: 'joke with id ' + req.params.id + ' was not found.',
      });
    });
  });

module.exports = router;
