import './Slider.css';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  disabled?: boolean;
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue = (v) => `${v}%`,
  disabled
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`slider ${disabled ? 'slider-disabled' : ''}`}>
      <div className="slider-header">
        <span className="slider-label">{label}</span>
        <span className="slider-value">{formatValue(value)}</span>
      </div>
      <div className="slider-track-container">
        <div
          className="slider-track-fill"
          style={{ width: `${percentage}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="slider-input"
        />
      </div>
    </div>
  );
}
