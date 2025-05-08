import React, { useState } from "react";
import style from "./SearchLabels.module.css";
import { Input } from "./../Input/Input";

export const SearchLabels = ({ newsBlocks = [], onSelectFilter }) => {
  const [formData, setFormData] = useState({ search: "" });
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "search") {
      if (value.trim().length > 0) {
        const filtered = newsBlocks.filter((block) => block.label.toLowerCase().includes(value.toLowerCase()));

        setSearchResults(filtered);
        setShowSuggestions(true);
      } else {
        setSearchResults([]);
        setShowSuggestions(false);
      }
    }
  };
  return (
    <div className={style.search_tags}>
      {/* search bar */}
      <Input
        type="search"
        name="search"
        placeholder="Пошук"
        value={formData.search}
        onChange={handleChange}
        error={errors.name}
        size="small"
        icon="https://cdn-icons-png.flaticon.com/128/13984/13984009.png"
        focusIcon="https://cdn-icons-png.flaticon.com/128/18290/18290728.png"
      />

      {/* dropdown search input */}
      {showSuggestions && (
        <div className={style.suggestions}>
          {searchResults.length > 0 ? (
            searchResults.map((block) => (
              <div
                key={block.label}
                className={style.suggestionItem}
                onClick={() => {
                  onSelectFilter(block.filter);
                  setFormData({ search: "" });
                  setShowSuggestions(false);
                }}
              >
                {block.label} — {block.description}
              </div>
            ))
          ) : (
            <div className={style.suggestions}>
              <div className={style.noResults}>Нічого не знайдено</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
