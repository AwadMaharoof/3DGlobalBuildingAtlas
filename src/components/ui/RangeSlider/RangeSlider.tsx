import { useCallback, useRef, useState, useEffect } from 'react';
import './RangeSlider.css';

interface RangeSliderProps {
  label: string;
  minValue: number;
  maxValue: number;
  min: number;
  max: number;
  step?: number;
  onChange: (range: [number, number]) => void;
  formatValue?: (value: number) => string;
  disabled?: boolean;
}

export function RangeSlider({
  label,
  minValue,
  maxValue,
  min,
  max,
  step = 1,
  onChange,
  formatValue = (v) => `${v}m`,
  disabled
}: RangeSliderProps) {
  const [localMin, setLocalMin] = useState(minValue);
  const [localMax, setLocalMax] = useState(maxValue);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalMin(minValue);
    setLocalMax(maxValue);
  }, [minValue, maxValue]);

  const debouncedOnChange = useCallback((newMin: number, newMax: number) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      onChange([newMin, newMax]);
    }, 150);
  }, [onChange]);

  const handleMinChange = (value: number) => {
    const newMin = Math.min(value, localMax - step);
    setLocalMin(newMin);
    debouncedOnChange(newMin, localMax);
  };

  const handleMaxChange = (value: number) => {
    const newMax = Math.max(value, localMin + step);
    setLocalMax(newMax);
    debouncedOnChange(localMin, newMax);
  };

  const minPercent = ((localMin - min) / (max - min)) * 100;
  const maxPercent = ((localMax - min) / (max - min)) * 100;

  return (
    <div className={`range-slider ${disabled ? 'range-slider-disabled' : ''}`}>
      <div className="range-slider-header">
        <span className="range-slider-label">{label}</span>
        <span className="range-slider-value">
          {formatValue(localMin)} - {formatValue(localMax)}
        </span>
      </div>
      <div className="range-slider-track-container">
        <div className="range-slider-track" />
        <div
          className="range-slider-track-fill"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localMin}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          disabled={disabled}
          className="range-slider-input range-slider-input-min"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localMax}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          disabled={disabled}
          className="range-slider-input range-slider-input-max"
        />
      </div>
    </div>
  );
}
