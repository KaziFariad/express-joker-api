const express = require('express');
const router = express.Router();
const jokes = require('../../Jokes');
let latestId = 0;

const idFilter = (req) => (joke) => joke.id === parseInt(req.params.id);
const maxIdFinder = () => {
  let max = latestId;
  jokes.forEach((joke) => {
    if (joke.id > max) {
      max = joke.id;
    }
    // console.log(max);
  });
  return max;
};

// get all jokes
router.get('/', (req, res) => res.send(jokes));

// get joke by id
router.get('/:id', (req, res) => {
  const found = jokes.some(idFilter(req));

  found
    ? res.send(jokes.filter(idFilter(req)))
    : res.status(400).send('No joke found with the id');
});

// submit a new joke
router.post('/', (req, res) => {
  const newJoke = {
    id: maxIdFinder() + 1,
    category: req.body.category || 'general',
    ...req.body,
  };
  latestId = parseInt(newJoke.id);
  jokes.push(newJoke);
  res.send(jokes);
});

// update joke
router.put('/:id', (req, res) => {
  const found = jokes.some(idFilter(req));

  if (found) {
    jokes.forEach((joke, i) => {
      if (idFilter(req)(joke)) {
        const updjoke = { ...joke, ...req.body };
        jokes[i] = updjoke;
        res.json({ msg: 'joke updated', updjoke });
      }
    });
  } else {
    res.status(400).json({ msg: `No joke with the id of ${req.params.id}` });
  }
});

// delete a joke
router.delete('/:id', (req, res) => {
  const found = jokes.some(idFilter(req));

  if (found) {
    res.json({
      msg: 'joke deleted',
      jokes: jokes.filter((joke) => !idFilter(req)(joke)),
    });
  } else {
    res.status(400).json({ msg: `No joke with the id of ${req.params.id}` });
  }
});

module.exports = router;
