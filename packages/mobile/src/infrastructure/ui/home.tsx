import { Button, Colors, Theme, useTheme } from '@rneui/themed';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function Home() {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('./assets/carbon-cut.png')} />
      <Text style={titleStyles(theme).title}>Réduisons votre empreinte carbone !</Text>
      <Text style={styles.description}>
        Carbon Cut vous permet d'estimer votre empreinte carbone annuelle, de l'affiner tout au long de l'année et vous donne des pistes
        afin de la réduire.
      </Text>
      <Text style={styles.emphasis}>Commençons par calculer votre empreinte actuelle</Text>
      <Button titleStyle={styles.button} size="lg">
        C'est parti !
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  image: {
    marginBottom: 50,
    maxWidth: '100%',
    resizeMode: 'contain',
  },
  description: {
    fontSize: 16,
    marginBottom: 50,
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
