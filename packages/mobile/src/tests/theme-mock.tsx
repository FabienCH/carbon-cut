import { ThemeProvider } from '@rneui/themed';
import { theme } from '../infrastructure/app/theme';

function MockTheme({ children }: any) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default MockTheme;
