import React, { useState } from "react";
import style from "./SearchLabels.module.css";
import { Input } from "./../Input/Input";

export const SearchLabels = ({ newsBlocks = [], onSelectFilter }) => {
  const [formData, setFormData] = useState({ search: "" });
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

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
        setSelectedIndex(null);
      } else {
        setSearchResults([]);
        setShowSuggestions(false);
      }
    }
  };

  // Handle key presses for navigation and selection
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && selectedIndex !== null) {
      e.preventDefault();
      const selectedBlock = searchResults[selectedIndex];
      if (selectedBlock) {
        onSelectFilter(selectedBlock.filter); // Apply the filter from the selected item
      }
      setFormData({ search: "" });
      setShowSuggestions(false);
    } else if (e.key === "Enter") {
      // If Enter is pressed and no selection, find matching block by input value
      const matchingBlock = searchResults.find((block) => block.label.toLowerCase().includes(formData.search.toLowerCase()));
      if (matchingBlock) {
        onSelectFilter(matchingBlock.filter); // Apply filter for the matching block
      }
      setFormData({ search: "" });
      setShowSuggestions(false);
    } else if (e.key === "ArrowDown") {
      // If ArrowDown is pressed, navigate to the next item
      e.preventDefault();
      if (selectedIndex === null || selectedIndex === searchResults.length - 1) {
        setSelectedIndex(0); // Go back to the first item if at the end
      } else {
        setSelectedIndex((prev) => prev + 1); // Move to the next item
      }
    } else if (e.key === "ArrowUp") {
      // If ArrowUp is pressed, navigate to the previous item
      e.preventDefault();
      if (selectedIndex === null || selectedIndex === 0) {
        setSelectedIndex(searchResults.length - 1); // Go to the last item if at the start
      } else {
        setSelectedIndex((prev) => prev - 1); // Move to the previous item
      }
    }
  };

  return (
    <div className={style.search_tags}>
      {/* Search bar */}
      <div onKeyDown={handleKeyDown}>
        <Input
          type="search"
          name="search"
          placeholder="Пошук..."
          value={formData.search}
          onChange={handleChange}
          error={errors.name}
          size="small"
          border="bordRadLow"
          icon="https://cdn-icons-png.flaticon.com/128/13984/13984009.png"
          focusIcon="https://cdn-icons-png.flaticon.com/128/18290/18290728.png"
        />
      </div>

      {/* Dropdown with suggestions */}
      {showSuggestions && (
        <div className={style.suggestions}>
          {searchResults.length > 0 ? (
            searchResults.map((block, index) => (
              <div
                key={block.label}
                className={`${style.suggestionItem} ${selectedIndex === index ? style.selected : ""}`} // Highlight selected item
                onClick={() => {
                  onSelectFilter(block.filter); // Apply the selected filter on click
                  setFormData({ search: "" });
                  setShowSuggestions(false);
                  setSelectedIndex(null); // Reset selected index
                }}
              >
                {block.label} — {block.description}
              </div>
            ))
          ) : (
            <div className={style.suggestions}>
              <div className={style.noResults}>No results found</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
