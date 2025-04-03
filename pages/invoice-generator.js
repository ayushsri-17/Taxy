import React, { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import styles from "../styles/invoice-gen.module.css";

const InvoiceGenerator = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ description: "", quantity: 1, price: 0 });

  const addItem = () => {
    setItems([...items, { ...newItem, id: Date.now() }]);
    setNewItem({ description: "", quantity: 1, price: 0 });
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + item.quantity * item.price, 0);
  };

  const generatePDF = () => {
    const invoice = document.getElementById("invoice");
    html2canvas(invoice).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
      pdf.save("invoice.pdf");
    });
  };

  return (
    <>
    <h2 className={styles.title}>Invoice Generator</h2>
    <div className={styles.container}>
      
      <div className={styles.invoice} id="invoice">
        {items.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.description}</td>
                  <td>{item.quantity}</td>
                  <td>Rs. {item.price}</td>
                  <td>Rs. {item.quantity * item.price}</td>
                  <td>
                    <button onClick={() => removeItem(item.id)} className={styles.removeBtn}>X</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.noItems}>No items added yet.</p>
        )}
        <h3 className={styles.total}>Total: Rs.{getTotal()}</h3>
      </div>
      <div className={styles.inputGroup}>
        <input
          type="text"
          placeholder="Add Items +"
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          className={styles.input}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
          className={styles.input}
        />
        <input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
          className={styles.input}
        />
        <button onClick={addItem} className={styles.addBtn}>Add Item</button>
      </div>
      <button onClick={generatePDF} className={styles.downloadBtn}>Download PDF</button>
    </div>
    </>
  );
};

export default InvoiceGenerator;