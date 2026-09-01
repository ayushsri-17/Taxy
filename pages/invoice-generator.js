import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import styles from "../styles/invoice-gen.module.css";

export default function InvoiceGenerator() {
  const invoiceRef = useRef(null);
  const [activeTab, setActiveTab] = useState("parties"); // 'parties', 'items', 'payment'

  // Seller Details
  const [seller, setSeller] = useState({
    name: "",
    address: "",
    gstin: "",
    phone: "",
    email: "",
    state: "",
  });

  // Buyer / Client Details
  const [buyer, setBuyer] = useState({
    name: "",
    company: "",
    address: "",
    gstin: "",
    phone: "",
    state: "",
  });

  // Invoice Metadata
  const [meta, setMeta] = useState({
    invoiceNumber: "INV-001",
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0],
    supplyType: "intra", // 'intra' (CGST+SGST) vs 'inter' (IGST)
  });

  // Items List
  const [items, setItems] = useState([]);

  // New Item Input
  const [newItem, setNewItem] = useState({
    description: "",
    hsn: "",
    quantity: 1,
    price: "",
    gstRate: 18,
    discount: 0,
  });

  // Bank / Payment Info
  const [payment, setPayment] = useState({
    bankName: "",
    accountNo: "",
    ifsc: "",
    upiId: "",
    paymentMode: "Bank Transfer / UPI",
    notes: "1. Payment is due within 15 days from the date of invoice.\n2. Please quote invoice number on your bank transfer.",
  });

  const [isExporting, setIsExporting] = useState(false);

  // Load saved seller info from localStorage
  useEffect(() => {
    try {
      const savedSeller = localStorage.getItem("taxy_invoice_seller");
      if (savedSeller) {
        setSeller(JSON.parse(savedSeller));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save seller info to localStorage
  const saveSellerProfile = () => {
    try {
      localStorage.setItem("taxy_invoice_seller", JSON.stringify(seller));
      alert("Business profile saved successfully for future invoices!");
    } catch (e) {
      console.error(e);
    }
  };

  const addItem = () => {
    if (!newItem.description || newItem.price === "") return;
    const item = {
      ...newItem,
      id: Date.now(),
      quantity: Number(newItem.quantity) || 1,
      price: parseFloat(newItem.price) || 0,
      gstRate: parseFloat(newItem.gstRate) || 0,
      discount: parseFloat(newItem.discount) || 0,
    };
    setItems([...items, item]);
    setNewItem({ description: "", hsn: "", quantity: 1, price: "", gstRate: 18, discount: 0 });
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Calculations
  const subtotal = items.reduce((acc, item) => {
    const itemNet = item.quantity * item.price * (1 - item.discount / 100);
    return acc + itemNet;
  }, 0);

  const totalGst = items.reduce((acc, item) => {
    const itemNet = item.quantity * item.price * (1 - item.discount / 100);
    return acc + (itemNet * item.gstRate) / 100;
  }, 0);

  const cgst = meta.supplyType === "intra" ? totalGst / 2 : 0;
  const sgst = meta.supplyType === "intra" ? totalGst / 2 : 0;
  const igst = meta.supplyType === "inter" ? totalGst : 0;
  const grandTotal = Math.round(subtotal + totalGst);

  // Generate Crisp High-Resolution PDF
  const generatePDF = async () => {
    if (!invoiceRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${meta.invoiceNumber || "Tax_Invoice"}.pdf`);
    } catch (err) {
      console.error("PDF generation failed", err);
      alert("Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Link href="/" className={styles.backLink}>
        ← Back to Home
      </Link>

      <div className={styles.headerSection}>
        <div className={styles.badge}>GST Compliant Invoicing</div>
        <h1 className={styles.mainTitle}>Professional Tax Invoice Generator</h1>
        <p className={styles.subtitle}>
          Create GST-compliant invoices with line-item tax calculations, client details, and instant A4 PDF export.
        </p>
      </div>

      <div className={styles.workspaceGrid}>
        {/* LEFT PANEL: Glass Controls */}
        <div className={styles.editorPanel}>
          {/* Tabs */}
          <div className={styles.tabBar}>
            <button
              type="button"
              className={activeTab === "parties" ? styles.activeTabBtn : styles.tabBtn}
              onClick={() => setActiveTab("parties")}
            >
              👥 Seller & Buyer
            </button>
            <button
              type="button"
              className={activeTab === "items" ? styles.activeTabBtn : styles.tabBtn}
              onClick={() => setActiveTab("items")}
            >
              📦 Items & GST ({items.length})
            </button>
            <button
              type="button"
              className={activeTab === "payment" ? styles.activeTabBtn : styles.tabBtn}
              onClick={() => setActiveTab("payment")}
            >
              🏦 Payment & Meta
            </button>
          </div>

          {/* TAB 1: PARTIES */}
          {activeTab === "parties" && (
            <div>
              <div className={styles.sectionHeading}>
                <span>🏢</span> Billed By (Your Business Details)
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Business / Shop Name</label>
                <input
                  className={styles.input}
                  type="text"
                  value={seller.name}
                  onChange={(e) => setSeller({ ...seller, name: e.target.value })}
                  placeholder="e.g. Apex Solutions Pvt Ltd"
                />
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>GSTIN</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={seller.gstin}
                    onChange={(e) => setSeller({ ...seller, gstin: e.target.value })}
                    placeholder="29AAAAA0000A1Z5"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Phone / Email</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={seller.phone}
                    onChange={(e) => setSeller({ ...seller, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Full Address & State</label>
                <input
                  className={styles.input}
                  type="text"
                  value={seller.address}
                  onChange={(e) => setSeller({ ...seller, address: e.target.value })}
                  placeholder="Street, City, State, PIN"
                />
              </div>

              <button
                type="button"
                onClick={saveSellerProfile}
                style={{
                  fontSize: "12px",
                  color: "#1C3F3A",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "600",
                  marginBottom: "18px",
                  textDecoration: "underline",
                }}
              >
                💾 Save my business details for future invoices
              </button>

              <hr style={{ border: "0.5px solid rgba(28,63,58,0.1)", margin: "14px 0" }} />

              <div className={styles.sectionHeading}>
                <span>👤</span> Billed To (Client / Buyer Details)
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Client Name</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={buyer.name}
                    onChange={(e) => setBuyer({ ...buyer, name: e.target.value })}
                    placeholder="e.g. Rahul Verma"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Company Name (Optional)</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={buyer.company}
                    onChange={(e) => setBuyer({ ...buyer, company: e.target.value })}
                    placeholder="e.g. Verma Enterprises"
                  />
                </div>
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Client GSTIN (B2B)</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={buyer.gstin}
                    onChange={(e) => setBuyer({ ...buyer, gstin: e.target.value })}
                    placeholder="07BBBBB1111B1Z2 (or leave blank)"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Client State</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={buyer.state}
                    onChange={(e) => setBuyer({ ...buyer, state: e.target.value })}
                    placeholder="Delhi (07)"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Client Address</label>
                <input
                  className={styles.input}
                  type="text"
                  value={buyer.address}
                  onChange={(e) => setBuyer({ ...buyer, address: e.target.value })}
                  placeholder="Street, City, State, PIN"
                />
              </div>
            </div>
          )}

          {/* TAB 2: ITEMS */}
          {activeTab === "items" && (
            <div>
              <div className={styles.sectionHeading}>
                <span>➕</span> Add Line Item
              </div>

              <div className={styles.itemEntryCard}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Item / Service Description</label>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="e.g. Web Development / Hardware Consult"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  />
                </div>

                <div className={styles.fieldRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>HSN / SAC Code</label>
                    <input
                      className={styles.input}
                      type="text"
                      placeholder="e.g. 998314"
                      value={newItem.hsn}
                      onChange={(e) => setNewItem({ ...newItem, hsn: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Quantity</label>
                    <input
                      className={styles.input}
                      type="number"
                      min="1"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.fieldRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Rate / Unit Price (₹)</label>
                    <input
                      className={styles.input}
                      type="number"
                      placeholder="e.g. 5000"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>GST Slab (%)</label>
                    <select
                      className={styles.input}
                      value={newItem.gstRate}
                      onChange={(e) => setNewItem({ ...newItem, gstRate: e.target.value })}
                    >
                      <option value="0">0%</option>
                      <option value="5">5%</option>
                      <option value="12">12%</option>
                      <option value="18">18%</option>
                      <option value="28">28%</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addItem}
                  className={styles.primaryBtn}
                  style={{ width: "100%", marginTop: "8px" }}
                >
                  + Add Item to Invoice
                </button>
              </div>

              {/* Added Items List */}
              <div className={styles.sectionHeading}>
                <span>📋</span> Invoice Line Items ({items.length})
              </div>

              <div className={styles.itemsListReview}>
                {items.length === 0 ? (
                  <div style={{ fontSize: "13px", color: "#8A9C98", padding: "12px", textAlign: "center" }}>
                    No items added yet.
                  </div>
                ) : (
                  items.map((item) => (
                    <div className={styles.itemCardReview} key={item.id}>
                      <div>
                        <strong>{item.description}</strong>
                        <div style={{ fontSize: "11px", color: "#5F7773" }}>
                          Qty: {item.quantity} × ₹{item.price} | GST: {item.gstRate}%
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontWeight: "700", color: "#1C3F3A" }}>
                          ₹{(item.quantity * item.price).toLocaleString("en-IN")}
                        </span>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => removeItem(item.id)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PAYMENT & META */}
          {activeTab === "payment" && (
            <div>
              <div className={styles.sectionHeading}>
                <span>📑</span> Invoice Details & GST Rule
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Invoice Number</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={meta.invoiceNumber}
                    onChange={(e) => setMeta({ ...meta, invoiceNumber: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Invoice Date</label>
                  <input
                    className={styles.input}
                    type="date"
                    value={meta.date}
                    onChange={(e) => setMeta({ ...meta, date: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Payment Due Date</label>
                  <input
                    className={styles.input}
                    type="date"
                    value={meta.dueDate}
                    onChange={(e) => setMeta({ ...meta, dueDate: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>GST Tax Type</label>
                  <select
                    className={styles.input}
                    value={meta.supplyType}
                    onChange={(e) => setMeta({ ...meta, supplyType: e.target.value })}
                  >
                    <option value="intra">Intra-State (CGST + SGST)</option>
                    <option value="inter">Inter-State (IGST)</option>
                  </select>
                </div>
              </div>

              <hr style={{ border: "0.5px solid rgba(28,63,58,0.1)", margin: "14px 0" }} />

              <div className={styles.sectionHeading}>
                <span>🏦</span> Bank & UPI Payment Details
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Bank Name</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={payment.bankName}
                    onChange={(e) => setPayment({ ...payment, bankName: e.target.value })}
                    placeholder="e.g. HDFC Bank"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Account Number</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={payment.accountNo}
                    onChange={(e) => setPayment({ ...payment, accountNo: e.target.value })}
                    placeholder="50200012345678"
                  />
                </div>
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>IFSC Code</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={payment.ifsc}
                    onChange={(e) => setPayment({ ...payment, ifsc: e.target.value })}
                    placeholder="HDFC0000123"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>UPI ID / VPA</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={payment.upiId}
                    onChange={(e) => setPayment({ ...payment, upiId: e.target.value })}
                    placeholder="business@upi"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Terms & Conditions</label>
                <textarea
                  className={styles.input}
                  rows={3}
                  value={payment.notes}
                  onChange={(e) => setPayment({ ...payment, notes: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className={styles.actionBtnsGroup}>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={generatePDF}
              disabled={isExporting}
            >
              {isExporting ? "Generating PDF..." : "📥 Download A4 PDF"}
            </button>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => window.print()}
            >
              🖨️ Print
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: Live A4 Document Preview */}
        <div className={styles.previewContainer}>
          <div className={styles.previewToolbar}>
            <div className={styles.previewTitle}>✨ Live A4 Tax Invoice Preview</div>
            <span style={{ fontSize: "12px", color: "#5F7773" }}>Ready for Export</span>
          </div>

          <div className={styles.a4InvoicePaper} ref={invoiceRef} id="invoice">
            {/* Header */}
            <div className={styles.invoiceTopBar}>
              <div>
                <h2 className={styles.sellerName}>{seller.name || "Your Business Name"}</h2>
                <div style={{ color: "#5F7773", fontSize: "12px", maxWidth: "320px" }}>
                  {seller.address || "Business Address"}
                </div>
                {seller.gstin && <div style={{ fontSize: "12px", marginTop: "4px" }}><strong>GSTIN:</strong> {seller.gstin}</div>}
                {seller.phone && <div style={{ fontSize: "12px", color: "#5F7773" }}>Tel: {seller.phone} | {seller.email}</div>}
              </div>

              <div>
                <div className={styles.docTitle}>TAX INVOICE</div>
                <div className={styles.docMeta}>
                  <div><strong>Invoice #:</strong> {meta.invoiceNumber}</div>
                  <div><strong>Date:</strong> {meta.date}</div>
                  <div><strong>Due Date:</strong> {meta.dueDate}</div>
                </div>
              </div>
            </div>

            {/* Billed To / Billed By Grid */}
            <div className={styles.partiesGrid}>
              <div className={styles.partyCol}>
                <h4>Billed To (Client):</h4>
                <div style={{ fontWeight: "700", color: "#0A0C29" }}>{buyer.name || "Client Name"}</div>
                {buyer.company && <div style={{ color: "#5F7773" }}>{buyer.company}</div>}
                <div style={{ color: "#5F7773", fontSize: "12px" }}>{buyer.address || "Client Address"}</div>
                {buyer.gstin && <div style={{ fontSize: "12px", marginTop: "2px" }}><strong>GSTIN:</strong> {buyer.gstin}</div>}
              </div>

              <div className={styles.partyCol}>
                <h4>Supply & Payment Info:</h4>
                <div><strong>Place of Supply:</strong> {buyer.state || "State"}</div>
                <div><strong>Supply Type:</strong> {meta.supplyType === "intra" ? "Intra-State (CGST + SGST)" : "Inter-State (IGST)"}</div>
                <div><strong>Payment Mode:</strong> {payment.paymentMode}</div>
              </div>
            </div>

            {/* Items Table */}
            <table className={styles.invoiceTable}>
              <thead>
                <tr>
                  <th style={{ width: "38%" }}>Item Description</th>
                  <th style={{ width: "12%" }}>HSN/SAC</th>
                  <th style={{ width: "10%", textAlign: "center" }}>Qty</th>
                  <th style={{ width: "15%", textAlign: "right" }}>Rate</th>
                  <th style={{ width: "10%", textAlign: "center" }}>GST</th>
                  <th style={{ width: "15%", textAlign: "right" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "20px", color: "#999" }}>
                      No items added to this invoice.
                    </td>
                  </tr>
                ) : (
                  items.map((item, idx) => {
                    const itemNet = item.quantity * item.price * (1 - item.discount / 100);
                    return (
                      <tr key={idx}>
                        <td><strong>{item.description}</strong></td>
                        <td>{item.hsn || "-"}</td>
                        <td style={{ textAlign: "center" }}>{item.quantity}</td>
                        <td style={{ textAlign: "right" }}>₹{item.price.toLocaleString("en-IN")}</td>
                        <td style={{ textAlign: "center" }}>{item.gstRate}%</td>
                        <td style={{ textAlign: "right" }}>₹{itemNet.toLocaleString("en-IN")}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Summary & Bank Info */}
            <div className={styles.summarySection}>
              {/* Payment Details */}
              <div className={styles.paymentInfoBox}>
                <div style={{ fontWeight: "700", color: "#1C3F3A", marginBottom: "4px" }}>
                  🏦 Bank & Transfer Details:
                </div>
                <div><strong>Bank:</strong> {payment.bankName}</div>
                <div><strong>A/C No:</strong> {payment.accountNo}</div>
                <div><strong>IFSC:</strong> {payment.ifsc}</div>
                {payment.upiId && <div><strong>UPI ID:</strong> {payment.upiId}</div>}
              </div>

              {/* Totals Calculation */}
              <div className={styles.totalsTable}>
                <div className={styles.totalRow}>
                  <span>Taxable Subtotal:</span>
                  <span>₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>

                {meta.supplyType === "intra" ? (
                  <>
                    <div className={styles.totalRow}>
                      <span>CGST:</span>
                      <span>₹{cgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className={styles.totalRow}>
                      <span>SGST:</span>
                      <span>₹{sgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </div>
                  </>
                ) : (
                  <div className={styles.totalRow}>
                    <span>IGST:</span>
                    <span>₹{igst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                )}

                <div className={styles.grandTotalRow}>
                  <span>Grand Total:</span>
                  <span>₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* Signature and Terms */}
            <div className={styles.signatureSection}>
              <div style={{ maxWidth: "60%" }}>
                <strong>Terms & Notes:</strong>
                <div style={{ whiteSpace: "pre-line", marginTop: "4px" }}>{payment.notes}</div>
              </div>

              <div className={styles.signBox}>
                <div className={styles.signLine} />
                <div>Authorized Signatory</div>
                <div style={{ fontSize: "10px", color: "#999" }}>{seller.name}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

