import 'reflect-metadata';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react-native';
import Breakfast from './breakfast';
import { Provider } from 'react-redux';
import { BreakfastTypes } from 'carbon-cut-commons';
import { NavigationProp } from '@react-navigation/native';
import { selectSimulationAnswers } from '../../../adapters/simulation-results/store/selectors/simulation-selectors';
import { appStore } from '../../../adapters/commons/store/app-store';
import { RootStackParamList, Routes } from '../../root-navigation';

describe('Breakfast component', () => {
  const unselectedAnswerStyle = {
    backgroundColor: 'transparent',
    borderColor: '#2089dc',
  };

  beforeEach(() => {
    render(
      <Provider store={appStore}>
        <Breakfast navigation={{ navigate: () => {} } as NavigationProp<RootStackParamList, Routes.Breakfast>} />
      </Provider>,
    );
  });

  it('should display a list of answers', () => {
    const expectedAnswersText = [
      'Viennoiserie / Pain',
      'Céréales avec lait ou yaourt',
      'Salé (britannique)',
      'Fruits',
      'Pas de petit-déj. (hors boisson)',
    ];

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
    const expectedAnswersStyle = [
      unselectedAnswerStyle,
      selectedAnswerStyle,
      unselectedAnswerStyle,
      unselectedAnswerStyle,
      unselectedAnswerStyle,
    ];

    const answers = screen.getAllByRole('radio');
    const milkCerealAnswer = answers[1];

    fireEvent.press(milkCerealAnswer);

    answers.forEach((answer, idx) => {
      const chipStyle = answer.props.children[0].props.style;
      expect(chipStyle).toEqual(expect.objectContaining(expectedAnswersStyle[idx]));
    });
  });

  it('should enable the next answer button when user click on a Chip', () => {
    const submitButton = screen.getByRole('button');
    const answers = screen.getAllByRole('radio');
    const milkCerealAnswer = answers[1];

    fireEvent.press(milkCerealAnswer);

    expect(submitButton.props.accessibilityState.disabled).toBeFalsy();
  });

  it('should save the answer to store', async () => {
    const submitButton = screen.getByRole('button');
    const answers = screen.getAllByRole('radio');
    const milkCerealAnswer = answers[1];

    fireEvent.press(milkCerealAnswer);
    fireEvent.press(submitButton);

    await waitFor(() => {
      const simulationAnswers = selectSimulationAnswers();
      expect(simulationAnswers?.breakfast).toEqual(BreakfastTypes.milkCerealBreakfast);
    });
  });
});
