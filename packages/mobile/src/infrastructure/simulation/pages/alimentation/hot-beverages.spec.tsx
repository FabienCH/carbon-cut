import 'reflect-metadata';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import HotBeverages from './hot-beverages';
import { NavigationProp } from '@react-navigation/native';
import { selectSimulationAnswers } from '../../../../adapters/simulation-results/store/selectors/simulation-selectors';
import { appStore } from '../../../../adapters/commons/store/app-store';
import { RootStackParamList, Routes } from '../../../root-navigation';
import MockTheme from '../../../../tests/theme-mock';

describe('HotBeverages component', () => {
  beforeEach(() => {
    render(
      <Provider store={appStore}>
        <MockTheme>
          <HotBeverages
            navigation={{ navigate: () => {} } as NavigationProp<RootStackParamList, Routes.HotBeverages>}
            containerStyle={{}}
          />
        </MockTheme>
      </Provider>,
    );
  });

  it('should display a list of answers', () => {
    const expectedLabels = ['Café', 'Thé', 'Chocolat chaud'];
    const expectedPlaceholders = ['Cafés / semaine', 'Thés / semaine', 'Chocolat chaud / semaine'];

    const labelElements = screen.getAllByText(/Café|Thé|Chocolat chaud/);
    const placeholderElements = screen.getAllByPlaceholderText(/\/ semaine/);

    labelElements.forEach((labelElem, idx) => {
      expect(labelElem.props.children).toEqual(expectedLabels[idx]);
      expect(placeholderElements[idx].props.placeholder).toEqual(expectedPlaceholders[idx]);
    });
  });

  it('should display a disable submit answer button', () => {
    const submitButton = screen.getByRole('button');

    expect(submitButton.props.accessibilityState.disabled).toBeTruthy();
  });

  it('should display an error message if one of the answer is missing', () => {
    const placeholderElements = screen.getAllByPlaceholderText(/\/ semaine/);

    placeholderElements.forEach((placeholderElem, idx) => {
      const value = idx === 0 ? null : '7';
      fireEvent.changeText(placeholderElem, value);
    });

    const errorMessage = screen.getByText('Veuillez saisir un nombre');
    expect(errorMessage).toBeTruthy();
  });

  it('should display an error message if one of the answer is a text', () => {
    const placeholderElements = screen.getAllByPlaceholderText(/\/ semaine/);

    placeholderElements.forEach((placeholderElem, idx) => {
      const value = idx === 0 ? 'abc' : '7';
      fireEvent.changeText(placeholderElem, value);
    });

    const errorMessage = screen.getByText('Veuillez saisir un nombre');
    expect(errorMessage).toBeTruthy();
  });

  it('should display an error message if one of the answer is not a valid number', () => {
    const placeholderElements = screen.getAllByPlaceholderText(/\/ semaine/);

    placeholderElements.forEach((placeholderElem, idx) => {
      const value = idx === 0 ? '-1' : '7';
      fireEvent.changeText(placeholderElem, value);
    });

    const errorMessage = screen.getByText('Veuillez saisir un nombre positif');
    expect(errorMessage).toBeTruthy();
  });

  it('should enable submit answer button if all answers are valid', () => {
    const submitButton = screen.getByRole('button');
    const placeholderElements = screen.getAllByPlaceholderText(/\/ semaine/);

    placeholderElements.forEach((placeholderElem) => {
      fireEvent.changeText(placeholderElem, '7');
    });

    expect(submitButton.props.accessibilityState.disabled).toBeFalsy();
  });

  it('should not enable submit answer button if one of the answer is not valid', () => {
    const submitButton = screen.getByRole('button');
    const placeholderElements = screen.getAllByPlaceholderText(/\/ semaine/);
    const answers = ['7', 'abc', '5'];

    placeholderElements.forEach((placeholderElem, idx) => {
      fireEvent.changeText(placeholderElem, answers[idx]);
    });

    expect(submitButton.props.accessibilityState.disabled).toBeTruthy();
  });

  it('should save the answer to store', async () => {
    const submitButton = screen.getByRole('button');
    const placeholderElements = screen.getAllByPlaceholderText(/\/ semaine/);

    placeholderElements.forEach((placeholderElem) => {
      fireEvent.changeText(placeholderElem, '7');
    });
    fireEvent.press(submitButton);

    await waitFor(() => {
      const simulationAnswers = selectSimulationAnswers();
      expect(simulationAnswers?.alimentation.hotBeverages).toEqual({
        coffee: 7,
        tea: 7,
        hotChocolate: 7,
      });
    });
  });
});
