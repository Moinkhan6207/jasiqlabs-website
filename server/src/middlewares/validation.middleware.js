// Validation middleware for request validation
// Can be extended with libraries like Joi or express-validator

export const validateLead = (req, res, next) => {
  const { name, email, interestType } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required and must be a non-empty string' });
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  if (!interestType || !['STUDENT', 'CLIENT', 'PARTNER'].includes(interestType)) {
    return res.status(400).json({ error: 'Valid interestType is required (STUDENT, CLIENT, or PARTNER)' });
  }

  next();
};

