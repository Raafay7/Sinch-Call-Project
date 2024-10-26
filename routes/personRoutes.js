// routes/personRoutes.js
const express = require('express');
const Person = require('../models/Person');
const router = express.Router();

// Get all people
router.get('/', async (req, res) => {
  try {
    const people = await Person.find();
    res.json(people);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch people' });
  }
});

// Get a person by ID
router.get('/:id', async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) return res.status(404).json({ error: 'Person not found' });
    res.json(person);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch person' });
  }
});

// Create a new person
router.post('/', async (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'Name and phone are required' });

  try {
    const newPerson = new Person({ name, phone });
    await newPerson.save();
    res.status(201).json(newPerson);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create person' });
  }
});

// Update a person by ID
router.put('/:id', async (req, res) => {
  const { name, phone } = req.body;
  try {
    const updatedPerson = await Person.findByIdAndUpdate(req.params.id, { name, phone }, { new: true });
    if (!updatedPerson) return res.status(404).json({ error: 'Person not found' });
    res.json(updatedPerson);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update person' });
  }
});

// Delete a person by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedPerson = await Person.findByIdAndDelete(req.params.id);
    if (!deletedPerson) return res.status(404).json({ error: 'Person not found' });
    res.json(deletedPerson);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete person' });
  }
});

module.exports = router;
