import { useCallback } from "react";
import Papa from "papaparse";
import { atom, useRecoilState } from "recoil";

const employees$ = atom({
  key: "employees",
  default: new Map(),
});

function App() {
  const [employees, setEmployees] = useRecoilState(employees$);

  const handleDrop = useCallback(async (/**DragEvent*/ e) => {
    e.stopPropagation();
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) {
      return;
    }

    const newEmployees = new Map();

    Papa.parse(file, {
      header: true,
      step({ data }) {
        const [id, name, time] = Object.values(data);
        if (!newEmployees.has(id)) {
          newEmployees.set(id, { name });
        }

        console.debug({ id, name, time });
      },
      complete() {
        setEmployees(newEmployees);
      },
    });
  }, []);

  const onDragOver = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
  }, []);

  const onDragEnter = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
  }, []);

  return (
    <main className="flex flex-col h-screen w-screen">
      <h1 className="font-bold">sapac</h1>
      <div
        className="grow"
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDrop={handleDrop}
      >
        <table>
          <tbody>
            {Array.from(employees.entries()).map(([id, e]) => (
              <tr>
                <td>{id}</td>
                <td>{e.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default App;
