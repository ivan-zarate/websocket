const validateBody = (req, res, next) => {
    if (req.body.title || req.body.email) {
      req.isCorrect = true;
      return next();
    }
    throw new Error("The body is required");
  };
  
  module.exports = validateBody;