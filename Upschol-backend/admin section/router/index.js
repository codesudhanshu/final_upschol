
const authRoute = require('../auth/routes')
const faq = require('../admin-work/faq/routes')
const course = require('../admin-work/course/routes');
const testimonialRoutes = require('../admin-work/testimonials/testimonialRoutes');
const industryExpertRoutes = require('../admin-work/industryexperts/industryExpertRoutes');
const industryExpertTestimonialsRoutes = require('../admin-work/industry-expert-testimonials/industryExpertTestimonialRoutes');
const blogRoutes = require('../admin-work/blogs/blogRoutes');
const companyRoutes = require('../admin-work/companydetails/companyRoutes');
const bannerRoutes = require('../admin-work/bannertips/bannerRoutes');
const approvalRoutes = require('../admin-work/approvals/approvalRoutes');
const announcement = require('../admin-work/announcement/announcementRoutes')
const careers = require('../admin-work/careers/careersRoutes')
const university = require('../admin-work/university/universityRoutes')
const specialization = require('../admin-work/coursespecialization/courseSpecializationRoutes')

module.exports = function(app) {
    authRoute(app);
    faq(app)
    course(app)
    blogRoutes(app)
    testimonialRoutes(app)
    industryExpertRoutes(app)
    industryExpertTestimonialsRoutes(app)
    companyRoutes(app)
    bannerRoutes(app)
    approvalRoutes(app)
    announcement(app)
    careers(app)
    university(app)
    specialization(app)
};