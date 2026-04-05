import React from "react";
import OptionsList from "./OptionsList";

const QuestionCard = ({
  question,
  qIndex,
  selectedAnswers,
  onOptionChange,
}) => {

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
      <h2 className="text-lg font-semibold mb-4 text-white">
        {qIndex + 1}. {question.question}
      </h2>

      <OptionsList
        options={question.options}
        qIndex={qIndex}
        selectedAnswers={selectedAnswers}
        onOptionChange={onOptionChange}
      />
    </div>
  );
};

export default QuestionCard;
