#! /usr/bin/env node

console.log(
  'This script populates some test categories, and instruments to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"',
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Instrument = require("./models/instrument");
const Category = require("./models/category");

const instruments = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createInstruments();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name, description) {
  const category = new Category({ name: name, description: description });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function instrumentCreate(
  index,
  name,
  description,
  category,
  price,
  inStock,
) {
  const instrumentdetail = {
    name: name,
    description: description,
    category: category,
    price: price,
    inStock: inStock,
  };

  const instrument = new Instrument(instrumentdetail);

  await instrument.save();
  instruments[index] = instrument;
  console.log(`Added instrument: ${name}`);
}

async function createCategories() {
  console.log("Adding genres");
  await Promise.all([
    categoryCreate(
      0,
      "Keyboards",
      "Everything from pianos, electric pianos, to Keytars.",
    ),
    categoryCreate(
      1,
      "Guitars",
      "6, 7, and even 8 string guitars for all types of playing. Find Acoustic and Electric guitars",
    ),
    categoryCreate(
      2,
      "Basses",
      "4, 5, and even 6 string basses to play those funky tunes.",
    ),
  ]);
}

async function createInstruments() {
  console.log("Adding authors");
  await Promise.all([
    instrumentCreate(
      0,
      "Martin 000CJR-10E Streetmaster Acoustic-Electric Guitar",
      "Whether for travel, gigs on the road, or a student looking for a smaller sized guitar, the new 000CJR-10E STREETMASTER, with its StreetMaster styling, is sure to be the right guitar for the job.",
      categories[1],
      749,
      5,
    ),
    instrumentCreate(
      1,
      "Epiphone Les Paul Classic Electric Guitar (Heritage Cherry Sunburst)",
      'Epiphone Les Paul Classic Electric Guitar, Mahogany Body w/ Plain Maple Cap, 24.75" Scale SlimTaper Mahogany Neck w/ Indian Laurel Fingerboard, Dual Alnico Classic PRO Humbuckers',
      categories[1],
      599,
      20,
    ),
    instrumentCreate(
      2,
      "Fender American Performer Precision Bass 3-Color Sunburst",
      "Fender gives the classic looking P-Bass in an American Performer Series package.",
      categories[2],
      1499.99,
      57,
    ),
    instrumentCreate(
      3,
      "Fender American Ultra Precision Bass Arctic Pearl",
      'Fender American Ultra Precision Bass, Alder Precission Bass Body, 34" Scale Modern D Maple Neck w/ 10"-14" Compound Radius Fingerboard, Noiseless Vintage Single-Coil Jazz Bass Bridge Pickup & Noiseless Vintage Split-Coil P Bass Middle Pickup',
      categories[2],
      1499.99,
      57,
    ),
    instrumentCreate(
      4,
      "Roland E-X50 ARRANGER KEYBOARD",
      "Powerful entertainment keyboard with professional Roland sounds, auto-accompaniment features, full-range stereo speakers, Bluetooth® audio, and more.",
      categories[0],
      499.99,
      37,
    ),
    instrumentCreate(
      5,
      "Casio CT-S200 Casiotone Portable Keyboard Red",
      "CT-S200 61-Key Casiotone Portable Keyboard (Red) with Built-in Carrying Handle, LCD Display, and USB Midi Connectivity.",
      categories[0],
      139.99,
      25,
    ),
  ]);
}
