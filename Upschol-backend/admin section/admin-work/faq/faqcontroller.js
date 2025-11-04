const FAQ = require('./faqModel');

// Create a new FAQ
exports.createFAQ = async (req) => {
  const { title, description } = req.body;
  
  if (!title || !description) {
    throw new Error('Title and description are required');
  }

  const faq = new FAQ({
    title,
    description
  });

  return await faq.save();
};

// Get all FAQs
  exports.getAllFAQs = async () => {
    return await FAQ.find().populate('createdBy', 'name email');
  };

// Update FAQ
exports.updateFAQ = async (id, updateData) => {
  try {
    const { title, description } = updateData;
    
    if (!title || !description) {
      throw new Error('Title and description are required for update');
    }

    const faq = await FAQ.findByIdAndUpdate(
      id,
      { title, description, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!faq) {
      throw new Error('FAQ not found');
    }

    return {
      status: 'success',
      result: faq,
      error: null
    };

  } catch (error) {
    console.error('Update FAQ Error:', error);
    return {
      status: false,
      result: null,
      error: error.message
    };
  }
};

// Delete FAQ
exports.deleteFAQ = async (id) => {
  const faq = await FAQ.findByIdAndDelete(id);

  if (!faq) {
    throw new Error('FAQ not found');
  }

  return { message: 'FAQ deleted successfully' };
};