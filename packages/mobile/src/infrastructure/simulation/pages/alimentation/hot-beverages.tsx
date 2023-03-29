import { StyleProp, View, ViewStyle } from 'react-native';
import InputAnswers from '../../components/input-answers';
import Question from '../../components/question';
import SubmitButton from '../../components/submit-button';
import { useEffect, useState } from 'react';
import {
  HotBeveragesKeys,
  HotBeverageViewModel,
  WebHotBeveragesQuestionPresenter,
} from '@adapters/simulation/presenters/alimentation/web-hot-beverages-question.presenter';
import { HotBeveragesQuestionPresenterToken } from '@domain/ports/presenters/question.presenter';
import { SaveSimulationAnswerUseCase, SaveSimulationAnswerUseCaseToken } from '@domain/usecases/save-simulation-answer.usecase';
import { diContainer } from '../../../inversify.config';
import { SetInputAnswerUseCase, SetInputAnswerUseCaseToken } from '@domain/usecases/set-input-answer.usecase';
import { AnswerValidator } from '@domain/entites/answer-validator';

export default function HotBeverages({ containerStyle }: { containerStyle: StyleProp<ViewStyle> }) {
  const [presenter] = useState<WebHotBeveragesQuestionPresenter>(
    diContainer.get<WebHotBeveragesQuestionPresenter>(HotBeveragesQuestionPresenterToken),
  );
  const [setInputAnswerUseCase] = useState<SetInputAnswerUseCase>(diContainer.get<SetInputAnswerUseCase>(SetInputAnswerUseCaseToken));
  const [saveSimulationAnswerUseCase] = useState<SaveSimulationAnswerUseCase>(
    diContainer.get<SaveSimulationAnswerUseCase>(SaveSimulationAnswerUseCaseToken),
  );
  const [viewModel, updateViewModel] = useState<HotBeverageViewModel>(presenter.viewModel);

  useEffect(() => {
    presenter.onViewModelChanges(updateViewModel);
  }, [presenter, presenter.viewModel]);

  const setAnswer = (value: string, id: HotBeveragesKeys): void => {
    setInputAnswerUseCase.execute(presenter, { id, value }, { answerValidatorsFn: [AnswerValidator.positiveNumberValidator] });
  };

  const saveAnswer = (): void => {
    saveSimulationAnswerUseCase.execute({ hotBeverages: presenter.answerValues });
  };

  return (
    <View style={containerStyle}>
      <Question question={viewModel.question}>
        <InputAnswers answers={viewModel.answers} answerChanged={(value, answerKey) => setAnswer(value, answerKey)} />
      </Question>
      <SubmitButton isLastQuestion={false} canSubmit={viewModel.canSubmit} nextButtonClicked={() => saveAnswer()} />
    </View>
  );
}
