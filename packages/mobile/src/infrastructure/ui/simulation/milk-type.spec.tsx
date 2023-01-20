import 'reflect-metadata';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { appStore } from '../../store/app-store';
import { selectSimulationAnswers, selectSimulationResults } from '../../store/selectors/simulation-selectors';
import { MilkTypes } from 'carbon-cut-commons';
import MilkType from './milk-type';
import { selectIsLoading } from '../../store/selectors/loading-selectors';
import { CarbonFootprintGatewayToken } from '../../../domain/ports/gateways/carbon-footprint.gateway';
import { diContainer } from '../../inversify.config';
import { RootSiblingParent } from 'react-native-root-siblings';
import { InMemoryCarbonFootprintGateway } from '../../../tests/in-memory-carbon-footprint.gateway';

describe('MilkType component', () => {
  const unselectedAnswerStyle = {
    backgroundColor: 'transparent',
    borderColor: '#2089dc',
  };

  beforeAll(() => {
    diContainer.unbind(CarbonFootprintGatewayToken);
    diContainer.bind(CarbonFootprintGatewayToken).to(InMemoryCarbonFootprintGateway);
  });

  beforeEach(() => {
    render(
      <Provider store={appStore}>
        <MilkType />
      </Provider>,
    );
  });

  it('should display a list of answers', () => {
    const expectedAnswersText = ['Lait de vache', 'Lait de soja', "Lait de d'avoine"];

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
    const selectedAnswerStyle = {
      backgroundColor: '#2089dc',
      borderColor: '#2089dc',
    };
    const expectedAnswersStyle = [unselectedAnswerStyle, selectedAnswerStyle, unselectedAnswerStyle];

    const answers = screen.getAllByRole('radio');
    const sojaMilkAnswer = answers[1];

    fireEvent.press(sojaMilkAnswer);

    answers.forEach((answer, idx) => {
      const chipStyle = answer.props.children[0].props.style;
      expect(chipStyle).toEqual(expect.objectContaining(expectedAnswersStyle[idx]));
    });
  });

  it('should enable the next answer button when user click on a Chip', () => {
    const submitButton = screen.getByRole('button');
    const answers = screen.getAllByRole('radio');
    const sojaMilkAnswer = answers[1];

    fireEvent.press(sojaMilkAnswer);

    expect(submitButton.props.accessibilityState.disabled).toBeFalsy();
  });

  it('should run calculation and save the simulation results to store', async () => {
    const submitButton = screen.getByRole('button');
    const answers = screen.getAllByRole('radio');
    const oatsMilkAnswer = answers[2];

    fireEvent.press(oatsMilkAnswer);
    fireEvent.press(submitButton);

    expect(selectIsLoading()).toBeTruthy();

    await waitFor(() => {
      const simulationAnswers = selectSimulationAnswers();
      expect(simulationAnswers?.milkType).toEqual(MilkTypes.oatsMilk);
      const results = selectSimulationResults();
      expect(selectIsLoading()).toBeFalsy();
      expect(results).toEqual({
        breakfast: 171.234,
        hotBeverages: { coffee: 124.14, tea: 32.4, hotChocolate: 80.57 },
        total: 408.344,
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
            <MilkType />
          </RootSiblingParent>
        </Provider>,
      );
    });

    it('should display an error message', async () => {
      const submitButton = screen.getByRole('button');
      const answers = screen.getAllByRole('radio');
      const oatsMilkAnswer = answers[2];

      fireEvent.press(oatsMilkAnswer);
      fireEvent.press(submitButton);

      await waitFor(() => {
        const expectedErrorMessage = screen.getByText("Une erreur s'est produite, vérifiez votre connexion");

        expect(selectIsLoading()).toBeFalsy();
        expect(expectedErrorMessage).toBeTruthy();
      });
    });
  });
});
