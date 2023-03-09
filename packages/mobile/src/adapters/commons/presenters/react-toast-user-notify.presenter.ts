import { UserNotifyConfigToken, UserNotifyPresenter } from '@domain/ports/presenters/user-notify.presenter';
import { inject, injectable } from 'inversify';
import Toast from 'react-native-root-toast';

@injectable()
export class ReactToastUserNotifyPresenter implements UserNotifyPresenter {
  constructor(@inject(UserNotifyConfigToken) private readonly config: { backgroundColor: string | undefined }) {}
  notifyError(message: string): void {
    Toast.show(message, { duration: 30000, position: -30, opacity: 0.9, backgroundColor: this.config.backgroundColor });
  }
}
