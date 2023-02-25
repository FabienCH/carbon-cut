import 'reflect-metadata';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { MilkTypes } from 'carbon-cut-commons';
import MilkType from './milk-type';
import { NavigationProp } from '@react-navigation/native';
import { selectSimulationAnswers } from '../../../../adapters/simulation-results/store/selectors/simulation-selectors';
import { appStore } from '../../../../adapters/commons/store/app-store';
import { RootStackParamList, Routes } from '../../../root-navigation';
import { selectedAnswerStyle, unselectedAnswerStyle } from '../../../../tests/answer';
import MockTheme from '../../../../tests/theme-mock';

describe('MilkType component', () => {
  beforeEach(() => {
    render(
      <Provider store={appStore}>
        <MockTheme>
          <MilkType navigation={{ navigate: () => {} } as NavigationProp<RootStackParamList, Routes.MilkType>} containerStyle={{}} />
        </MockTheme>
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

  it('should save the answer to store', async () => {
    const submitButton = screen.getByRole('button');
    const answers = screen.getAllByRole('radio');
    const oatsMilkAnswer = answers[2];

    fireEvent.press(oatsMilkAnswer);
    fireEvent.press(submitButton);

    await waitFor(() => {
      const simulationAnswers = selectSimulationAnswers();
      expect(simulationAnswers?.alimentation.milkType).toEqual(MilkTypes.oatsMilk);
    });
  });
});
