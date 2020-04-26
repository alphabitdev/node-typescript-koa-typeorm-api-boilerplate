import AppError from './AppError';

export default class PermissionError extends AppError {
  constructor(error?: Error) {
    super(30003, 'Permission denied', error);
  }
}
