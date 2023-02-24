import 'reflect-metadata';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { RootSiblingParent } from 'react-native-root-siblings';
import { selectIsLoading } from '../../../../adapters/commons/store/selectors/loading-selectors';
import {
  selectSimulationAnswers,
  selectSimulationResults,
} from '../../../../adapters/simulation-results/store/selectors/simulation-selectors';
import { CarbonFootprintGatewayToken } from '../../../../domain/ports/gateways/carbon-footprint.gateway';
import { InMemoryCarbonFootprintGateway } from '../../../../tests/in-memory-carbon-footprint.gateway';
import { appStore } from '../../../../adapters/commons/store/app-store';
import { diContainer } from '../../../inversify.config';
import MockTheme from '../../../../tests/theme-mock';
import { unselectedAnswerStyle } from '../../../../tests/answer';
import { FuelType } from 'carbon-cut-commons';
import FuelCarConsumption from './fuel-car-consumption';

describe('CarKmType component', () => {
  beforeAll(() => {
    diContainer.unbind(CarbonFootprintGatewayToken);
    diContainer.bind(CarbonFootprintGatewayToken).to(InMemoryCarbonFootprintGateway);
  });

  beforeEach(() => {
    render(
      <Provider store={appStore}>
        <MockTheme>
          <FuelCarConsumption containerStyle={{}} />
        </MockTheme>
      </Provider>,
    );
  });

  it('should display a list of answers', () => {
    const expectedFuelTypeAnswers = ['Diesel', 'Essence E10', 'Essence E85'];

    const answers = screen.getAllByRole('radio');
    answers.forEach((answer, idx) => {
      const chipStyle = answer.props.children[0].props.style;
      const textElement = within(answer).getByText(expectedFuelTypeAnswers[idx]);

      expect(chipStyle).toEqual(expect.objectContaining(unselectedAnswerStyle));
      expect(textElement.props.children).toEqual(expectedFuelTypeAnswers[idx]);
    });

    const expectedKmAnswerPlaceholderElem = screen.getByPlaceholderText(/l \/ 100 km/);
    expect(expectedKmAnswerPlaceholderElem.props.placeholder).toBeTruthy();
  });

  it('should display a disable submit answer button', () => {
    const submitButton = screen.getByRole('button');

    expect(submitButton.props.accessibilityState.disabled).toBeTruthy();
  });

  it('should display an error message if the fuel consumption answer is a text', () => {
    const expectedKmAnswerPlaceholderElem = screen.getByPlaceholderText(/l \/ 100 km/);

    fireEvent.changeText(expectedKmAnswerPlaceholderElem, 'abc');

    const errorMessage = screen.getByText('Veuillez saisir un nombre');
    expect(errorMessage).toBeTruthy();
  });

  it('should display an error message if the fuel consumption answer is not a valid number', () => {
    const expectedKmAnswerPlaceholderElem = screen.getByPlaceholderText(/l \/ 100 km/);

    fireEvent.changeText(expectedKmAnswerPlaceholderElem, '-1');

    const errorMessage = screen.getByText('Veuillez saisir un nombre positif');
    expect(errorMessage).toBeTruthy();
  });

  it('should enable submit answer button if all answers are valid', () => {
    const submitButton = screen.getByRole('button');

    fillValidForm();

    expect(submitButton.props.accessibilityState.disabled).toBeFalsy();
  });

  it('should not enable submit answer button if one of the answer is not valid', () => {
    const submitButton = screen.getByRole('button');
    const expectedKmAnswerPlaceholderElem = screen.getByPlaceholderText(/l \/ 100 km/);

    fireEvent.changeText(expectedKmAnswerPlaceholderElem, '8');

    expect(submitButton.props.accessibilityState.disabled).toBeTruthy();
  });

  it('should run calculation and save the simulation results to store', async () => {
    const submitButton = screen.getByRole('button');

    fillValidForm();
    fireEvent.press(submitButton);

    expect(selectIsLoading()).toBeTruthy();

    await waitFor(() => {
      const simulationAnswers = selectSimulationAnswers();
      expect(simulationAnswers?.transport.car).toEqual({ fuelConsumption: 8, fuelType: FuelType.essenceE10 });
      const results = selectSimulationResults();
      expect(selectIsLoading()).toBeFalsy();
      expect(results).toEqual({
        alimentation: {
          breakfast: 171.234,
          hotBeverages: { coffee: 124.14, tea: 32.4, hotChocolate: 80.57, total: 237.11 },
          coldBeverages: { sweet: 34.14, alcohol: 25.34, total: 59.48 },
          meals: {
            vegan: 859.575,
            vegetarian: 1220.925,
            whiteMeat: 1531.54,
            redMeat: 4022.3,
            whiteFish: 1728.64,
            fish: 1189.9,
            total: 10552.88,
          },
          total: 467.824,
        },
        transport: { car: 230, total: 230 },
        total: 697.824,
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
          <MockTheme>
            <RootSiblingParent>
              <FuelCarConsumption containerStyle={{}} />
            </RootSiblingParent>
          </MockTheme>
        </Provider>,
      );
    });

    it('should display an error message', async () => {
      const submitButton = screen.getByRole('button');

      fillValidForm();
      fireEvent.press(submitButton);

      await waitFor(() => {
        const expectedErrorMessage = screen.getByText("Une erreur s'est produite, vérifiez votre connexion");

        expect(selectIsLoading()).toBeFalsy();
        expect(expectedErrorMessage).toBeTruthy();
      });
    });
  });

  function fillValidForm() {
    const expectedKmAnswerPlaceholderElem = screen.getByPlaceholderText(/l \/ 100 km/);
    const fuelTypeAnswers = screen.getAllByRole('radio');
    fireEvent.changeText(expectedKmAnswerPlaceholderElem, '8');
    fireEvent.press(fuelTypeAnswers[1]);
  }
});
