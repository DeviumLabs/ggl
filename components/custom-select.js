import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { getSurfaceMotion, motionDuration, motionEase } from "./animations/motionTokens";

const normalize = (value) => (value || "").toString().trim().toLowerCase();

export default function CustomSelect({
  id,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  placeholder = "Digite para buscar",
  disabled = false,
  className = "",
  inputClassName = ""
}) {
  const shouldReduceMotion = useReducedMotion();
  const generatedId = useId();
  const selectId = id || `custom-select-${generatedId}`;
  const listboxId = `${selectId}-listbox`;
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const optionRefs = useRef([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const panelMotion = getSurfaceMotion("modal", shouldReduceMotion);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) || null,
    [options, value]
  );
  const [query, setQuery] = useState(selectedOption?.label || "");

  const filteredOptions = useMemo(() => {
    const term = normalize(query);
    if (!term) return options;

    return options.filter((option) => {
      const label = normalize(option.label);
      const optionValue = normalize(option.value);
      return label.includes(term) || optionValue.includes(term);
    });
  }, [options, query]);

  const activeOption = filteredOptions[activeIndex] || null;

  useEffect(() => {
    if (open) return;
    setQuery(selectedOption?.label || "");
  }, [open, selectedOption]);

  useEffect(() => {
    if (!open) return;
    setActiveIndex(0);
  }, [open, query]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        finalizeInput();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open, query, options, selectedOption, onBlur, onChange]);

  useEffect(() => {
    if (!open) return;
    optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const closeMenu = ({ markTouched = true } = {}) => {
    setOpen(false);
    if (markTouched) onBlur?.();
  };

  const selectOption = (option) => {
    setQuery(option.label);
    onChange?.(option.value);
    closeMenu();
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const findExactMatch = (term) => {
    const normalizedTerm = normalize(term);
    if (!normalizedTerm) return null;

    return (
      options.find((option) => normalize(option.label) === normalizedTerm) ||
      options.find((option) => normalize(option.value) === normalizedTerm) ||
      null
    );
  };

  const finalizeInput = () => {
    const exactMatch = findExactMatch(query);

    if (exactMatch) {
      setQuery(exactMatch.label);
      onChange?.(exactMatch.value);
    } else if (!normalize(query)) {
      setQuery("");
      onChange?.("");
    } else {
      setQuery(selectedOption?.label || "");
    }

    closeMenu();
  };

  const handleInputChange = (event) => {
    const nextQuery = event.target.value;
    setQuery(nextQuery);
    if (!open) setOpen(true);

    if (selectedOption && normalize(nextQuery) !== normalize(selectedOption.label)) {
      onChange?.("");
    }
  };

  const handleKeyDown = (event) => {
    if (disabled) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        setActiveIndex((current) => {
          const next = current + 1;
          return next >= filteredOptions.length ? 0 : next;
        });
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        setActiveIndex((current) => {
          const next = current - 1;
          return next < 0 ? Math.max(filteredOptions.length - 1, 0) : next;
        });
        break;
      case "Enter":
        if (open && activeOption) {
          event.preventDefault();
          selectOption(activeOption);
          return;
        }
        finalizeInput();
        break;
      case "Escape":
        event.preventDefault();
        setQuery(selectedOption?.label || "");
        closeMenu();
        break;
      case "Tab":
        finalizeInput();
        break;
      default:
        break;
    }
  };

  return (
    <div ref={wrapperRef} className={`tw-relative ${className}`}>
      {name ? <input type="hidden" name={name} value={value || ""} /> : null}

      <div className="tw-relative">
        <input
          ref={inputRef}
          id={selectId}
          type="text"
          role="combobox"
          value={query}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="off"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={open && activeOption ? `${listboxId}-${activeOption.value}` : undefined}
          onFocus={() => {
            if (!disabled) setOpen(true);
          }}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={(event) => {
            const nextTarget = event.relatedTarget;
            if (nextTarget && wrapperRef.current?.contains(nextTarget)) return;
            finalizeInput();
          }}
          className={[
            "tw-w-full disabled:tw-cursor-not-allowed disabled:tw-bg-slate-100 disabled:tw-text-slate-400",
            inputClassName
          ].join(" ")}
        />

        <m.span
          aria-hidden="true"
          animate={{ rotate: open ? 180 : 0 }}
          transition={
            shouldReduceMotion
              ? { duration: 0.16 }
              : { duration: motionDuration.quick, ease: motionEase.standard }
          }
          className="tw-pointer-events-none tw-absolute tw-inset-y-0 tw-right-[14px] tw-inline-flex tw-items-center tw-justify-center tw-text-slate-400"
        >
          <svg viewBox="0 0 16 16" className="tw-h-[14px] tw-w-[14px]" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </m.span>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <m.div
            className="tw-absolute tw-z-[120] tw-mt-[8px] tw-w-full tw-overflow-hidden tw-rounded-[18px] tw-border tw-border-slate-200 tw-bg-white tw-shadow-[0_24px_38px_-24px_rgba(15,23,42,0.3)]"
            initial={panelMotion.initial}
            animate={panelMotion.animate}
            exit={panelMotion.exit}
            transition={panelMotion.transition}
          >
            <div id={listboxId} role="listbox" className="tw-max-h-[240px] tw-overflow-y-auto tw-p-[6px]">
              {filteredOptions.length ? (
                filteredOptions.map((option, index) => {
                  const isSelected = option.value === value;
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={option.value}
                      ref={(node) => {
                        optionRefs.current[index] = node;
                      }}
                      id={`${listboxId}-${option.value}`}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      tabIndex={-1}
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => selectOption(option)}
                      className={[
                        "tw-flex tw-w-full tw-items-center tw-justify-between tw-gap-[12px] tw-rounded-[12px] tw-px-[12px] tw-py-[10px] tw-text-[15px] tw-transition",
                        isActive ? "tw-bg-slate-100" : "tw-bg-transparent",
                        isSelected ? "tw-text-blue tw-font-semibold" : "tw-text-slate-700"
                      ].join(" ")}
                    >
                      <span>{option.label}</span>
                      {isSelected ? <span aria-hidden="true">✓</span> : null}
                    </button>
                  );
                })
              ) : (
                <div className="tw-rounded-[12px] tw-px-[12px] tw-py-[10px] tw-text-[14px] tw-text-slate-500">
                  Nenhum resultado encontrado
                </div>
              )}
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
