
const HomePage = require('./HomePage/router')
const freecouselling = require('./freecounselling/freecoursellingrouter')
const formsends = require('./Leads/routes')

module.exports = function(app) {
   HomePage(app)
   freecouselling(app)
   formsends(app)
};