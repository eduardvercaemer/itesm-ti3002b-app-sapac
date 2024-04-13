import { useCallback } from "react";
import PropTypes from "prop-types";

export function FileDrop(props) {
  const { onFileDrop, ...rest } = props;

  const onDrop = useCallback(
    async (/**DragEvent*/ e) => {
      e.stopPropagation();
      e.preventDefault();
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
  }, []);

  return (
    <div
      {...rest}
      onDragEnter={prevent}
      onDragOver={prevent}
      onDrop={onDrop}
    ></div>
  );
}

FileDrop.propTypes = {
  onFileDrop: PropTypes.func,
};
