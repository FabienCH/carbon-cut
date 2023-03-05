import 'reflect-metadata';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react-native';
import ElectricCarSize from './electric-car-size';
import { Provider } from 'react-redux';
import { CarSize, FuelType } from 'carbon-cut-commons';
import {
  selectSimulationAnswers,
  selectSimulationResults,
} from '../../../../adapters/simulation-results/store/selectors/simulation-selectors';
import { appStore } from '../../../../adapters/commons/store/app-store';
import { selectedAnswerStyle, unselectedAnswerStyle } from '../../../../tests/answer';
import MockTheme from '../../../../tests/theme-mock';
import { selectIsLoading } from '../../../../adapters/commons/store/selectors/loading-selectors';
import { CarbonFootprintGatewayToken } from '../../../../domain/ports/gateways/carbon-footprint.gateway';
import { InMemoryCarbonFootprintGateway } from '../../../../tests/in-memory-carbon-footprint.gateway';
import { diContainer } from '../../../inversify.config';
import { RootSiblingParent } from 'react-native-root-siblings';

describe('ElectricCarSize component', () => {
  beforeAll(() => {
    diContainer.unbind(CarbonFootprintGatewayToken);
    diContainer.bind(CarbonFootprintGatewayToken).to(InMemoryCarbonFootprintGateway);
  });

  beforeEach(() => {
    render(
      <Provider store={appStore}>
        <MockTheme>
          <ElectricCarSize containerStyle={{}} />
        </MockTheme>
      </Provider>,
    );
  });

  it('should display a list of answers', () => {
    const expectedAnswersText = ['Petite', 'Moyenne', 'Berline', 'SUV'];

    const answers = screen.getAllByRole('radio');
    answers.forEach((answer, idx) => {
      const chipStyle = answer.props.children[0].props.style;
      const textElement = within(answer).getByText(expectedAnswersText[idx]);

      expect(chipStyle).toEqual(expect.objectContaining(unselectedAnswerStyle));
      expect(textElement.props.children).toEqual(expectedAnswersText[idx]);
    });
  });

  it('should display a disable next question button', () => {
    const submitButton = screen.getByRole('button');

    expect(submitButton.props.accessibilityState.disabled).toBeTruthy();
  });

  it('should select an answer when user click on a Chip', () => {
    const expectedAnswersStyle = [unselectedAnswerStyle, selectedAnswerStyle, unselectedAnswerStyle, unselectedAnswerStyle];

    const answers = screen.getAllByRole('radio');
    const mediumSizeAnswer = answers[1];

    fireEvent.press(mediumSizeAnswer);

    answers.forEach((answer, idx) => {
      const chipStyle = answer.props.children[0].props.style;
      expect(chipStyle).toEqual(expect.objectContaining(expectedAnswersStyle[idx]));
    });
  });

  it('should enable the next answer button when user click on a Chip', () => {
    const submitButton = screen.getByRole('button');

    fillValidForm();

    expect(submitButton.props.accessibilityState.disabled).toBeFalsy();
  });

  it('should run calculation and save the simulation results to store', async () => {
    const submitButton = screen.getByRole('button');

    fillValidForm();
    fireEvent.press(submitButton);

    expect(selectIsLoading()).toBeTruthy();

    await waitFor(() => {
      const simulationAnswers = selectSimulationAnswers();
      expect(simulationAnswers?.transport.car).toEqual({ carSize: CarSize.SUV });
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
              <ElectricCarSize containerStyle={{}} />
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
    const carSizeAnswers = screen.getAllByRole('radio');
    fireEvent.press(carSizeAnswers[3]);
  }
});
