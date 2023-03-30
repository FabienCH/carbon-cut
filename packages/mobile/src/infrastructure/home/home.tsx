import { Button, Colors, Theme, useTheme } from '@rneui/themed';
import { Image, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import type { NavigationProp } from '@react-navigation/native';
import { AllRoutes, RootStackParamList, Route } from '../root-navigation';

type HomeNavigationProp = NavigationProp<RootStackParamList, Route<'Home'>>;
type HomeProps = {
  navigation: HomeNavigationProp;
  containerStyle: StyleProp<ViewStyle>;
};

export default function Home({ navigation, containerStyle }: HomeProps) {
  const { theme } = useTheme();
  return (
    <View style={containerStyle}>
      <Image style={styles.image} source={require('../app/assets/carbon-cut.png')} />
      <Text style={titleStyles(theme).title}>Réduisons votre empreinte carbone !</Text>
      <Text style={styles.description}>
        Carbon Cut vous permet d'estimer votre empreinte carbone annuelle, de l'affiner tout au long de l'année et vous donne des pistes
        afin de la réduire.
      </Text>
      <Text style={styles.emphasis}>Commençons par calculer votre empreinte actuelle</Text>
      <Button
        accessibilityRole="button"
        titleStyle={styles.button}
        size="lg"
        onPress={() => navigation.navigate(AllRoutes.Breakfast, { containerStyle })}
      >
        C'est parti !
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    marginBottom: 50,
    maxWidth: '100%',
    resizeMode: 'contain',
  },
  description: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 30,
  },
  emphasis: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    fontSize: 20,
  },
});

const titleStyles = (
  theme: {
    colors: Colors;
  } & Theme,
) =>
  StyleSheet.create({
    title: { fontSize: 26, marginBottom: 20, fontWeight: 'bold', textAlign: 'center', color: theme.colors.primary },
  });
