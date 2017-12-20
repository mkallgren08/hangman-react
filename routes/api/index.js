const router = require("express").Router();
const articleRoutes = require("./articles");
const biodiversityRoutes = require("./biodiversity")

//  routes
router.use("/articles", articleRoutes);
router.use("/biodiversity", biodiversityRoutes);

module.exports = router;
