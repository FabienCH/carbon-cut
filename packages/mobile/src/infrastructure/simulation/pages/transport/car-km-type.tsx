import { NavigationProp } from '@react-navigation/native';
import { EngineType } from 'carbon-cut-commons';
import { useEffect, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import {
  CarKmTypeAnswerViewModel,
  WebCarKmTypeQuestionPresenter,
} from '../../../../adapters/simulation/presenters/transport/web-car-km-type-question.presenter';
import { AnswerValidator } from '../../../../domain/entites/answer-validator';
import { Answer, CarKmTypeQuestionPresenterToken } from '../../../../domain/ports/presenters/question.presenter';
import { SaveSimulationAnswerUseCase, SaveSimulationAnswerUseCaseToken } from '../../../../domain/usecases/save-simulation-answer.usecase';
import { SetInputAnswerUseCase, SetInputAnswerUseCaseToken } from '../../../../domain/usecases/set-input-answer.usecase';
import { diContainer } from '../../../inversify.config';
import { RootStackParamList, Routes } from '../../../root-navigation';
import InputAnswers from '../../components/input-answers';
import Question from '../../components/question';
import SelectableAnswers from '../../components/selectable-answers';
import SubmitButton from '../../components/submit-button';

type CarKmTypeNavigationProp = NavigationProp<RootStackParamList, Routes.CarKmType>;
type CarKmTypeProps = {
  navigation: CarKmTypeNavigationProp;
  containerStyle: StyleProp<ViewStyle>;
};

export default function CarKmType({ navigation, containerStyle }: CarKmTypeProps) {
  const [presenter] = useState<WebCarKmTypeQuestionPresenter>(
    diContainer.get<WebCarKmTypeQuestionPresenter>(CarKmTypeQuestionPresenterToken),
  );
  const [setInputAnswerUseCase] = useState<SetInputAnswerUseCase>(diContainer.get<SetInputAnswerUseCase>(SetInputAnswerUseCaseToken));
  const [saveSimulationAnswerUseCase] = useState<SaveSimulationAnswerUseCase>(
    diContainer.get<SaveSimulationAnswerUseCase>(SaveSimulationAnswerUseCaseToken),
  );
  const [viewModel, updateViewModel] = useState<CarKmTypeAnswerViewModel>(presenter.viewModel);

  useEffect(() => {
    presenter.onViewModelChanges(updateViewModel);
  }, [presenter, presenter.viewModel]);

  const setAnswer = (value: string): void => {
    setInputAnswerUseCase.execute(presenter, { id: 'km', value }, { answerValidatorsFn: [AnswerValidator.positiveNumberValidator] });
  };

  const setSelectedEngineType = (answer: Answer<EngineType>): void => {
    presenter.setSelectedAnswer(answer.value);
  };

  const saveAnswer = (): void => {
    saveSimulationAnswerUseCase.execute({
      sector: 'transport',
      answerKey: 'car',
      answer: { ...presenter.answerValues, engineType: presenter.selectedAnswer },
    });
    navigation.navigate(presenter.getNextQuestion(), { containerStyle });
  };

  const { selectableQuestion, inputQuestion } = viewModel.questions;

  return (
    <View style={containerStyle}>
      <Question question={selectableQuestion.question}>
        <SelectableAnswers answers={selectableQuestion.answers} answerSelected={(answer) => setSelectedEngineType(answer)} />
      </Question>
      <Question question={inputQuestion.question}>
        <InputAnswers answers={[inputQuestion.answer]} answerChanged={(value) => setAnswer(value)} />
      </Question>
      <SubmitButton isLastQuestion={false} canSubmit={viewModel.canSubmit} nextButtonClicked={() => saveAnswer()} />
    </View>
  );
}
