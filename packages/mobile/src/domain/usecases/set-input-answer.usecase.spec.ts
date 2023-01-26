import 'reflect-metadata';
import { FakeInputQuestionPresenter } from '../../tests/fake-input-number-question.presenter';
import { SetInputAnswerUseCase } from './set-input-answer.usecase';

describe('Set input answer use case', () => {
  let setInputAnswerUseCase: SetInputAnswerUseCase;
  let fakeInputQuestionPresenter: FakeInputQuestionPresenter;
  let setAnswerSpy: jest.SpyInstance;

  beforeEach(() => {
    setInputAnswerUseCase = new SetInputAnswerUseCase();
    fakeInputQuestionPresenter = new FakeInputQuestionPresenter();
    fakeInputQuestionPresenter.answerValues = { id: undefined };
    setAnswerSpy = jest.spyOn(fakeInputQuestionPresenter, 'setAnswer');
  });

  it('should allow 0', () => {
    setInputAnswerUseCase.execute(fakeInputQuestionPresenter, { id: 'id', value: '0' });

    expect(setAnswerSpy).toHaveBeenCalledWith({ id: 'id', value: '0' }, null, true, undefined);
  });

  it('should allow dot floating point number', () => {
    setInputAnswerUseCase.execute(fakeInputQuestionPresenter, { id: 'id', value: '1.3' });

    expect(setAnswerSpy).toHaveBeenCalledWith({ id: 'id', value: '1.3' }, null, true, undefined);
  });

  it('should allow comma floating point number', () => {
    setInputAnswerUseCase.execute(fakeInputQuestionPresenter, { id: 'id', value: '1,5' });

    expect(setAnswerSpy).toHaveBeenCalledWith({ id: 'id', value: '1,5' }, null, true, undefined);
  });

  it('should not allow an empty value', () => {
    setInputAnswerUseCase.execute(fakeInputQuestionPresenter, { id: 'id', value: null });

    expect(setAnswerSpy).toHaveBeenCalledWith({ id: 'id', value: null }, { error: 'isNotNumber' }, false, undefined);
  });

  it('should not allow a text', () => {
    setInputAnswerUseCase.execute(fakeInputQuestionPresenter, { id: 'id', value: 'adv' });

    expect(setAnswerSpy).toHaveBeenCalledWith({ id: 'id', value: 'adv' }, { error: 'isNotNumber' }, false, undefined);
  });

  it('should not allow negative number', () => {
    setInputAnswerUseCase.execute(fakeInputQuestionPresenter, { id: 'id', value: '-1' });

    expect(setAnswerSpy).toHaveBeenCalledWith({ id: 'id', value: '-1' }, { error: 'isNotPositive' }, false, undefined);
  });

  it('should  allow to submit number', () => {
    setInputAnswerUseCase.execute(fakeInputQuestionPresenter, { id: 'id', value: '-1' });

    expect(setAnswerSpy).toHaveBeenCalledWith({ id: 'id', value: '-1' }, { error: 'isNotPositive' }, false, undefined);
  });

  describe('With multiple answers', () => {
    beforeEach(() => {
      fakeInputQuestionPresenter.answerValues = { id1: undefined, id2: undefined };
    });

    it('should allow to submit question if all answers are valid', () => {
      setInputAnswerUseCase.execute(fakeInputQuestionPresenter, { id: 'id1', value: '0' });
      setInputAnswerUseCase.execute(fakeInputQuestionPresenter, { id: 'id2', value: '2' });

      expect(setAnswerSpy).toHaveBeenNthCalledWith(2, { id: 'id2', value: '2' }, null, true, undefined);
    });

    it('should not allow to submit question  if one of the answer is empty', () => {
      setInputAnswerUseCase.execute(fakeInputQuestionPresenter, { id: 'id2', value: '2' });

      expect(setAnswerSpy).toHaveBeenCalledWith({ id: 'id2', value: '2' }, null, false, undefined);
    });

    it('should not allow to submit question  if one of the answer not valid', () => {
      setInputAnswerUseCase.execute(fakeInputQuestionPresenter, { id: 'id1', value: 'abc' });
      setInputAnswerUseCase.execute(fakeInputQuestionPresenter, { id: 'id2', value: '2' });

      expect(setAnswerSpy).toHaveBeenNthCalledWith(2, { id: 'id2', value: '2' }, null, false, undefined);
    });
  });
});
