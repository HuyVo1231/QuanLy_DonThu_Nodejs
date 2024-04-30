const express = require("express");
const router = express.Router();
const DateController = require("../app/controllers/DateController");
const { loggedin, isAuth } = require("../app/middleware/auth");

router.get("/taongaytiepdan", DateController.create);
router.post("/store", DateController.store);
router.get("/", DateController.show);
router.get("/:date/edit", DateController.edit);
router.get("/:date/search", DateController.showDay); 
router.put("/:date", DateController.update);
router.delete("/:date", DateController.delete);

module.exports = router;
