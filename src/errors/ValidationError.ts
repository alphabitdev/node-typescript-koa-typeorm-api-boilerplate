import AppError from './AppError';

export default class ValidationError extends AppError {
  constructor(message: string, error?: Error) {
    super(30000, message, error);
  }
}
