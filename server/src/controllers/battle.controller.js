const battleModel = require("../models/battle.model");
const battleService = require("../services/battle.service");

const createbattle = async ( req , res ) => {


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
    const questionsData = require('../services/questionsData.json'); 
    const filteredQuestions = questionsData.filter(
      (q) => q.difficulty.toLowerCase() === battle.difficulty.toLowerCase()
    );
    if (filteredQuestions.length < battle.questionsNumber) {
      return res.status(400).json({ message: "Not enough questions for the selected difficulty." });
    }
    const selectedQuestions = [];
    while (selectedQuestions.length < battle.questionsNumber) {
      const idx = Math.floor(Math.random() * filteredQuestions.length);
      if (!selectedQuestions.includes(filteredQuestions[idx])) {
        selectedQuestions.push(filteredQuestions[idx]);
      }
    }
    battle.questions = selectedQuestions;
    battle.status = 'in-progress';
    await battle.save();
    res.status(200).json({ battle, message: "Battle started successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while starting the battle." });
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

    

module.exports = { createbattle, getAllBattles, deleteBattle, leaveBattle, StartBattle , completeBattle };