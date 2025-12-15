import { ZodError } from "zod";

export function validate(schema) {
  return (req, res, next) => {
    try {
      schema.parse({
        body: req.body ?? {},
        query: req.query ?? {},
        params: req.params ?? {},
      });

      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = Array.isArray(err.errors) ? err.errors.map(e => ({
          path: e.path.join("."),
          message: e.message,
        })) : [];

        return res.status(400).json({
          status: 400,
          message: "Erro de validação",
          errors,
        });
      }

      return next(err); 
    }
  };
}
