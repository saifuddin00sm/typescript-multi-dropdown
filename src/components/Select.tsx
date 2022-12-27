import { useState, useEffect, useRef } from "react";
import styles from "./select.module.css";

export type SelectOptions = {
  label: string;
  value: string | number;
};

type MultiSelect = {
  multiple: true;
  onChange: (value: SelectOptions[]) => void;
  value: SelectOptions[];
};

type SingleSelect = {
  multiple?: false;
  value?: SelectOptions;
  onChange: (value: SelectOptions | undefined) => void;
};

type SelectProps = {
  options: SelectOptions[];
} & (SingleSelect | MultiSelect);

export const Select = ({ value, onChange, options, multiple }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    container,
    valueStyles,
    divider,
    caret,
    lists,
    list_items,
    clearBtn,
    show,
    selected,
    highlighted,
    option_badge,
  } = styles;

  const clearHandler = () => {
    multiple ? onChange([]) : onChange(undefined);
  };

  const selectOptions = (option: SelectOptions, isDelete?: boolean) => {
    if (multiple) {
      if (value.includes(option)) {
        if (isDelete) {
          onChange(value.filter((o) => o !== option));
        } else {
          return;
        }
      } else {
        onChange([...value, option]);
      }
    } else {
      if (option !== value) onChange(option);
    }
  };

  const isOptionSelected = (option: SelectOptions) => {
    return multiple ? value.includes(option) : option === value;
  };

  useEffect(() => {
    if (isOpen) setHighlightedIndex(0);
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target != containerRef.current) return;
      switch (e.code) {
        case "Enter":
        case "Space":
          setIsOpen((prev) => !prev);
          if (isOpen) selectOptions(options[highlightedIndex], true);
          break;
        case "ArrowDown":
        case "ArrowUp": {
          if (!isOpen) {
            setIsOpen(true);
            break;
          }
          const newHighlightedIndex =
            highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
          if (
            newHighlightedIndex >= 0 &&
            newHighlightedIndex < options.length
          ) {
            setHighlightedIndex(newHighlightedIndex);
          }
          break;
        }
        case "Escape":
          setIsOpen(false);
          break;
      }
    };

    containerRef.current?.addEventListener("keydown", handler);

    return () => {
      containerRef.current?.removeEventListener("keydown", handler);
    };
  }, [isOpen, highlightedIndex, options]);

  return (
    <div
      onClick={() => setIsOpen((prev) => !prev)}
      onBlur={() => setIsOpen(false)}
      tabIndex={0}
      className={container}
      ref={containerRef}
    >
      <div className={valueStyles}>
        {multiple ? (
          value.map((v) => (
            <button
              className={option_badge}
              onClick={(e) => {
                e.stopPropagation();
                selectOptions(v, true);
              }}
              key={v.value}
            >
              {v.label} <span>&times;</span>
            </button>
          ))
        ) : (
          <span>{value?.label}</span>
        )}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          clearHandler();
        }}
        className={clearBtn}
      >
        &times;
      </button>
      <div className={divider}></div>
      <div className={caret}></div>
      <ul className={`${lists} ${isOpen ? show : ""}`}>
        {options.map((option, index) => (
          <li
            onClick={(e) => {
              e.stopPropagation();
              selectOptions(option);
              setIsOpen(false);
            }}
            onMouseEnter={() => setHighlightedIndex(index)}
            key={option.value}
            className={`${list_items} ${
              isOptionSelected(option) ? selected : ""
            } ${highlightedIndex === index ? highlighted : ""}`}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};
