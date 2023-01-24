export const UserNotifyPresenterToken = Symbol.for('UserNotifyPresenter');
export const UserNotifyConfigToken = Symbol.for('UserNotifyConfigToken');

export interface UserNotifyPresenter {
  notifyError(message: string): void;
}
