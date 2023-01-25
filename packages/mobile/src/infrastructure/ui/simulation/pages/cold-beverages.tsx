import { Button, Text, Input } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  ColdBeveragesKeys,
  WebColdBeveragesQuestionPresenter,
} from '../../../../adapters/presenters/simulation/web-cold-beverages-question.presenter';
import { Answer, ColdBeveragesQuestionPresenterToken } from '../../../../domain/ports/presenters/question.presenter';
import {
  CarbonFootprintSimulationUseCase,
  CarbonFootprintSimulationUseCaseToken,
} from '../../../../domain/usecases/carbon-footprint-simulation.usescase';
import { SaveSimulationAnswerUseCase, SaveSimulationAnswerUseCaseToken } from '../../../../domain/usecases/save-simulation-answer.usecase';
import { diContainer } from '../../../inversify.config';
import { saveAnswer } from '../../../store/actions/simulation-actions';
import { selectIsLoading } from '../../../store/selectors/loading-selectors';
import InputAnswers from '../components/input-answers';
import Question from '../components/question';
import SubmitButton from '../components/submit-button';

type ColdBeveragesQuestion = { question: string; answers: Answer<ColdBeveragesKeys, string | null>[] };

export default function ColdBeverages() {
  const [presenter] = useState<WebColdBeveragesQuestionPresenter>(
    diContainer.get<WebColdBeveragesQuestionPresenter>(ColdBeveragesQuestionPresenterToken),
  );
  const [saveSimulationAnswerUseCase] = useState<SaveSimulationAnswerUseCase>(
    diContainer.get<SaveSimulationAnswerUseCase>(SaveSimulationAnswerUseCaseToken),
  );
  const [carbonFootprintSimulationUseCase] = useState<CarbonFootprintSimulationUseCase>(
    diContainer.get<CarbonFootprintSimulationUseCase>(CarbonFootprintSimulationUseCaseToken),
  );
  const isLoading = useSelector(selectIsLoading);

  const [questions, updateQuestion] = useState<ColdBeveragesQuestion[]>(presenter.viewModel.questions);
  const { viewModel } = presenter;

  const setAnswer = (key: ColdBeveragesKeys, value: string, questionIndex: number): void => {
    presenter.setAnswer({ key, value }, questionIndex);
    updateQuestion(viewModel.questions);
  };

  const runCalculation = (): void => {
    saveSimulationAnswerUseCase.execute({ answerKey: 'coldBeverages', answer: presenter.getAnswers() });
    carbonFootprintSimulationUseCase.execute();
  };

  return (
    <View>
      {questions.map((q, qIdx) => (
        <Question key={qIdx} question={q.question}>
          <InputAnswers answers={q.answers} answerChanged={(answerKey, value) => setAnswer(answerKey, value, qIdx)} />
        </Question>
      ))}
      <SubmitButton
        isLastQuestion={true}
        canSubmit={viewModel.canSubmit}
        isLoading={isLoading}
        nextButtonClicked={() => runCalculation()}
      />
    </View>
  );
}
