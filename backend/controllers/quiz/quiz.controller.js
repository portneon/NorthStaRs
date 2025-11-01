const prisma = require('../../prisma/prisma');

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        topic: true,
        course: true,
        questions: {
          include: {
            options: true
          }
        }
      }
    });
    res.json(quizzes);
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        topic: true,
        course: true,
        questions: {
          include: {
            options: true
          }
        }
      }
    });
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    res.json(quiz);
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.submitQuizAttempt = async (req, res) => {
  try {
    const { quizId, answers, timeTaken } = req.body;
    const userId = req.user.id;
    
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    });
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    let score = 0;
    const userAnswers = [];
    
    for (const answer of answers) {
      const question = quiz.questions.find(q => q.id === answer.questionId);
      const isCorrect = question.correctOptionId === answer.optionId;
      
      if (isCorrect) score++;
      
      userAnswers.push({
        questionId: answer.questionId,
        optionId: answer.optionId,
        isCorrect
      });
    }
    
    const attempt = await prisma.attempt.create({
      data: {
        userId,
        quizId,
        score,
        timeTakenSec: timeTaken,
        finishedAt: new Date(),
        userAnswers: {
          createMany: {
            data: userAnswers
          }
        }
      }
    });
    
    // update user xp
    const xpGained = score * 10;
    await prisma.user.update({
      where: { id: userId },
      data: {
        xp: { increment: xpGained }
      }
    });
    
    res.json({
      message: 'Quiz submitted successfully',
      score,
      xpGained,
      attemptId: attempt.id
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};