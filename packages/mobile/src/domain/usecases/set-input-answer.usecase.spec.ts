import { FakeInputQuestionPresenter } from '@tests/fake-input-number-question.presenter';
import { AnswerValidator, AnswerValidatorsFn, FormValidatorsFn, PositiveNumberError } from '../entites/answer-validator';
import { InputAnswerValue } from '../ports/presenters/question.presenter';
import { SetInputAnswerUseCase } from './set-input-answer.usecase';

describe('Set input answer use case', () => {
  let setInputAnswerUseCase: SetInputAnswerUseCase;
  let fakeInputQuestionPresenter: FakeInputQuestionPresenter;
  let setAnswerSpy: jest.SpyInstance;
  let answerValidators: AnswerValidatorsFn[];
  let formValidators: FormValidatorsFn[];

  beforeEach(() => {
    setInputAnswerUseCase = new SetInputAnswerUseCase();
    fakeInputQuestionPresenter = new FakeInputQuestionPresenter();
    fakeInputQuestionPresenter.answerValues = { id: undefined };
    setAnswerSpy = jest.spyOn(fakeInputQuestionPresenter, 'setAnswer');
  });

  describe('With positive number validation', () => {
    beforeEach(() => {
      answerValidators = [AnswerValidator.positiveNumberValidator];
    });

    it('should allow 0', () => {
      const expectedCanSubmit = true;

      executeUseCase({ id: 'id', value: '0' });

      expectCallWithCanSubmit(expectedCanSubmit, { id: 'id', value: '0' });
    });

    it('should allow to submit number', () => {
      const expectedCanSubmit = true;

      executeUseCase({ id: 'id', value: '12' });

      expectCallWithCanSubmit(expectedCanSubmit, { id: 'id', value: '12' });
    });

    it('should allow dot floating point number', () => {
      const expectedCanSubmit = true;

      executeUseCase({ id: 'id', value: '1.3' });

      expectCallWithCanSubmit(expectedCanSubmit, { id: 'id', value: '1.3' });
    });

    it('should allow comma floating point number', () => {
      const expectedCanSubmit = true;

      executeUseCase({ id: 'id', value: '1,5' });

      expectCallWithCanSubmit(expectedCanSubmit, { id: 'id', value: '1,5' });
    });

    it('should not allow an empty value', () => {
      const expectedCanSubmit = false;

      executeUseCase({ id: 'id', value: undefined });

      expectCallWithCanSubmit(expectedCanSubmit, { id: 'id', value: undefined }, { error: 'isNotNumber' });
    });

    it('should not allow a text', () => {
      const expectedCanSubmit = false;

      executeUseCase({ id: 'id', value: 'adv' });

      expectCallWithCanSubmit(expectedCanSubmit, { id: 'id', value: 'adv' }, { error: 'isNotNumber' });
    });

    it('should not allow negative number', () => {
      const expectedCanSubmit = false;

      executeUseCase({ id: 'id', value: '-1' });

      expectCallWithCanSubmit(expectedCanSubmit, { id: 'id', value: '-1' }, { error: 'isNotPositive' });
    });

    describe('With multiple answers', () => {
      beforeEach(() => {
        fakeInputQuestionPresenter.answerValues = { id1: undefined, id2: undefined };
      });

      it('should allow to submit question if all answers are valid', () => {
        const expectedCanSubmit = true;

        executeUseCase({ id: 'id1', value: '0' });
        executeUseCase({ id: 'id2', value: '2' });

        expectSecondCallWithCanSubmit(expectedCanSubmit, { id: 'id2', value: '2' });
      });

      it('should not allow to submit question if one of the answer is empty', () => {
        const expectedCanSubmit = false;

        executeUseCase({ id: 'id2', value: '2' });

        expectCallWithCanSubmit(expectedCanSubmit, { id: 'id2', value: '2' });
      });

      it('should not allow to submit question if one of the answer not valid', () => {
        const expectedCanSubmit = false;

        executeUseCase({ id: 'id1', value: '-2' });
        executeUseCase({ id: 'id2', value: '2' });

        expectSecondCallWithCanSubmit(expectedCanSubmit, { id: 'id2', value: '2' });
      });
    });
  });

  describe('With all answers equal validation', () => {
    beforeEach(() => {
      formValidators = [(values) => AnswerValidator.isNumberEqualValidator(values, 6)];
      fakeInputQuestionPresenter.answerValues = { id1: undefined, id2: undefined };
    });

    it('should not allow somme of answers lower than specified', () => {
      const expectedCanSubmit = false;

      executeUseCase({ id: 'id1', value: '1.3' });
      executeUseCase({ id: 'id2', value: '3' });

      expectSecondCallWithCanSubmit(expectedCanSubmit, { id: 'id2', value: '3' });
    });

    it('should not allow somme of answers higher than specified', () => {
      const expectedCanSubmit = false;

      executeUseCase({ id: 'id1', value: '3.3' });
      executeUseCase({ id: 'id2', value: '3' });

      expectSecondCallWithCanSubmit(expectedCanSubmit, { id: 'id2', value: '3' });
    });

    it('should allow somme of answers equal specified', () => {
      const expectedCanSubmit = true;

      executeUseCase({ id: 'id1', value: '3.3' });
      executeUseCase({ id: 'id2', value: '2.7' });

      expectSecondCallWithCanSubmit(expectedCanSubmit, { id: 'id2', value: '2.7' });
    });
  });

  function executeUseCase(answerValue: InputAnswerValue<string>) {
    setInputAnswerUseCase.execute(fakeInputQuestionPresenter, answerValue, {
      answerValidatorsFn: answerValidators,
      formValidatorsFn: formValidators,
    });
  }

  function expectCallWithCanSubmit(
    expectedCanSubmit: boolean,
    answerValue: InputAnswerValue<string>,
    answerError: PositiveNumberError = null,
  ) {
    expect(setAnswerSpy).toHaveBeenCalledWith(answerValue, answerError, expectedCanSubmit, undefined);
  }

  function expectSecondCallWithCanSubmit(expectedCanSubmit: boolean, answerValue: InputAnswerValue<string>) {
    expect(setAnswerSpy).toHaveBeenNthCalledWith(2, answerValue, null, expectedCanSubmit, undefined);
  }
});
