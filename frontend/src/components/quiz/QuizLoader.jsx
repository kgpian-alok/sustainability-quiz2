import { Loader } from "lucide-react";

const QuizLoader = () => {
  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center z-50">
      <div className="flex items-center">
        <Loader className="animate-spin text-sky-400 mr-4" size={32} />
        <p className="text-xl text-slate-300 font-semibold">
          Loading Quiz Page...
        </p>
      </div>
    </div>
  );
};

export default QuizLoader;
