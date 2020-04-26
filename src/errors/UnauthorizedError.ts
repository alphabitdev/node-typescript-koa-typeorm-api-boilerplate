import AppError from './AppError';

export default class UnauthorizedError extends AppError {
  constructor(error?: Error) {
    super(30002, 'Unauthorized user', error);
  }
}
