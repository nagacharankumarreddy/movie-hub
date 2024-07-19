import React from "react";

const LanguageButtons = ({
  languageOptions,
  selectedLanguage,
  handleLanguageClick,
}) => {
  return (
    <div className="flex gap-2">
      {languageOptions.map((language) => (
        <button
          key={language.code}
          className={`px-4 py-2 my-1 rounded-lg ${
            selectedLanguage === language.code
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-gray-700"
          } hover:bg-blue-600`}
          onClick={() => handleLanguageClick(language.code)}
        >
          {language.name}
        </button>
      ))}
    </div>
  );
};

export default LanguageButtons;
