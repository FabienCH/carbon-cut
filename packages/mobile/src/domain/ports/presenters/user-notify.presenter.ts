export const UserNotifyPresenterToken = Symbol.for('UserNotifyPresenter');

export interface UserNotifyPresenter {
  notifyError(message: string): void;
}
