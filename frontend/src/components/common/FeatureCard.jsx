const FeatureCard = ({ title, description, icon, onClick }) => (
  <button
    onClick={onClick}
    className="w-full bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-sky-500 hover:bg-slate-700/50 transition-all duration-300 text-left cursor-pointer group"
  >
    <div className="flex items-center">
      {icon}
      <div className="ml-4">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <p className="text-slate-400 mt-1">{description}</p>
      </div>
    </div>
  </button>
);
export default FeatureCard;