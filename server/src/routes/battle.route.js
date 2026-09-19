const express = require("express");
const router = express.Router();
const { createbattle, getAllBattles, getBattleByRoomCode, joinBattle, deleteBattle, leaveBattle, StartBattle, completeBattle } = require("../controllers/battle.controller");
const authMiddleware = require("../middlewares/user.middleware");

router.post("/create", authMiddleware.authuser, createbattle);
router.get("/all", getAllBattles);
router.get("/room/:roomCode", authMiddleware.authuser, getBattleByRoomCode);
router.post("/join/:roomCode", authMiddleware.authuser, joinBattle);
router.delete("/delete/:id", deleteBattle);
router.post("/leave/:id", leaveBattle);
router.post("/start/:id", StartBattle);
router.post("/complete/:id", completeBattle);


module.exports = router;