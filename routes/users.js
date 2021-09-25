var express = require('express')
var router = express.Router()
const usersController = require("../controllers/users-controllers")

router.get("/",usersController.getUsers)
router.get("/:uid", usersController.getUserById)
router.get("/getuserplants/:username", usersController.getuserplants)
router.post("/addplant",usersController.addplant)
router.post("/signup",usersController.signup)
router.post("/login",usersController.login)
module.exports = router;