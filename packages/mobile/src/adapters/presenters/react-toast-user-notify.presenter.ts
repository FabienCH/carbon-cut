import { injectable } from 'inversify';
import Toast from 'react-native-root-toast';
import { UserNotifyPresenter } from '../../domain/ports/presenters/user-notify.presenter';
import { theme } from '../../infrastructure/ui/theme';

@injectable()
export class ReactToastUserNotifyPresenter implements UserNotifyPresenter {
  notifyError(message: string): void {
    Toast.show(message, { duration: 30000, position: -30, opacity: 0.9, backgroundColor: theme.darkColors?.error });
  }
}
