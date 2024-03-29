import {
  FC,
  FunctionComponent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import { QuestionProps } from ".";
import { SubQuestion } from "../../../models/database";
import Button from "../../button";
import { Explanations } from "../../explanations";
import Content from "../content";
import { getABCD } from "../hooks";

export interface ReadingComprehensionQuestionProps
  extends Omit<QuestionProps, "onAnswer"> {
  onAnswer: (answer: number[]) => void;
}

const ReadingComprehensionSubQuestion: FC<{
  question: SubQuestion;
  onAnswer: (index: number) => any;
}> = ({ question, onAnswer }) => {
  const [selected, setSelected] = useState(-1);
  useEffect(() => {
    onAnswer(selected);
  }, [selected]);
  return (
    <div className="w-full overflow-y-auto">
      <h1 className="my-8 flex">
        <Content content={question.question} />
      </h1>
      <div className={`flex-none w-full grid grid-cols-1 gap-4`}>
        {question.answers.map((answer, i, items) => (
          <Button
            key={i}
            className={`px-4 ${
              selected === i ? "bg-primary text-primary-text" : ""
            }`}
            onClick={() => setSelected(i)}
          >
            <Content content={answer} />
          </Button>
        ))}
      </div>
    </div>
  );
};

const ReadingComprehensionQuestion: FunctionComponent<
  ReadingComprehensionQuestionProps
> = ({ question, onAnswer, noExplanation }) => {
  const [reading, setReading] = useState(false);
  const [viewExplaination, setViewExplaination] = useState(false);

  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const [footerHeight, setFooterHeight] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const finished = useMemo(() => {
    console.log(question.subQuestions!.length, selected.length);
    if (
      question.subQuestions!.length > 0 &&
      selected.filter((i) => i !== -1).length === question.subQuestions!.length
    ) {
      return true;
    }
    return false;
  }, [selected]);
  useEffect(() => {
    if (finished) {
      if (noExplanation !== true) {
        setViewExplaination(true);
      }
    }
  }, [finished]);
  const [navHeight, setNavHeight] = useState(0);

  return (
    <>
      <div className="w-full overflow-y-auto py-8">
        <p>
          <Content content={question.question} />
        </p>
        {question.subQuestions!.map((question, i) => (
          <ReadingComprehensionSubQuestion
            key={i}
            question={question}
            onAnswer={(answerIndex) =>
              setSelected((ss) => {
                ss[i] = answerIndex;
                return [...ss];
              })
            }
          />
        ))}
        <div className="w-full flex-none" style={{ height: navHeight }}></div>
      </div>
      {noExplanation && (
        <div
          ref={(el) => setNavHeight(el ? el.clientHeight : 0)}
          className="absolute bottom-0 left-0 right-0 z-50 backdrop-blur-xl flex justify-center space-x-4 p-4 pt-2"
          style={{
            paddingBottom: `max(env(safe-area-inset-bottom, 8px), 8px)`,
          }}
        >
          {finished && (
            <Button onClick={async () => onAnswer(selected)}>OK</Button>
          )}
        </div>
      )}
      {!noExplanation && (
        <Explanations
          visible={viewExplaination}
          onDismiss={() => setViewExplaination(false)}
          onConfirm={async () => onAnswer(selected)}
          yourAnswer={`${selected.map(getABCD).join(", ")}`}
          explanations={question.explanations}
        />
      )}
    </>
  );
};

export default ReadingComprehensionQuestion;
