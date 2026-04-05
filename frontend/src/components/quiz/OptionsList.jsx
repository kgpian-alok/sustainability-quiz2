import React from "react";

const OptionsList = ({ options, qIndex, selectedAnswers, onOptionChange }) => {
  return (
    <div className="space-y-3">
      {options.map((opt, index) => (
        <label
          key={index}
          className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-700 transition"
        >
          <input
            type="checkbox"
            checked={selectedAnswers.includes(index)}
            onChange={() => onOptionChange(qIndex, index)}
            className="w-4 h-4 accent-emerald-500"
          />
          <span className="text-slate-200">{opt}</span>
        </label>
      ))}
    </div>
  );
};

export default OptionsList;
