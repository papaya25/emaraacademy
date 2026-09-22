type CityFilterProps = {
  cities: string[];
  value: string;
  onChange: (city: string) => void;
  label: string;
};

export default function CityFilter({ cities, value, onChange, label }: CityFilterProps) {
  return (
    <label className="city-select" aria-label={label}>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {cities.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </label>
  );
}
