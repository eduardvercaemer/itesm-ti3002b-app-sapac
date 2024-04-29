import { useState, useCallback } from "react";
import PropTypes from "prop-types";

import "./file-drop.css";

export function FileDrop(props) {
  const { onFileDrop, ...rest } = props;
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const onDragLeave = useCallback(() => {
    setIsDraggingOver(false);
  }, []);

  const onDrop = useCallback(
    async (e) => {
      e.stopPropagation();
      e.preventDefault();
      setIsDraggingOver(false);

      const file = e.dataTransfer.files[0];
      if (!file) {
        return;
      }

      console.debug("file drop:", file.name);
      onFileDrop(file);
    },
    [onFileDrop],
  );

  const prevent = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDraggingOver(true);
  }, []);

  return (
    <div
      {...rest}
      onDragEnter={prevent}
      onDragOver={prevent}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`file-drop ${isDraggingOver ? "file-drop-dragging-over" : ""}`}
    >
      <HeroiconsOutlineCloudUpload className="subir-a-la-nube" />
      <p className="text-gray-400">Arrastra y suelta aquí</p>
      <p className="text-gray-400 mb-1">o</p>
      <label className="button-select-file">
        <input
          type="file"
          className="hidden"
          onChange={(e) => {
            onFileDrop(e.target.files[0]);
          }}
        />
        Selecciona archivo
      </label>
    </div>
  );
}

FileDrop.propTypes = {
  onFileDrop: PropTypes.func,
};

// Imagen de nube
export function HeroiconsOutlineCloudUpload(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M7 16a4 4 0 0 1-.88-7.903A5 5 0 1 1 15.9 6h.1a5 5 0 0 1 1 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
      ></path>
    </svg>
  );
}
