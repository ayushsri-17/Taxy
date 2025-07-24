import React, { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import styles from "../styles/invoice-gen.module.css";

const InvoiceGenerator = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ description: "", quantity: 1, price: 0 });

  const [shopDetails, setShopDetails] = useState({
    name: '',
    address: '',
    billNumber: '',
    paymentMethod: 'Cash',
    date: new Date().toISOString().split('T')[0],
  });

  const addItem = () => {
    if (!newItem.description || newItem.quantity <= 0 || newItem.price < 0) return;
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

    // Hide delete buttons temporarily
    const deleteButtons = invoice.querySelectorAll(".noPrint");
    deleteButtons.forEach(btn => btn.style.display = "none");

    html2canvas(invoice).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
      pdf.save("invoice.pdf");

      // Restore delete buttons
      deleteButtons.forEach(btn => btn.style.display = "inline-block");
    });
  };

  return (
    <>
      <h2 className={styles.title}>Invoice Generator</h2>
      <div className={styles.container}>

        {/* Header Inputs */}
        <div className={styles.headerInputs}>
          <input
            type="text"
            placeholder="Shop Name"
            value={shopDetails.name}
            onChange={(e) => setShopDetails({ ...shopDetails, name: e.target.value })}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Shop Address"
            value={shopDetails.address}
            onChange={(e) => setShopDetails({ ...shopDetails, address: e.target.value })}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Bill Number"
            value={shopDetails.billNumber}
            onChange={(e) => setShopDetails({ ...shopDetails, billNumber: e.target.value })}
            className={styles.input}
          />
          <input
            type="date"
            value={shopDetails.date}
            onChange={(e) => setShopDetails({ ...shopDetails, date: e.target.value })}
            className={styles.input}
          />
          <select
            value={shopDetails.paymentMethod}
            onChange={(e) => setShopDetails({ ...shopDetails, paymentMethod: e.target.value })}
            className={styles.input}
          >
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
            <option value="Online">Online</option>
          </select>
        </div>

        {/* Invoice Preview */}
        <div className={styles.invoice} id="invoice">
          <div className={styles.invoiceHeader}>
            <h2>{shopDetails.name || "Shop Name"}</h2>
            <p>{shopDetails.address || "Shop Address"}</p>
            <p><strong>Date:</strong> {shopDetails.date}</p>
            <p><strong>Bill No:</strong> {shopDetails.billNumber}</p>
            <p><strong>Payment Method:</strong> {shopDetails.paymentMethod}</p>
          </div>

          {items.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th className="noPrint">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>Rs. {item.price}</td>
                    <td>Rs. {item.quantity * item.price}</td>
                    <td className="noPrint">
                      <button
                        onClick={() => removeItem(item.id)}
                        className={`${styles.removeBtn} noPrint`}
                      >
                        X
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={styles.noItems}>No items added yet.</p>
          )}
          <h3 className={styles.total}>Total: Rs. {getTotal()}</h3>
        </div>

        {/* Item Input Fields */}
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Item Description"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            className={styles.input}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
            className={styles.input}
          />
          <input
            type="number"
            placeholder="Price"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
            className={styles.input}
          />
          <button onClick={addItem} className={styles.addBtn}>Add Item</button>
        </div>

        {/* Download PDF Button */}
        <button onClick={generatePDF} className={styles.downloadBtn}>Download PDF</button>
      </div>
    </>
  );
};

export default InvoiceGenerator;
