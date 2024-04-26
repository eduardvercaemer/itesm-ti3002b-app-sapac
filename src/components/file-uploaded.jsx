import "./file-uploaded.css";

export function FileUploaded(props) {
  const { deleteFile } = props;

  return (
    <div className="file-uploaded-container">
      <FluentMdl2BulkUpload className="file-uploaded" />
      <p className="text-black-400 font-bold">Archivo subido</p>
      <button className="btn-file-uploaded" onClick={() => deleteFile()}>
        Borrar archivo
      </button>
    </div>
  );
}

export function FluentMdl2BulkUpload(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 2048 2048"
      {...props}
    >
      <path
        fill="currentColor"
        d="M512 1920h1024v128H384v-256H128V0h859l402 402l403 403v91h-640V384H512zm768-1152h293l-293-293zm-896 896V256h677L933 128H256v1536zm1344-410l317 317l-90 90l-163-162v549h-128v-549l-163 162l-90-90zm320-230v128h-640v-128z"
      ></path>
    </svg>
  );
}
