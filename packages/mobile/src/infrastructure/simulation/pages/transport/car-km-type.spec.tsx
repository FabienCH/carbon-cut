import { fireEvent, render, screen, waitFor, within } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { selectSimulationAnswers } from '@adapters/simulation-results/store/selectors/simulation-selectors';
import { appStore } from '@adapters/commons/store/app-store';
import CarKmType from './car-km-type';
import MockTheme from '@tests/theme-mock';
import { unselectedAnswerStyle } from '@tests/answer';
import { EngineType } from 'carbon-cut-commons';

describe('CarKmType component', () => {
  beforeEach(() => {
    render(
      <Provider store={appStore}>
        <MockTheme>
          <CarKmType containerStyle={{}} />
        </MockTheme>
      </Provider>,
    );
  });

  it('should display a list of answers', () => {
    const expectedEngineTypeAnswers = ['Thermique (diesel/essence)', 'Hybride', 'Electrique'];

    const answers = screen.getAllByRole('radio');
    answers.forEach((answer, idx) => {
      const chipStyle = answer.props.children[0].props.style;
      const textElement = within(answer).getByText(expectedEngineTypeAnswers[idx]);

      expect(chipStyle).toEqual(expect.objectContaining(unselectedAnswerStyle));
      expect(textElement.props.children).toEqual(expectedEngineTypeAnswers[idx]);
    });

    const expectedKmAnswerPlaceholderElem = screen.getByPlaceholderText(/km \/ an/);
    expect(expectedKmAnswerPlaceholderElem.props.placeholder).toBeTruthy();
  });

  it('should display a disable submit answer button', () => {
    const submitButton = screen.getByRole('button');

    expect(submitButton.props.accessibilityState.disabled).toBeTruthy();
  });

  it('should display an error message if the km answer is a text', () => {
    const expectedKmAnswerPlaceholderElem = screen.getByPlaceholderText(/km \/ an/);

    fireEvent.changeText(expectedKmAnswerPlaceholderElem, 'abc');

    const errorMessage = screen.getByText('Veuillez saisir un nombre');
    expect(errorMessage).toBeTruthy();
  });

  it('should display an error message if the km answer is not a valid number', () => {
    const expectedKmAnswerPlaceholderElem = screen.getByPlaceholderText(/km \/ an/);

    fireEvent.changeText(expectedKmAnswerPlaceholderElem, '-1');

    const errorMessage = screen.getByText('Veuillez saisir un nombre positif');
    expect(errorMessage).toBeTruthy();
  });

  it('should enable submit answer button if all answers are valid', () => {
    const submitButton = screen.getByRole('button');

    fillValidForm({ engineTypeIdx: 1 });

    expect(submitButton.props.accessibilityState.disabled).toBeFalsy();
  });

  it('should not enable submit answer button if one of the answer is not valid', () => {
    const submitButton = screen.getByRole('button');
    const expectedKmAnswerPlaceholderElem = screen.getByPlaceholderText(/km \/ an/);

    fireEvent.changeText(expectedKmAnswerPlaceholderElem, '100');

    expect(submitButton.props.accessibilityState.disabled).toBeTruthy();
  });

  it('should save the answer to store', async () => {
    const submitButton = screen.getByRole('button');

    fillValidForm({ engineTypeIdx: 1 });
    fireEvent.press(submitButton);

    await waitFor(() => {
      const simulationAnswers = selectSimulationAnswers();
      expect(simulationAnswers?.transport.carUsage).toEqual({ km: 100, engineType: EngineType.hybrid });
    });
  });

  function fillValidForm({ engineTypeIdx }: { engineTypeIdx: number }) {
    const expectedKmAnswerPlaceholderElem = screen.getByPlaceholderText(/km \/ an/);
    const engineTypeAnswers = screen.getAllByRole('radio');
    fireEvent.changeText(expectedKmAnswerPlaceholderElem, '100');
    fireEvent.press(engineTypeAnswers[engineTypeIdx]);
  }
});
