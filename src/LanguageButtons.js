import React from "react";

const LanguageButtons = ({
  languageOptions,
  selectedLanguage,
  setSelectedLanguage,
}) => {
  return (
    <div className="flex space-x-2">
      {languageOptions.map((option) => (
        <button
          key={option.code}
          onClick={() => setSelectedLanguage(option.code)}
          className={`px-4 py-2 rounded-lg text-white font-bold transition transform hover:scale-105 ${
            selectedLanguage === option.code ? "bg-blue-600" : "bg-blue-400"
          }`}
        >
          {option.name}
        </button>
      ))}
    </div>
  );
};

export default LanguageButtons;
