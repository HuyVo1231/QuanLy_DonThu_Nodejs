const express = require("express");
const router = express.Router();
const receptionController = require("../app/controllers/ReceptionController");
const { loggedin, isAuth } = require("../app/middleware/auth");

router.get("/taodonthu", receptionController.create);
router.post("/timkiem", receptionController.search);
router.post("/store", receptionController.store);
router.get("/", receptionController.show);
router.get("/:date/details", receptionController.details);
router.get("/:id/edit", receptionController.edit);
router.put("/:id", receptionController.update);
router.delete("/:id", receptionController.destroy);

module.exports = router;
