const express = require('express');
const { getAllstate, getAllcity, freecounsellingadd } = require('./freecoursecontroller');
const serviceResponse = require('../../utils/serviceResponse');
const constant = require('../../constant');
const router = express.Router();

router.get('/all-state', async (req, res) => {
  try {
    const result = await getAllstate(req, res);
    res.send(serviceResponse({
      result,
      status: constant.apiStatus.success,
      allowed: true
    }));
  } catch (error) {
    res.send(serviceResponse({
      error,
      status: constant.apiStatus.failed
    }));
  }
});


router.get('/selected-districts-by-state/:id', async (req, res) => {
  try {
    const result = await getAllcity(req.params.id);
     res.send(serviceResponse({
      result,
      status: constant.apiStatus.success,
      allowed: true
    }));
  } catch (error) {
    res.send(serviceResponse({
      error,
      status: constant.apiStatus.failed
    }));
  }
});


router.post('/submit-free-counselling', async (req, res) => {
  try {
    const result = await freecounsellingadd(req.body);
    res.send(serviceResponse({
      result,
      status: constant.apiStatus.success,
      allowed: true
    }));
  } catch (error) {
    res.send(serviceResponse({
      error,
      status: constant.apiStatus.failed
    }));
  }
});


module.exports = function(app) {
    app.use('/candidate', router);
  };