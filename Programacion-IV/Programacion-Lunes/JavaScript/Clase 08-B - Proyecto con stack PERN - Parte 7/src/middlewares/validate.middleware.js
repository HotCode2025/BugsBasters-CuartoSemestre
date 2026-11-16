export const validateSchema = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body ?? {});

  if (!result.success) {
    return res.status(400).json({
      message: result.error.issues.map((issue) => issue.message),
    });
  }

  req.body = result.data;
  next();
};