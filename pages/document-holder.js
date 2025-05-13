import { useState } from "react";
import styles from "../styles/component-holder.module.css";

const FileUploader = () => {
  const [files, setFiles] = useState([]);
  const [sortBy, setSortBy] = useState("name"); // 'name', 'size', or 'type'

  const handleFileChange = (e) => {
    setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const handleDelete = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const sortedFiles = [...files].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "size":
        return a.size - b.size;
      case "type":
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  return (
    <>
      <h2 className={styles.componentTitle}>Document Holder</h2>
      <div className={styles.uploaderContainer}>
        <div className={styles.controls}>
          <label htmlFor="file-upload" className={styles.fileLabel}>
            Choose Files
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="name">Sort by Name</option>
            <option value="size">Sort by Size</option>
            <option value="type">Sort by Type</option>
          </select>
        </div>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          multiple
          className={styles.fileInput}
        />

        {files.length === 0 ? (
          <p className={styles.placeholder}>No files uploaded</p>
        ) : null}

        <ul className={styles.fileList}>
          {sortedFiles.map((file, index) => (
            <li key={index} className={styles.fileItem}>
              <a
                href={URL.createObjectURL(file)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {file.name}
                <span className={styles.fileInfo}>
                  {file.type.split("/")[1]} •{" "}
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </a>
              <button
                onClick={() => handleDelete(index)}
                className={styles.deleteButton}
              >
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