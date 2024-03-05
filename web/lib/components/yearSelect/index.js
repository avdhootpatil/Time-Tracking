import Select from "../Select";

function YearSelect({ options = [], value = null, onChange = () => {} }) {
  return (
    <div className="flex flex-col">
      <Select
        label="Year"
        onSelect={onChange}
        nameProperty="year"
        valueProperty="id"
        options={options}
        value={value}
      />
    </div>
  );
}

export default YearSelect;
