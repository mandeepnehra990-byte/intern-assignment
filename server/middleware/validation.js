export const validateRegistration = (req, res, next) => {
  const { username, email, password } = req.body;
  const errors = {};

  if (!username || username.trim().length < 3 || username.trim().length > 30) {
    errors.username = 'Username must be between 3 and 30 characters';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = 'Valid email is required';
  }

  if (!password || password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      details: errors
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = {};

  if (!email) {
    errors.email = 'Email is required';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      details: errors
    });
  }

  next();
};

export const validatePost = (req, res, next) => {
  const { title, content, image_url } = req.body;
  const errors = {};

  if (!title || title.trim().length < 5 || title.trim().length > 120) {
    errors.title = 'Title must be between 5 and 120 characters';
  }

  if (!content || content.trim().length < 50) {
    errors.content = 'Content must be at least 50 characters';
  }

  if (image_url && image_url.trim() !== '') {
    const urlRegex = /^https?:\/\/.+/;
    if (!urlRegex.test(image_url)) {
      errors.image_url = 'Image URL must be a valid URL';
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      details: errors
    });
  }

  next();
};
