import { makeData } from "./data";
import { Table } from "./table";

function App() {
  return (
    <div>
      <Table data={makeData(10_000)} />
    </div>
  );
}

export default App;
