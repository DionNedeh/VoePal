interface Option {
  id: string;
  label: string;
  color?: string;
}

interface OptionGroupProps {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}

export function OptionGroup({ label, value, options, onChange }: OptionGroupProps) {
  return (
    <fieldset className="option-group">
      <legend>{label}</legend>
      <div className="option-list">
        {options.map((option) => (
          <button
            className={option.id === value ? 'option selected' : 'option'}
            key={option.id}
            onClick={() => onChange(option.id)}
            type="button"
          >
            {option.color ? <span className="swatch" style={{ background: option.color }} /> : null}
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}
