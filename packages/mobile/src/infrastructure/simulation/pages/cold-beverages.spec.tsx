import 'reflect-metadata';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import ColdBeverages from './cold-beverages';
import { RootSiblingParent } from 'react-native-root-siblings';
import { selectIsLoading } from '../../../adapters/commons/store/selectors/loading-selectors';
import {
  selectSimulationAnswers,
  selectSimulationResults,
} from '../../../adapters/simulation-results/store/selectors/simulation-selectors';
import { CarbonFootprintGatewayToken } from '../../../domain/ports/gateways/carbon-footprint.gateway';
import { InMemoryCarbonFootprintGateway } from '../../../tests/in-memory-carbon-footprint.gateway';
import { appStore } from '../../../adapters/commons/store/app-store';
import { diContainer } from '../../inversify.config';

describe('ColdBeverages component', () => {
  beforeAll(() => {
    diContainer.unbind(CarbonFootprintGatewayToken);
    diContainer.bind(CarbonFootprintGatewayToken).to(InMemoryCarbonFootprintGateway);
  });

  beforeEach(() => {
    render(
      <Provider store={appStore}>
        <ColdBeverages containerStyle={{}} />
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

    const errorMessage = screen.queryByText('Veuillez saisir un nombre positif');
    expect(errorMessage).toBeNull();
    expect(placeholderElements[0].props.value).toEqual('1.3');
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

  it('should run calculation and save the simulation results to store', async () => {
    const submitButton = screen.getByRole('button');
    const placeholderElements = screen.getAllByPlaceholderText(/\/ semaine/);

    placeholderElements.forEach((placeholderElem) => {
      fireEvent.changeText(placeholderElem, '2');
    });
    fireEvent.press(submitButton);

    expect(selectIsLoading()).toBeTruthy();

    await waitFor(() => {
      const simulationAnswers = selectSimulationAnswers();
      expect(simulationAnswers?.coldBeverages).toEqual({ sweet: 2, alcohol: 2 });
      const results = selectSimulationResults();
      expect(selectIsLoading()).toBeFalsy();
      expect(results).toEqual({
        breakfast: 171.234,
        hotBeverages: { coffee: 124.14, tea: 32.4, hotChocolate: 80.57, total: 237.11 },
        coldBeverages: { sweet: 34.14, alcohol: 25.34, total: 59.48 },
        total: 467.824,
      });
    });
  });

  describe('If carbon footprint calculation fails', () => {
    beforeEach(() => {
      diContainer.unbind(CarbonFootprintGatewayToken);
      diContainer.bind(CarbonFootprintGatewayToken).toConstantValue({
        calculate: () => {
          throw new Error();
        },
      });

      render(
        <Provider store={appStore}>
          <RootSiblingParent>
            <ColdBeverages containerStyle={{}} />
          </RootSiblingParent>
        </Provider>,
      );
    });

    it('should display an error message', async () => {
      const submitButton = screen.getByRole('button');
      const placeholderElements = screen.getAllByPlaceholderText(/\/ semaine/);

      placeholderElements.forEach((placeholderElem) => {
        fireEvent.changeText(placeholderElem, '2');
      });
      fireEvent.press(submitButton);

      await waitFor(() => {
        const expectedErrorMessage = screen.getByText("Une erreur s'est produite, vérifiez votre connexion");

        expect(selectIsLoading()).toBeFalsy();
        expect(expectedErrorMessage).toBeTruthy();
      });
    });
  });
});
