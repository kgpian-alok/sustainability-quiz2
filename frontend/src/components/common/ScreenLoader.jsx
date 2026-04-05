import React from "react";
import { Loader } from "lucide-react";

const ScreenLoader = ({loaderFor}) => {
  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center z-50">
      <div className="flex items-center">
        <Loader className="animate-spin text-sky-400 mr-4" size={32} />
        <p className="text-xl text-slate-300 font-semibold">
          Loading {loaderFor}...
        </p>
      </div>
    </div>
  );
};

export default ScreenLoader;
