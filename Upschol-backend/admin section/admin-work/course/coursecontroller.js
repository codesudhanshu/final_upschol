const AllCourse = require("./model/CourseCreateModel");
const CourseCategories = require("./model/courseModel");
const Department = require("./model/Department");


exports.getAllCourseCategory = async () => {
  try {
    const categories = await CourseCategories.find().sort({ createdAt: -1 });
    return categories;
  } catch (error) {
    console.error("Error fetching course categories:", error);
    throw new Error("Failed to fetch course categories");
  }
};

exports.updateCourseCategory = async (id, data) => {
  try {
    const category = await CourseCategories.findByIdAndUpdate(
      id,
      { ...data, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      throw new Error("Course category not found");
    }
    
    return category;
  } catch (error) {
    console.error("Error updating course category:", error);
    throw new Error("Failed to update course category");
  }
};

exports.deleteCourseCategory = async (id) => {
  try {
    const category = await CourseCategories.findByIdAndDelete(id);
    
    if (!category) {
      throw new Error("Course category not found");
    }
    
    return { message: "Course category deleted successfully" };
  } catch (error) {
    console.error("Error deleting course category:", error);
    throw new Error("Failed to delete course category");
  }
};


exports.createCourse = async (req) => {
  const {
    name,
    description,
    category,
    prerequisites,
    duration
  } = req.body;


  // Validation
  if (!name || !description || !category || !duration) {
    throw new Error('Course name, description, category and duration are required');
  }

  // Prepare course data
  const courseData = {
    courseName: name,
    courseDescription: description,
    courseCategory: category, 
    prerequisites: prerequisites || '',
    duration,
    createdBy: 'Admin'
  };

  // Create the course
  const course = new AllCourse(courseData);
  const savedCourse = await course.save();

  return { message: 'Course created successfully', savedCourse };
};


exports.getAllCourses = async () => {
  try {
    const courses = await AllCourse.find();
     return { message: 'Courses Fetch', courses };
  } catch (error) {
    console.error("Error fetching courses:", courses);
    throw new Error("Failed to fetch course courses");
  }
};


// Update course function
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedCourse = await AllCourse.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      throw new Error("Course not found");
    }

    return { message: 'Course updated successfully', course: updatedCourse };
  } catch (error) {
    console.error("Error updating course:", error);
    throw new Error("Failed to update course");
  }
};

// Delete course function
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCourse = await AllCourse.findByIdAndDelete(id);

    if (!deletedCourse) {
      throw new Error("Course not found");
    }

    return { message: 'Course deleted successfully' };
  } catch (error) {
    console.error("Error deleting course:", error);
    throw new Error("Failed to delete course");
  }
};

// Get course by ID function
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await AllCourse.findById(id);

    if (!course) {
      throw new Error("Course not found");
    }

    return { message: 'Course fetched successfully', course };
  } catch (error) {
    console.error("Error fetching course:", error);
    throw new Error("Failed to fetch course");
  }
};


exports.createCoursecategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;

    if (!name || typeof isActive !== 'boolean') {
      return { message: "Name and isActive are required fields." };
    }

    const courseCategory = new CourseCategories({ name, description, isActive });
    await courseCategory.save();

    return { message: 'Course category created successfully', courseCategory };
  } catch (error) {
    return { message: error.message };
  }
};

exports.createDepartment = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;

    if (!name) {
      return { message: "Name and createdBy are required fields." };
    }

    const department = new Department({ name, description, isActive });
    await department.save();

    return { message: 'Department created successfully', department };
  } catch (error) {
    return { message: error.message };
  }
};

exports.getAllCoursedepartment = async () => {
  try {
    const departments = await Department.find();
    return departments;
  } catch (error) {
    console.error("Error fetching departments:", error);
    throw new Error("Failed to fetch course departments");
  }
};

exports.getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id);
    
    if (!department) {
      return { message: "Department not found" };
    }
    
    return department;
  } catch (error) {
    return { message: error.message };
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const department = await Department.findByIdAndUpdate(
      id,
      { name, description, isActive },
      { new: true, runValidators: true }
    );

    if (!department) {
      return { message: "Department not found" };
    }

    return { message: 'Department updated successfully', department };
  } catch (error) {
    return { message: error.message };
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findByIdAndDelete(id);

    if (!department) {
      return { message: "Department not found" };
    }

    return { message: 'Department deleted successfully' };
  } catch (error) {
    return { message: error.message };
  }
};