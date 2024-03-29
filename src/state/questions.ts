import { atom, selector } from "recoil";
import { Question, QuestionType } from "../models/database";
import config from "../config";
import { databaseState } from "./database";
import { randomNumber } from "../utils/numbers";
import { nativeStorageEffect } from "./effects";

export const currentQuestionTypeState = atom<QuestionType | undefined>({
  key: "currentQuestionType",
  default: undefined,
});

export const answeredQuestionsState = atom<{ [key: string]: number }>({
  key: "answeredQuestions",
  default: {},
  effects: [nativeStorageEffect("answeredQuestions")],
});

export const manualQuestionIdState = atom({
  key: "manualQuestionId",
  default: "",
});

export const pickupQuestionIdState = atom({
  key: "pickupQuestionId",
  default: "",
  effects: [nativeStorageEffect("pickupQuestionId")],
});

export const currentQuestionIdState = selector({
  key: "currentQuestionId",
  get: ({ get }) => {
    const manualId = get(manualQuestionIdState);
    if (manualId) {
      return manualId;
    }
    const answeredQuestions = get(answeredQuestionsState);
    const answeredIds = Object.keys(answeredQuestions);
    const type = get(currentQuestionTypeState)!;
    const db = get(databaseState);
    const unAnsweredIds = Object.values(db[type]).filter(
      (id) => !answeredIds.includes(id)
    );
    const randomIndex = randomNumber(0, unAnsweredIds.length - 1);
    const questionId = unAnsweredIds[randomIndex];
    return questionId;
  },
});

export const currentQuestionState = selector<Question>({
  key: "currentQuestion",
  get: async ({ get }) => {
    const id = get(currentQuestionIdState);
    const res = await fetch(`${config.DATABASE_URL}/${id}.json`);
    const question = await res.json();
    return question;
  },
});

export const durationState = atom<number>({
  key: "duration",
  default: 0,
});
