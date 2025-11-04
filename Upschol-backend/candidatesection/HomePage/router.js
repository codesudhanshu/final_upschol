const express = require('express');
const router = express.Router();
const serviceResponse = require('../../utils/serviceResponse');
const constant = require('../../constant');
const { getAllCoursesData, getAllTestimonialsData, getAllIndustryExpertsData, getAllFAQsData, getAllCompaniesData, getAllBannersData, getAllannouncementsData, searchUniversities} = require('./controller');


router.get('/all-announcement-data', async (req, res) => {
  try {
    const result = await getAllannouncementsData();
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


router.get('/all-courses-data', async (req, res) => {
  try {
    const result = await getAllCoursesData();
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


router.get('/all-testimonial-data', async (req, res) => {
  try {
    const result = await getAllTestimonialsData();
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


router.get('/all-industry-experts-data', async (req, res) => {
  try {
    const result = await getAllIndustryExpertsData();
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


router.get('/all-faq-data', async (req, res) => {
  try {
    const result = await getAllFAQsData();
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


router.get('/all-company-data', async (req, res) => {
  try {
    const result = await getAllCompaniesData();
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

router.get('/all-banner-data', async (req, res) => {
  try {
    const result = await getAllBannersData();
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


router.get('/all-university-search-data ', async (req, res) => {
  try {
    const result = await getAllBannersData();
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


// Endpoint to search universities with filters
router.get('/search-universities', async (req, res) => {
  try {
    const result = await searchUniversities(req);
    res.send(serviceResponse({
      result,
      status: constant.apiStatus.success,
      allowed: true
    }));
  } catch (error) {
    res.send(serviceResponse({
      error: error.message,
      status: constant.apiStatus.failed
    }));
  }
});


module.exports = function(app) {
  app.use('/candidate', router);
};