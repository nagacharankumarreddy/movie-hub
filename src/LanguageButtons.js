import React from "react";

const LanguageButtons = ({ languageOptions, selectedLanguage, handleLanguageClick, disabled }) => (
  <div className="segment" role="group" aria-label="Language">
    {languageOptions.map((language) => (
      <button
        key={language.code}
        type="button"
        className={`segment-item ${selectedLanguage === language.code ? "segment-active" : ""}`}
        aria-pressed={selectedLanguage === language.code}
        disabled={disabled}
        onClick={() => handleLanguageClick(language.code)}
      >
        {language.name}
      </button>
    ))}
  </div>
);

export default LanguageButtons;
