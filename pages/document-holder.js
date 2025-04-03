import { useState } from "react";
import styles from "../styles/component-holder.module.css";

const FileUploader = () => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const handleDelete = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
    <h2 className={styles.componentTitle} >Document Holder</h2>
    <div className={styles.uploaderContainer}>
      <label htmlFor="file-upload" className={styles.fileLabel}>
        Choose Files
      </label>
      <input id="file-upload" type="file" onChange={handleFileChange} multiple className={styles.fileInput} />

      {files.length === 0 ? <p className={styles.placeholder}>No files uploaded</p> : null}

      <ul className={styles.fileList}>
        {files.map((file, index) => (
          <li key={index} className={styles.fileItem}>
            <a href={URL.createObjectURL(file)} target="_blank" rel="noopener noreferrer">
              {file.name}
            </a>
            <button onClick={() => handleDelete(index)} className={styles.deleteButton}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
};

export default FileUploader;
