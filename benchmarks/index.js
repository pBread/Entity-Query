const Mo = require("../dist/index");
const randName = require("./names");

const data = generateData(10, 10, 1000);
const paths = parsePaths(data);

console.log(JSON.stringify(data, null, 2));

/****************************************************
 Parse Paths
****************************************************/
function parsePaths(data, count) {
  let paths = [];
}

/****************************************************
 Generate Random Data
****************************************************/

function generateData(count, fields, nested) {
  let data = [];
  for (let i = 0; i < count; i++) data.push(createRandom(fields, nested));
  return data;
}

function createRandom(fields, nested) {
  let obj = {};
  for (let i = 0; i < fields; i++) {
    let randVal;

    if (randInt(nested) > 5) randVal = createRandom(fields, randInt(nested));
    else randVal = randPrimitive();

    obj[randStr(randInt(16))] = randVal;
  }
  return obj;
}

function randPrimitive() {
  switch (randInt(5)) {
    case 0:
      return randInt(8);

    case 1:
      return Math.random();

    case 2:
      return Math.random() < 0.5 ? true : false;

    case 3:
      return randName();

    case 4:
      return Math.random() < 0.5 ? null : undefined;
  }
}

function randInt(max) {
  return Math.floor(Math.random() * max);
}

function randStr(len) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let str = randInt(chars.length);
  for (var i = 0; i < len; i++) str += chars[randInt(chars.length)];
  return str;
}
