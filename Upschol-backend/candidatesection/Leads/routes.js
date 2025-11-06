const express = require('express');
const serviceResponse = require('../../utils/serviceResponse');
const constant = require('../../constant');
const { LeadsAdd, LeadsDetails } = require('./controller');
const router = express.Router();


router.post('/send-leads', async (req, res) => {
  try {
    const result = await LeadsAdd(req.body);
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


router.post('/send-amity', async (req, res) => {
  try {
    const result = await LeadsAdd(req.body);
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

router.post('/send-lpu', async (req, res) => {
  try {
    const result = await LeadsAdd(req.body);
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

router.post('/send-manipal', async (req, res) => {
  try {
    const result = await LeadsAdd(req.body);
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

router.post('/send-nmims', async (req, res) => {
  try {
    const result = await LeadsAdd(req.body);
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


router.get('/leads', async (req, res) => {
  try {
    const result = await LeadsDetails(req);
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