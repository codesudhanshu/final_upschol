const express = require('express');
const router = express.Router();

// const { verifyAdminToken } = require('../../../utils/tokenAuthenticator');
const { getAllCourseCategory, getAllCoursedepartment, getSubCoursesByDepartmentId, createCourse, createCoursecategory, createDepartment, getAllCourses, updateCourseCategory, deleteCourseCategory, getCourseById, deleteCourse, updateCourse, deleteDepartment, updateDepartment} = require('./coursecontroller');
const serviceResponse = require('../../../utils/serviceResponse');
const constant = require('../../../constant');

// Get all departments
router.get('/course-departments', async (req, res) => {
  try {
    const result = await getAllCoursedepartment(req, res);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get department by ID
router.get('/course-departments/:id', async (req, res) => {
  try {
    const result = await getDepartmentById(req, res);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Add department
router.post('/add-department', async (req, res) => {
  try {
    const result = await createDepartment(req, res);
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

// Update department
router.put('/update-department/:id', async (req, res) => {
  try {
    const result = await updateDepartment(req, res);
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

// Delete department
router.delete('/delete-department/:id', async (req, res) => {
  try {
    const result = await deleteDepartment(req, res);
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

// Backend Routes

router.post('/add-course-category', async (req, res) => {
  try {
    const result = await createCoursecategory(req, res);
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


router.get('/course-category', async (req, res) => {
  try {
    const result = await getAllCourseCategory();
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.put('/update-course-category/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await updateCourseCategory(id, req.body);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.delete('/delete-course-category/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteCourseCategory(id);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});



router.post('/add-course', async (req, res) => {
  try {
    const result = await createCourse(req, res);
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


router.get('/courses', async (req, res) => {
  try {
    const result = await getAllCourses(req, res);
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

// Update course route
router.put('/update-course/:id', async (req, res) => {
  try {
    const result = await updateCourse(req, res);
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

// Delete course route
router.delete('/delete-course/:id', async (req, res) => {
  try {
    const result = await deleteCourse(req, res);
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

// Get single course route
router.get('/course/:id', async (req, res) => {
  try {
    const result = await getCourseById(req, res);
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