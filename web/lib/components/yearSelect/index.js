function YearSelect({ options, value, onChange }) {
  return (
    <div className="flex flex-col">
      <label
        for="year"
        className="block mb-2 text-sm font-medium text-gray-900"
      >
        Year
      </label>
      <select
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5"
        id="year"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
      >
        {options.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}

export default YearSelect;
