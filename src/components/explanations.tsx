import { FC, useRef, useState } from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import Button from "./button";
import Content from "./quiz/content";

export const Explanations: FC<{
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => Promise<void>;
  yourAnswer: string;
  explanations: string[];
}> = ({ visible, onDismiss, onConfirm, yourAnswer, explanations }) => {
  const [footerHeight, setFooterHeight] = useState(0);

  return (
    <BottomSheet
      expandOnContentDrag
      open={visible}
      onDismiss={onDismiss}
      title="Explanations"
      scrollLocking={false}
    >
      <div className="h-full flex flex-col">
        <h1 className="text-center font-bold">Explanations</h1>
        <div
          className="w-full overflow-y-auto"
          style={{
            maxHeight: `calc(100vh - 44px - ${footerHeight}px - env(safe-area-inset-top) - env(safe-area-inset-bottom))`,
          }}
          ref={(el) => {
            setTimeout(() => {
              el?.scrollTo({ top: 0, behavior: "auto" });
            }, 100);
          }}
        >
          {explanations.map((ex, i) => (
            <div
              key={i}
              className={`${
                i === 0
                  ? "bg-yellow-100 dark:bg-yellow-800"
                  : "bg-gray-100 dark:bg-gray-700"
              } m-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800`}
            >
              {i === 0 && <b>🌟 Suggested answer </b>}
              <Content key={i} content={ex} />
            </div>
          ))}
        </div>
        <div
          ref={(el) => setFooterHeight(el ? el.clientHeight : 0)}
          className="sticky bottom-0 py-2 px-4 w-full bg-background shadow text-center space-y-2"
        >
          <Content content={`Your answer: <b>${yourAnswer}</b>`} />
          <Button onClick={onConfirm} className="w-full">
            Next question
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
};
