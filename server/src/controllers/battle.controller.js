const battleModel = require("../models/battle.model");
const battleService = require("../services/battle.service");

const createbattle = async ( req , res, next ) => {


    try {

    const createdBy = req.user._id;

    const {
      battleName,
      description,
      isPrivate,
      questionsNumber,
      isSameLanguage,
      allowedLanguages,
      difficulty,
      mode,
      createdAt,
    } = req.body;

    const battle = await battleService.createBattle({
      battleName,
      description,
      isPrivate,
      questionsNumber,
      createdBy,
      isSameLanguage,
      allowedLanguages,
      difficulty,
      mode,
      createdAt,
    });

    res.status(201).json({ battle });


  } catch (error) {
    next(error);
  }
};

const getAllBattles = async (req, res, next) => {
  try {
    const battles = await battleModel.find({}).populate('createdBy', 'fullname');
    res.status(200).json({ battles });
  } catch (error) {
    next(error);
  }
};

const getBattleByRoomCode = async (req, res, next) => {
  try {
    const battle = await battleModel.findOne({ roomCode: req.params.roomCode })
      .populate('createdBy', 'fullname');

    if (!battle) {
      return res.status(404).json({ message: "Battle room not found" });
    }

    return res.status(200).json({ battle });
  } catch (error) {
    next(error);
  }
};

const joinBattle = async (req, res, next) => {
  try {
    const roomCode = req.params.roomCode.trim().toUpperCase();

    const availableBattle = await battleModel.findOne({ roomCode });
    if (!availableBattle) {
      return res.status(404).json({ message: "Battle room not found" });
    }

    if (availableBattle.createdBy.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot join your own battle room" });
    }

    if (availableBattle.challenger?.toString() === req.user._id.toString()) {
      const joinedBattle = await battleModel.findById(availableBattle._id)
        .populate("createdBy", "name email")
        .populate("challenger", "name email");

      return res.status(200).json({ battle: joinedBattle, message: "Already joined this battle room" });
    }

    if (availableBattle.challenger && availableBattle.challenger.toString() !== req.user._id.toString()) {
      return res.status(409).json({
        battle: availableBattle,
        message: "This battle room already has a challenger."
      });
    }

    const battle = await battleModel.findOneAndUpdate(
      {
        _id: availableBattle._id,
        status: "waiting",
        $or: [{ challenger: { $exists: false } }, { challenger: null }],
      },
      { $set: { challenger: req.user._id } },
      { new: true }
    )
      .populate("createdBy", "name email")
      .populate("challenger", "name email");

    if (!battle) {
      return res.status(409).json({
        battle: availableBattle,
        message: "This battle room already has two players or has started"
      });
    }

    return res.status(200).json({ battle, message: "Joined battle room successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteBattle = async (req, res, next) => {
    try {
    const battleId = req.params.id;
    const battle = await battleModel.findByIdAndDelete(battleId);
    if (!battle) {
      return res.status(404).json({ message: "Battle not found" });
    }
    return res.status(200).json({ message: "Battle deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const leaveBattle = async (req, res, next) => {
    try {
    const battleId = req.params.id;
    const { userId } = req.body; // jisne leave kiya uski id
    
    const battle = await battleModel.findById(battleId);
    if (!battle) {
      return res.status(404).json({ message: "Battle not found" });
    }

    if (battle.user1.toString() === userId) {
      battle.user1SocketId = null;
    } else if (battle.user2.toString() === userId) {
      battle.user2SocketId = null;
    }

    await battle.save();
    return res.status(200).json({ battle, message: "Left battle successfully" });
  } catch (error) {
    next(error);
  }
};

const StartBattle = async (req, res, next) => {
    try {
    const battleId = req.params.id;
    const battle = await battleModel.findById(battleId);
    if (!battle) {
      return res.status(404).json({ message: "Battle not found" });
    }

    const questionsData = require('../services/question.json');
    const filteredQuestions = questionsData.filter(
      (q) => q && q.difficulty && q.difficulty.toLowerCase() === String(battle.difficulty).toLowerCase()
    );

    if (filteredQuestions.length < battle.questionsNumber) {
      return res.status(400).json({ message: "Not enough questions for the selected difficulty." });
    }

    const selectedQuestions = [];
    while (selectedQuestions.length < battle.questionsNumber) {
      const idx = Math.floor(Math.random() * filteredQuestions.length);
      const question = filteredQuestions[idx];
      if (!selectedQuestions.includes(question)) {
        selectedQuestions.push(question);
      }
    }

    battle.questions = selectedQuestions;
    battle.status = 'in-progress';
    await battle.save();
    return res.status(200).json({ battle, message: "Battle started successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while starting the battle." });
  }
};

const completeBattle = async (req, res, next) => {
    try {
    const battleId = req.params.id;
    const { scores } = req.body; 
    const battle = await battleModel.findById(battleId);
    if (!battle) {
      return res.status(404).json({ message: "Battle not found" });
    }
    let winner;
    if (scores.creator + scores.challenger === battle.questions.length) {
      if (scores.creator > scores.challenger) {
        winner = battle.createdBy;
      } else if (scores.creator < scores.challenger) {
        winner = battle.challenger;
      } else {
        winner = null;
      }
    } else {
      winner = null;
    }
    
    battle.status = 'completed';
    battle.winner = winner;
    await battle.save();
    
    const populatedBattle = await battleModel.findById(battleId)
      .populate('createdBy', 'fullname socketId')
      .populate('winner', 'fullname socketId')
      .populate('challenger', 'fullname socketId');

    return res.status(200).json({ battle: populatedBattle, message: "Battle completed successfully." });
  } catch (error) {
    next(error);
  }
};

    

module.exports = { createbattle, getAllBattles, getBattleByRoomCode, joinBattle, deleteBattle, leaveBattle, StartBattle , completeBattle };