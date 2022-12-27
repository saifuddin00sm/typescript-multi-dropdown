import { useState } from "react";
import { Select, SelectOptions } from "./components/Select";


const options = [
  { label: "First 1", value: 1 },
  { label: "Second 1", value: 2 },
  { label: "Third 1", value:3 },
  { label: "Fourth 1", value: 4 },
  { label: "fith 1", value: 5 },

];

function App() {
  const [value, setValue] = useState<SelectOptions | undefined>(options[0]);
  const [value2, setValue2] = useState<SelectOptions[]>([options[0]]);

  return (
    <>
    <h2>Multi Select Dropdown</h2>
      <Select
        multiple
        options={options}
        value={value2}
        onChange={(o) => setValue2(o)}
      />
<hr />
<h2>Single Select Dropdown</h2>
      <Select
        options={options}
        value={value}
        onChange={(o) => setValue(o)}
      />
    </>
  );
}

export default App;
