import { useRecoilValue, useSetRecoilState } from "recoil";
import { data$, file$ } from "./state.js";
import { FileDrop } from "./components/file-drop.jsx";
import { useEffect } from "react";

function App() {
  const setFile = useSetRecoilState(file$);
  const data = useRecoilValue(data$);

  useEffect(() => console.debug(data), [data]);

  return (
    <main className="flex flex-col h-screen w-screen">
      <h1 className="font-bold">sapac</h1>
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
