import React from "react";

interface MenuSectionProps {
  selectedOptions: string[];
  toggleOption: (option: string) => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({ selectedOptions, toggleOption }) => {
  return (
    <div className="menu menu-default flex flex-wrap justify-center gap-2.5 border rounded-lg py-2 badge badge-outline">
      {["panel", "alüminyum"].map((option) => (
        <div className="menu-item" key={option}>
          <a className="menu-link" href="#">
            <span className="menu-title" style={{ color: "black" }}>{option}</span>
          </a>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={selectedOptions.includes(option)}
              onChange={() => toggleOption(option)}
              id={option}
            />
            <label className="form-check-label" htmlFor={option}></label>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuSection;
