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
    [onFileDrop]
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
      <img
        className="subir-a-la-nube"
        src="/subir-a-la-nube.png"
        alt="subir-a-la-nube"
      />
      <p className="text-gray-400">Arrastra y suelta aquí</p>
      <p className="text-gray-400 mb-1">o</p>
      <label className="button-select-file">
        <input
          type="file"
          className="hidden"
          onChange={(e) => {
            onFileDrop(e.target.files[0])
          }}
        />
        Seleccionar archivo
      </label>
    </div>
  );
}

FileDrop.propTypes = {
  onFileDrop: PropTypes.func,
};