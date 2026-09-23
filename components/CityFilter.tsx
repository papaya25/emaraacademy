type CityFilterProps = {
  cities: string[];
  value: string;
  onChange: (city: string) => void;
  label: string;
  /** Visitor-facing name for each city value (defaults to the value itself). */
  labelOf?: (city: string) => string;
};

export default function CityFilter({ cities, value, onChange, label, labelOf }: CityFilterProps) {
  return (
    <label className="city-select" aria-label={label}>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {cities.map((c) => (
          <option key={c} value={c}>
            {labelOf ? labelOf(c) : c}
          </option>
        ))}
      </select>
    </label>
  );
}
