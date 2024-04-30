const express = require("express");
const router = express.Router();
const usersController = require("../app/controllers/UsersController");
const { isAdmin } = require("../app/middleware/auth");

router.get("/profile", usersController.show);
router.get("/:id", isAdmin, usersController.profileID);
router.put("/:id", usersController.update);
router.delete("/:id", usersController.delete);

module.exports = router;
