import 'reflect-metadata';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { diContainer } from '../../inversify.config';
import { CarbonFootprintGatewayToken } from '../../../domain/ports/gateways/carbon-footprint.gateway';
import { InMemoryCarbonFootprintGateway } from '../../../tests/in-memory-carbon-footprint.gateway';
import { Provider } from 'react-redux';
import { appStore } from '../../store/app-store';
import HotBeverages from './hot-beverages';
import { selectSimulationResults } from '../../store/selectors/simulation-selectors';

describe('HotBeverages component', () => {
  beforeAll(() => {
    diContainer.unbind(CarbonFootprintGatewayToken);
    diContainer.bind(CarbonFootprintGatewayToken).to(InMemoryCarbonFootprintGateway);
  });

  beforeEach(() => {
    render(
      <Provider store={appStore}>
        <HotBeverages />
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

  it('should not enable submit answer button if on of the answer is not valid', () => {
    const submitButton = screen.getByRole('button');
    const placeholderElements = screen.getAllByPlaceholderText(/\/ semaine/);
    const answers = ['7', 'abc', '5'];

    placeholderElements.forEach((placeholderElem, idx) => {
      fireEvent.changeText(placeholderElem, answers[idx]);
    });

    expect(submitButton.props.accessibilityState.disabled).toBeTruthy();
  });

  it('should save the simulation results to store', async () => {
    const submitButton = screen.getByRole('button');
    const placeholderElements = screen.getAllByPlaceholderText(/\/ semaine/);

    placeholderElements.forEach((placeholderElem) => {
      fireEvent.changeText(placeholderElem, '7');
    });
    fireEvent.press(submitButton);

    await waitFor(() => {
      const results = selectSimulationResults();
      expect(results).toEqual({ breakfast: 171.234, beverages: { coffee: 124.14, tea: 32.4, hotChocolate: 80.57 }, total: 408.344 });
    });
  });
});
