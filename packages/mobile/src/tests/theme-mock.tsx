import { ThemeProvider } from '@rneui/themed';
import { theme } from '../infrastructure/ui/theme';

function MockTheme({ children }: any) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default MockTheme;
