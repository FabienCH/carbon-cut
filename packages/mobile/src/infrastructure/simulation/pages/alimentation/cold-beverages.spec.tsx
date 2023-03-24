import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import ColdBeverages from './cold-beverages';
import { selectSimulationAnswers } from '@adapters/simulation-results/store/selectors/simulation-selectors';
import { appStore } from '@adapters/commons/store/app-store';
import { RootStackParamList, Routes } from '../../../root-navigation';
import { NavigationProp } from '@react-navigation/native';
import MockTheme from '@tests/theme-mock';

describe('ColdBeverages component', () => {
  beforeEach(() => {
    render(
      <Provider store={appStore}>
        <MockTheme>
          <ColdBeverages
            navigation={{ navigate: () => {} } as NavigationProp<RootStackParamList, Routes.ColdBeverages>}
            containerStyle={{}}
          />
        </MockTheme>
      </Provider>,
    );
  });

  it('should display a list of answers', () => {
    const expectedPlaceholder = 'litres / semaine';

    const placeholderElements = screen.getAllByPlaceholderText(/\/ semaine/);

    placeholderElements.forEach((placeholderElem) => {
      expect(placeholderElem.props.placeholder).toEqual(expectedPlaceholder);
    });
  });

  it('should allow floating point number', () => {
    const placeholderElements = screen.getAllByPlaceholderText(/\/ semaine/);

    fireEvent.changeText(placeholderElements[0], '1.3');
    fireEvent.changeText(placeholderElements[1], '1,2');

    const errorMessage = screen.queryByText('Veuillez saisir un nombre positif');
    expect(errorMessage).toBeNull();
    expect(placeholderElements[0].props.value).toEqual('1.3');
    expect(placeholderElements[1].props.value).toEqual('1.2');
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

  it('should enable submit answer button if all answers are valid', () => {
    const submitButton = screen.getByRole('button');
    const placeholderElements = screen.getAllByPlaceholderText(/\/ semaine/);

    placeholderElements.forEach((placeholderElem) => {
      fireEvent.changeText(placeholderElem, '2');
    });

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

    placeholderElements.forEach((placeholderElem) => {
      fireEvent.changeText(placeholderElem, '2');
    });
    fireEvent.press(submitButton);

    await waitFor(() => {
      const simulationAnswers = selectSimulationAnswers();
      expect(simulationAnswers?.alimentation.coldBeverages).toEqual({ sweet: 2, alcohol: 2 });
    });
  });
});
