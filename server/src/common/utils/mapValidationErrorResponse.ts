import { ValidationError } from 'class-validator';

const mapValidationErrorResponse = (errors: ValidationError[]) => {
  const mapped = errors.map((err) => {
    const key = err.property;
    const value = Object.values(err.constraints);

    return { [key]: value };
  });

  return mapped;
};

export default mapValidationErrorResponse;
