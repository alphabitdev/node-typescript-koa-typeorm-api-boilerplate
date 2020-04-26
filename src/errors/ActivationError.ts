import AppError from './AppError';

export default class ActivationError extends AppError {
  constructor() {
    super(30004, 'User not activated');
  }
}
