const express = require('express');
const router = express.Router();
const { 
  createApproval,
  getAllApprovals,
  getApprovalById,
  updateApproval,
  deleteApproval
} = require('./approvalController');
// const { verifyAdminToken } = require('../../../utils/tokenAuthenticator');
const serviceResponse = require('../../../utils/serviceResponse');
const constant = require('../../../constant');
const multer = require('multer');
const storage = multer.memoryStorage(); // or diskStorage
const upload = multer({ storage });
module.exports = upload;
// Create Approval
router.post('/create-approval', upload.single('image'), async (req, res) => {
  try {
    const result = await createApproval(req);
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

// Get all Approvals
router.get('/get-approvals', async (req, res) => {
  try {
    const result = await getAllApprovals();
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

// Get single Approval
router.get('/approval/:id', async (req, res) => {
  try {
    const result = await getApprovalById(req.params.id);
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

// Update Approval
router.put('/approval/:id', upload.single('image'), async (req, res) => {
  try {
    const result = await updateApproval(req.params.id, req);
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

// Delete Approval
router.delete('/approval/:id', async (req, res) => {
  try {
    const result = await deleteApproval(req.params.id);
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