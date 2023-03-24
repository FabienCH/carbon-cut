import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { selectSimulationAnswers } from '@adapters/simulation-results/store/selectors/simulation-selectors';
import { appStore } from '@adapters/commons/store/app-store';
import Meals from './meals';
import MockTheme from '@tests/theme-mock';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList, Routes } from '../../../root-navigation';

describe('Meals component', () => {
  beforeEach(() => {
    render(
      <Provider store={appStore}>
        <MockTheme>
          <Meals navigation={{ navigate: () => {} } as NavigationProp<RootStackParamList, Routes.Meals>} containerStyle={{}} />
        </MockTheme>
      </Provider>,
    );
  });

  it('should display a list of answers', () => {
    const mealsTypes = ['végétaliens', 'végétariens', 'viande blanche', 'viande rouge', 'poisson blanc', 'autres poissons'];
    const expectedPlaceholders = (mealsTypesIdx: number) => `Repas ${mealsTypes[mealsTypesIdx]} / semaine`;

    const placeholderElements = screen.getAllByPlaceholderText(/\/ semaine/);

    placeholderElements.forEach((placeholderElem, idx) => {
      expect(placeholderElem.props.placeholder).toEqual(expectedPlaceholders(idx));
    });
  });

  it('should display a disable submit answer button', () => {
    const submitButton = screen.getByRole('button');

    expect(submitButton.props.accessibilityState.disabled).toBeTruthy();
  });

  it('should display an error message if one of the answer is missing', () => {
    const placeholderElements = screen.getAllByPlaceholderText(/\/ semaine/);

    placeholderElements.forEach((placeholderElem, idx) => {
      const value = idx === 0 ? null : '2';
      fireEvent.changeText(placeholderElem, value);
    });

    const errorMessage = screen.getByText('Veuillez saisir un nombre');
    expect(errorMessage).toBeTruthy();
  });

  it('should display an error message if one of the answer is a text', () => {
    const placeholderElements = screen.getAllByPlaceholderText(/\/ semaine/);

    placeholderElements.forEach((placeholderElem, idx) => {
      const value = idx === 0 ? 'abc' : '2';
      fireEvent.changeText(placeholderElem, value);
    });

    const errorMessage = screen.getByText('Veuillez saisir un nombre');
    expect(errorMessage).toBeTruthy();
  });

  it('should display an error message if one of the answer is not a valid number', () => {
    const placeholderElements = screen.getAllByPlaceholderText(/\/ semaine/);

    placeholderElements.forEach((placeholderElem, idx) => {
      const value = idx === 0 ? '-1' : '2';
      fireEvent.changeText(placeholderElem, value);
    });

    const errorMessage = screen.getByText('Veuillez saisir un nombre positif');
    expect(errorMessage).toBeTruthy();
  });

  it('should display an error message if total of the answers is not 14', () => {
    const placeholderElements = screen.getAllByPlaceholderText(/\/ semaine/);

    placeholderElements.forEach((placeholderElem) => {
      fireEvent.changeText(placeholderElem, '2');
    });

    const errorMessage = screen.getByText('Le nombre de repas pour une semaine doit être de 14');
    expect(errorMessage).toBeTruthy();
  });

  it('should enable submit answer button if all answers are valid', () => {
    const submitButton = screen.getByRole('button');
    const placeholderElements = screen.getAllByPlaceholderText(/\/ semaine/);

    fillValidForm(placeholderElements);

    expect(submitButton.props.accessibilityState.disabled).toBeFalsy();
  });

  it('should not enable submit answer button if one of the answer is not valid', () => {
    const submitButton = screen.getByRole('button');
    const placeholderElements = screen.getAllByPlaceholderText(/\/ semaine/);
    const answers = ['zd', '2'];

    placeholderElements.forEach((placeholderElem, idx) => {
      fireEvent.changeText(placeholderElem, answers[idx]);
    });

    expect(submitButton.props.accessibilityState.disabled).toBeTruthy();
  });

  it('should save the answer to store', async () => {
    const submitButton = screen.getByRole('button');
    const placeholderElements = screen.getAllByPlaceholderText(/\/ semaine/);

    fillValidForm(placeholderElements);
    fireEvent.press(submitButton);

    await waitFor(() => {
      const simulationAnswers = selectSimulationAnswers();
      expect(simulationAnswers?.alimentation.meals).toEqual({ vegan: 3, vegetarian: 3, whiteMeat: 2, redMeat: 2, whiteFish: 2, fish: 2 });
    });
  });

  function fillValidForm(placeholderElements: any[]) {
    placeholderElements.forEach((placeholderElem, idx) => {
      const value = idx < 2 ? '3' : '2';
      fireEvent.changeText(placeholderElem, value);
    });
  }
});
