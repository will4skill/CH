// References
// 1. https://www.npmjs.com/package/axios
// 2. https://www.npmjs.com/package/node-xlsx
const express = require('express');
const router = express.Router();
const axios = require('axios');
const xlsx = require('node-xlsx').default;

router.get('/', async function(req, res){
  const file = xlsx.parse(`./CoordinationProtocol.xlsx`);
  const protocol = file[0].data;
  const name = req.query.name.toLowerCase()[0];
  const current = Number(req.query.current_service.slice(1));
  const next = Number(req.query.new_service.slice(1));
  const error_message = "Request can’t be executed: violates the coordination protocol";
  let name_type = "X"
  if (/[a-m]/.test(name)) name_type = "J";

  if ( protocol[current][next] == name_type || protocol[current][next] == "B" ) {
    try {
      const result = await axios.get(`http://localhost:3000/api/services/${req.query.new_service}/?name=${req.query.name}`);
      res.send({ data: result.data, current: "s" + next, protocol });
    } catch (err) {
      console.error(err);
    }
  } else {
    res.send({ data: error_message, current: "s" + current, protocol });
  }
});

router.get('/first-state', async function(req, res){
  const file = xlsx.parse(`./CoordinationProtocol.xlsx`);
  const protocol = file[0].data;
  let start, starting_service;
  const length = protocol[0].length;

  for(let j = 1; j < length; j++) {
    start = true;
    for (let i = 1; i < length; i++) {
      if (protocol[i][j] != 0)
        start = false;
    }
    if (start == true) {
      starting_service = j;
    }
  }

  const result = await axios.get(`http://localhost:3000/api/services/s${starting_service}/?name=${req.query.name}`);
  res.send({ data: result.data, current: "s" + starting_service });
});


module.exports = router;
