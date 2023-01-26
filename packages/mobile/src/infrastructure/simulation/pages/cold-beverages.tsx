import { ColdBeveragesAnswer } from 'carbon-cut-commons';
import { useEffect, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useSelector } from 'react-redux';
import { selectIsLoading } from '../../../adapters/commons/store/selectors/loading-selectors';
import {
  ColdBeveragesViewModel,
  WebColdBeveragesQuestionPresenter,
} from '../../../adapters/simulation/presenters/web-cold-beverages-question.presenter';
import { ColdBeveragesQuestionPresenterToken } from '../../../domain/ports/presenters/question.presenter';
import {
  CarbonFootprintSimulationUseCase,
  CarbonFootprintSimulationUseCaseToken,
} from '../../../domain/usecases/carbon-footprint-simulation.usescase';
import { SaveSimulationAnswerUseCase, SaveSimulationAnswerUseCaseToken } from '../../../domain/usecases/save-simulation-answer.usecase';
import { SetInputAnswerUseCase, SetInputAnswerUseCaseToken } from '../../../domain/usecases/set-input-answer.usecase';
import { diContainer } from '../../inversify.config';
import InputAnswers from '../components/input-answers';
import Question from '../components/question';
import SubmitButton from '../components/submit-button';

export type ColdBeveragesKeys = keyof ColdBeveragesAnswer;

export default function ColdBeverages({ containerStyle }: { containerStyle: StyleProp<ViewStyle> }) {
  const [presenter] = useState<WebColdBeveragesQuestionPresenter>(
    diContainer.get<WebColdBeveragesQuestionPresenter>(ColdBeveragesQuestionPresenterToken),
  );
  const [setInputAnswerUseCase] = useState<SetInputAnswerUseCase>(diContainer.get<SetInputAnswerUseCase>(SetInputAnswerUseCaseToken));
  const [saveSimulationAnswerUseCase] = useState<SaveSimulationAnswerUseCase>(
    diContainer.get<SaveSimulationAnswerUseCase>(SaveSimulationAnswerUseCaseToken),
  );
  const [carbonFootprintSimulationUseCase] = useState<CarbonFootprintSimulationUseCase>(
    diContainer.get<CarbonFootprintSimulationUseCase>(CarbonFootprintSimulationUseCaseToken),
  );

  const [viewModel, updateViewModel] = useState<ColdBeveragesViewModel>(presenter.viewModel);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    presenter.onViewModelChanges(updateViewModel);
  }, [presenter, presenter.viewModel]);

  const setAnswer = (value: string, id: ColdBeveragesKeys, questionIndex: number): void => {
    setInputAnswerUseCase.execute(presenter, { id, value }, questionIndex);
  };

  const runCalculation = (): void => {
    saveSimulationAnswerUseCase.execute({ answerKey: 'coldBeverages', answer: presenter.answerValues });
    carbonFootprintSimulationUseCase.execute();
  };

  return (
    <View style={containerStyle}>
      {viewModel.questions.map((q, qIdx) => {
        const questionStyle = qIdx !== 0 ? styles.question : null;
        return (
          <Question key={qIdx} question={q.question} style={questionStyle}>
            <InputAnswers answers={[q.answer]} answerChanged={(value, answerKey) => setAnswer(value, answerKey, qIdx)} />
          </Question>
        );
      })}
      <SubmitButton
        isLastQuestion={true}
        canSubmit={viewModel.canSubmit}
        isLoading={isLoading}
        nextButtonClicked={() => runCalculation()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  question: {
    marginTop: 10,
  },
});
