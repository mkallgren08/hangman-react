const router = require("express").Router();
const biodiversityController = require("../../controllers/biodiversityController");

// Matches with "/api/biodiversity"
router.route("/")
  .get(biodiversityController.findAll)
  .post(biodiversityController.create);

// Matches with "/api/biodiversity/:id"
router
  .route("/:id")
  .get(biodiversityController.findById)
  .put(biodiversityController.update)
  .delete(biodiversityController.remove);

module.exports = router;