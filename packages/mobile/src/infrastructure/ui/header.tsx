import { StyleSheet } from 'react-native';
import { Header as HeaderRNE } from '@rneui/themed';

function Header() {
  return (
    <HeaderRNE
      leftComponent={{
        iconStyle: styles.menu,
        icon: 'menu',
        color: '#fff',
      }}
      centerComponent={{ text: 'Carbon Cut', style: styles.heading }}
      centerContainerStyle={styles.headingContainer}
    />
  );
}

export default Header;

const styles = StyleSheet.create({
  menu: {
    fontSize: 34,
  },
  headingContainer: { justifyContent: 'center' },
  heading: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
