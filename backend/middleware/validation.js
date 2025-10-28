const validateRegistration = (req, res, next) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ 
      message: 'All fields required' 
    });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ 
      message: 'Password must be at least 6 characters' 
    });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      message: 'Invalid email format' 
    });
  }
  
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      message: 'Email and password required' 
    });
  }
  
  next();
};

const validateQuizAttempt = (req, res, next) => {
  const { quizId, answers, timeTaken } = req.body;
  
  if (!quizId || !answers || !Array.isArray(answers)) {
    return res.status(400).json({ 
      message: 'Invalid quiz attempt data' 
    });
  }
  
  if (timeTaken && (timeTaken < 0 || timeTaken > 3600)) {
    return res.status(400).json({ 
      message: 'Invalid time taken' 
    });
  }
  
  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateQuizAttempt
};
