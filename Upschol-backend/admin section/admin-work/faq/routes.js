const express = require('express');
const router = express.Router();
const { 
  createFAQ,
  getAllFAQs,
  getFAQ,
  updateFAQ,
  deleteFAQ
} = require('./faqcontroller');
const { verifyAdminToken } = require('../../../utils/tokenAuthenticator');
const serviceResponse = require('../../../utils/serviceResponse');
const constant = require('../../../constant');

// Create FAQ
router.post('/create-faq', async (req, res) => {
  try {
    const result = await createFAQ(req);
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

// Get all FAQs
router.get('/faq', async (req, res) => {
  try {
    const result = await getAllFAQs();
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

// Update FAQ
router.put('/faq/:id', async (req, res) => {
  try {
    const result = await updateFAQ(req.params.id, req.body);
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

// Delete FAQ
router.delete('/faq/:id', async (req, res) => {
  try {
    const result = await deleteFAQ(req.params.id);
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
  app.use('/admin', router);
};