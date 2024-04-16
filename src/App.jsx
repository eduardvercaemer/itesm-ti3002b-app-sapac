import { useEffect } from "react";

import { useData, useSetFile } from "./handkey-module/state.js";
import { FileDrop } from "./components/file-drop.jsx";
import { ExportCsv } from "./components/export.jsx";

function App() {
  const setFile = useSetFile();
  const data = useData();

  useEffect(() => console.debug(data), [data]);

  return (
    <main className="flex flex-col h-screen w-screen">
      <h1 className="font-bold">sapac</h1>
      <ExportCsv />
      <FileDrop
        className="grow bg-violet-400 hover:cursor-pointer"
        onFileDrop={setFile}
      >
        drop handkey csv in purple rect (check console for output)
      </FileDrop>
    </main>
  );
}

export default App;
