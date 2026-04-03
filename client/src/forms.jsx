import { useState } from "react";

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(value, days) {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function currencyFormatter(settings) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: settings?.currencyCode || "USD",
    minimumFractionDigits: Number(settings?.decimalPlaces ?? 2),
    maximumFractionDigits: Number(settings?.decimalPlaces ?? 2)
  });
}

function money(settings, value) {
  return currencyFormatter(settings).format(Number(value || 0));
}

function createLineItem(products = []) {
  const first = products[0];
  return {
    productId: first?.id || "",
    description: first?.name || "",
    unit: first?.unit || "unit",
    quantity: 1,
    unitPrice: first?.unitPrice || 0,
    taxRate: first?.defaultTaxRate || 0,
    discountRate: 0
  };
}

function computeTotals(lineItems) {
  return lineItems.reduce(
    (summary, item) => {
      const gross = Number(item.quantity || 0) * Number(item.unitPrice || 0);
      const discount = gross * (Number(item.discountRate || 0) / 100);
      const taxable = gross - discount;
      const tax = taxable * (Number(item.taxRate || 0) / 100);
      summary.subtotal += gross;
      summary.discount += discount;
      summary.tax += tax;
      summary.total += taxable + tax;
      return summary;
    },
    { subtotal: 0, discount: 0, tax: 0, total: 0 }
  );
}

export function Modal({ title, onClose, children }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="page-header compact">
          <h3>{title}</h3>
          <button type="button" className="ghost-button" onClick={onClose}>
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ClientForm({ initialValue, onClose, onSubmit, loading }) {
  const [form, setForm] = useState(() => ({
    displayName: initialValue?.displayName || "",
    contactName: initialValue?.contactName || "",
    email: initialValue?.email || "",
    phone: initialValue?.phone || "",
    address: initialValue?.address || "",
    city: initialValue?.city || "",
    country: initialValue?.country || "",
    notes: initialValue?.notes || ""
  }));

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit(form);
  }

  return (
    <Modal title={initialValue?.id ? "Edit Client" : "Add Client"} onClose={onClose}>
      <form className="modal-form" onSubmit={handleSubmit}>
        <Field label="Client Name">
          <input value={form.displayName} onChange={(event) => setForm({ ...form, displayName: event.target.value })} required />
        </Field>
        <Field label="Contact Name">
          <input value={form.contactName} onChange={(event) => setForm({ ...form, contactName: event.target.value })} />
        </Field>
        <Field label="Email">
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        </Field>
        <Field label="Phone">
          <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
        </Field>
        <Field label="Address">
          <input value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
        </Field>
        <Field label="City">
          <input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
        </Field>
        <Field label="Country">
          <input value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })} />
        </Field>
        <Field label="Notes" full>
          <textarea rows="4" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
        </Field>
        <div className="modal-actions">
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Saving..." : "Save Client"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function ProductForm({ initialValue, onClose, onSubmit, loading }) {
  const [form, setForm] = useState(() => ({
    name: initialValue?.name || "",
    sku: initialValue?.sku || "",
    description: initialValue?.description || "",
    unit: initialValue?.unit || "unit",
    unitPrice: initialValue?.unitPrice || 0,
    defaultTaxRate: initialValue?.defaultTaxRate || 0
  }));

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit({
      ...form,
      unitPrice: Number(form.unitPrice),
      defaultTaxRate: Number(form.defaultTaxRate)
    });
  }

  return (
    <Modal title={initialValue?.id ? "Edit Product" : "Add Product"} onClose={onClose}>
      <form className="modal-form" onSubmit={handleSubmit}>
        <Field label="Product Name">
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        </Field>
        <Field label="SKU">
          <input value={form.sku} onChange={(event) => setForm({ ...form, sku: event.target.value })} />
        </Field>
        <Field label="Unit">
          <input value={form.unit} onChange={(event) => setForm({ ...form, unit: event.target.value })} />
        </Field>
        <Field label="Unit Price">
          <input type="number" min="0" step="0.01" value={form.unitPrice} onChange={(event) => setForm({ ...form, unitPrice: event.target.value })} />
        </Field>
        <Field label="Default Tax Rate (%)">
          <input type="number" min="0" step="0.01" value={form.defaultTaxRate} onChange={(event) => setForm({ ...form, defaultTaxRate: event.target.value })} />
        </Field>
        <Field label="Description" full>
          <textarea rows="4" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
        </Field>
        <div className="modal-actions">
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function PaymentForm({ initialValue, invoices, onClose, onSubmit, loading }) {
  const firstInvoice = invoices[0];
  const [form, setForm] = useState(() => ({
    invoiceId: initialValue?.invoiceId || firstInvoice?.id || "",
    paymentDate: initialValue?.paymentDate || todayString(),
    paymentMethod: initialValue?.paymentMethod || "Bank Transfer",
    amount: initialValue?.amount || firstInvoice?.balance || 0,
    reference: initialValue?.reference || "",
    notes: initialValue?.notes || ""
  }));

  const selectedInvoice = invoices.find((invoice) => invoice.id === form.invoiceId);

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit({
      ...form,
      amount: Number(form.amount)
    });
  }

  return (
    <Modal title={initialValue?.id ? "Edit Payment" : "Record Payment"} onClose={onClose}>
      <form className="modal-form" onSubmit={handleSubmit}>
        <Field label="Invoice">
          <select
            value={form.invoiceId}
            onChange={(event) => {
              const nextInvoice = invoices.find((invoice) => invoice.id === event.target.value);
              setForm({
                ...form,
                invoiceId: event.target.value,
                amount: nextInvoice?.balance || form.amount
              });
            }}
          >
            {invoices.map((invoice) => (
              <option key={invoice.id} value={invoice.id}>
                {invoice.invoiceNumber} - {invoice.clientName}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Date">
          <input type="date" value={form.paymentDate} onChange={(event) => setForm({ ...form, paymentDate: event.target.value })} />
        </Field>
        <Field label="Method">
          <select value={form.paymentMethod} onChange={(event) => setForm({ ...form, paymentMethod: event.target.value })}>
            {["Bank Transfer", "Cash", "Card", "Mobile Money", "Cheque"].map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Amount">
          <input type="number" min="0" step="0.01" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} />
        </Field>
        <Field label="Reference">
          <input value={form.reference} onChange={(event) => setForm({ ...form, reference: event.target.value })} />
        </Field>
        <Field label="Notes" full>
          <textarea rows="4" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
        </Field>
        {selectedInvoice ? (
          <div className="summary-card full-span">
            <strong>{selectedInvoice.invoiceNumber}</strong>
            <span>Balance: {selectedInvoice.balance}</span>
          </div>
        ) : null}
        <div className="modal-actions">
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Saving..." : "Save Payment"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function DocumentForm({ type, settings, clients, products, initialValue, onClose, onSubmit, loading }) {
  const today = todayString();
  const [form, setForm] = useState(() => ({
    title: initialValue?.title || "",
    clientId: initialValue?.clientId || clients[0]?.id || "",
    status:
      initialValue?.status ||
      (type === "quote" ? "draft" : type === "recurring" ? "active" : "draft"),
    issueDate: initialValue?.issueDate || today,
    dueDate: initialValue?.dueDate || addDays(today, 14),
    validUntil: initialValue?.validUntil || addDays(today, 14),
    reference: initialValue?.reference || "",
    notes: initialValue?.notes || "",
    terms: initialValue?.terms || settings?.paymentTerms || "",
    currencyCode: initialValue?.currencyCode || settings?.currencyCode || "USD",
    frequency: initialValue?.frequency || "monthly",
    intervalCount: initialValue?.intervalCount || 1,
    nextRunDate: initialValue?.nextRunDate || today,
    paymentTermDays: initialValue?.paymentTermDays || 14,
    lineItems: initialValue?.lineItems?.length ? initialValue.lineItems : [createLineItem(products)]
  }));

  const totals = computeTotals(form.lineItems);

  function updateLine(index, updates) {
    setForm({
      ...form,
      lineItems: form.lineItems.map((lineItem, lineIndex) => (lineIndex === index ? { ...lineItem, ...updates } : lineItem))
    });
  }

  function handleProductChange(index, productId) {
    const product = products.find((entry) => entry.id === productId);
    updateLine(index, {
      productId,
      description: product?.name || "",
      unit: product?.unit || "unit",
      unitPrice: product?.unitPrice || 0,
      taxRate: product?.defaultTaxRate || 0
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = {
      ...form,
      intervalCount: Number(form.intervalCount),
      paymentTermDays: Number(form.paymentTermDays),
      lineItems: form.lineItems.map((lineItem) => ({
        ...lineItem,
        quantity: Number(lineItem.quantity),
        unitPrice: Number(lineItem.unitPrice),
        taxRate: Number(lineItem.taxRate),
        discountRate: Number(lineItem.discountRate)
      }))
    };
    await onSubmit(payload);
  }

  return (
    <Modal
      title={
        initialValue?.id
          ? `Edit ${type === "quote" ? "Estimate" : type === "recurring" ? "Recurring Template" : "Invoice"}`
          : `New ${type === "quote" ? "Estimate" : type === "recurring" ? "Recurring Template" : "Invoice"}`
      }
      onClose={onClose}
    >
      <form className="modal-form wide" onSubmit={handleSubmit}>
        {type === "recurring" ? (
          <Field label="Template Title">
            <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
          </Field>
        ) : null}
        <Field label="Client">
          <select value={form.clientId} onChange={(event) => setForm({ ...form, clientId: event.target.value })}>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.displayName}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Reference">
          <input value={form.reference} onChange={(event) => setForm({ ...form, reference: event.target.value })} />
        </Field>
        {type === "quote" ? (
          <Field label="Status">
            <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
              {["draft", "sent", "accepted", "rejected"].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </Field>
        ) : null}
        {type === "invoice" ? (
          <Field label="Status">
            <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
              {["draft", "sent"].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </Field>
        ) : null}
        {type === "recurring" ? (
          <>
            <Field label="Status">
              <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                {["active", "paused"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Frequency">
              <select value={form.frequency} onChange={(event) => setForm({ ...form, frequency: event.target.value })}>
                {["daily", "weekly", "monthly"].map((frequency) => (
                  <option key={frequency} value={frequency}>
                    {frequency}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Interval Count">
              <input type="number" min="1" step="1" value={form.intervalCount} onChange={(event) => setForm({ ...form, intervalCount: event.target.value })} />
            </Field>
            <Field label="Next Run Date">
              <input type="date" value={form.nextRunDate} onChange={(event) => setForm({ ...form, nextRunDate: event.target.value })} />
            </Field>
            <Field label="Payment Term Days">
              <input type="number" min="1" step="1" value={form.paymentTermDays} onChange={(event) => setForm({ ...form, paymentTermDays: event.target.value })} />
            </Field>
          </>
        ) : (
          <>
            <Field label="Issue Date">
              <input type="date" value={form.issueDate} onChange={(event) => setForm({ ...form, issueDate: event.target.value })} />
            </Field>
            <Field label={type === "quote" ? "Valid Until" : "Due Date"}>
              <input
                type="date"
                value={type === "quote" ? form.validUntil : form.dueDate}
                onChange={(event) => setForm({ ...form, [type === "quote" ? "validUntil" : "dueDate"]: event.target.value })}
              />
            </Field>
          </>
        )}
        <Field label="Terms" full>
          <textarea rows="3" value={form.terms} onChange={(event) => setForm({ ...form, terms: event.target.value })} />
        </Field>
        <Field label="Notes" full>
          <textarea rows="4" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
        </Field>

        <div className="full-span">
          <div className="page-header compact">
            <h4>Line Items</h4>
            <button type="button" className="ghost-button" onClick={() => setForm({ ...form, lineItems: [...form.lineItems, createLineItem(products)] })}>
              Add Line
            </button>
          </div>

          <div className="line-items">
            {form.lineItems.map((lineItem, index) => (
              <div key={index} className="line-item-card">
                <select value={lineItem.productId || ""} onChange={(event) => handleProductChange(index, event.target.value)}>
                  <option value="">Custom Line Item</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <input value={lineItem.description} placeholder="Description" onChange={(event) => updateLine(index, { description: event.target.value })} />
                <input value={lineItem.unit} placeholder="Unit" onChange={(event) => updateLine(index, { unit: event.target.value })} />
                <input type="number" min="0" step="0.01" value={lineItem.quantity} placeholder="Qty" onChange={(event) => updateLine(index, { quantity: event.target.value })} />
                <input type="number" min="0" step="0.01" value={lineItem.unitPrice} placeholder="Unit Price" onChange={(event) => updateLine(index, { unitPrice: event.target.value })} />
                <input type="number" min="0" step="0.01" value={lineItem.taxRate} placeholder="Tax %" onChange={(event) => updateLine(index, { taxRate: event.target.value })} />
                <input type="number" min="0" step="0.01" value={lineItem.discountRate} placeholder="Discount %" onChange={(event) => updateLine(index, { discountRate: event.target.value })} />
                <button type="button" className="ghost-button" onClick={() => setForm({ ...form, lineItems: form.lineItems.filter((_, lineIndex) => lineIndex !== index) })} disabled={form.lineItems.length === 1}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="summary-card full-span">
          <span>Sub-total: {money(settings, totals.subtotal)}</span>
          <span>Discount: {money(settings, totals.discount)}</span>
          <span>Tax: {money(settings, totals.tax)}</span>
          <strong>Total: {money(settings, totals.total)}</strong>
        </div>

        <div className="modal-actions">
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function SettingsForm({ initialValue, onSubmit, loading }) {
  const [form, setForm] = useState(() => ({
    companyName: initialValue?.companyName || "",
    logoText: initialValue?.logoText || "WES Manager",
    addressLine1: initialValue?.addressLine1 || "",
    addressLine2: initialValue?.addressLine2 || "",
    city: initialValue?.city || "",
    country: initialValue?.country || "",
    email: initialValue?.email || "",
    phone: initialValue?.phone || "",
    website: initialValue?.website || "",
    taxId: initialValue?.taxId || "",
    currencyCode: initialValue?.currencyCode || "USD",
    currencySymbol: initialValue?.currencySymbol || "$",
    currencyPosition: initialValue?.currencyPosition || "prefix",
    decimalPlaces: initialValue?.decimalPlaces || 2,
    defaultTaxRate: initialValue?.defaultTaxRate || 0,
    taxLabel: initialValue?.taxLabel || "VAT",
    paymentTerms: initialValue?.paymentTerms || "",
    invoicePrefix: initialValue?.invoicePrefix || "INV",
    quotePrefix: initialValue?.quotePrefix || "EST",
    paymentPrefix: initialValue?.paymentPrefix || "PAY"
  }));

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit({
      ...form,
      decimalPlaces: Number(form.decimalPlaces),
      defaultTaxRate: Number(form.defaultTaxRate)
    });
  }

  return (
    <form className="modal-form settings-grid" onSubmit={handleSubmit}>
      {Object.entries({
        companyName: "Company Name",
        logoText: "Logo Text",
        addressLine1: "Address Line 1",
        addressLine2: "Address Line 2",
        city: "City",
        country: "Country",
        email: "Email",
        phone: "Phone",
        website: "Website",
        taxId: "Tax ID",
        currencyCode: "Currency Code",
        currencySymbol: "Currency Symbol",
        taxLabel: "Tax Label",
        invoicePrefix: "Invoice Prefix",
        quotePrefix: "Estimate Prefix",
        paymentPrefix: "Payment Prefix"
      }).map(([key, label]) => (
        <Field key={key} label={label}>
          <input value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} />
        </Field>
      ))}
      <Field label="Currency Position">
        <select value={form.currencyPosition} onChange={(event) => setForm({ ...form, currencyPosition: event.target.value })}>
          <option value="prefix">Prefix</option>
          <option value="suffix">Suffix</option>
        </select>
      </Field>
      <Field label="Decimal Places">
        <input type="number" min="0" max="4" value={form.decimalPlaces} onChange={(event) => setForm({ ...form, decimalPlaces: event.target.value })} />
      </Field>
      <Field label="Default Tax Rate (%)">
        <input type="number" min="0" step="0.01" value={form.defaultTaxRate} onChange={(event) => setForm({ ...form, defaultTaxRate: event.target.value })} />
      </Field>
      <Field label="Payment Terms" full>
        <textarea rows="4" value={form.paymentTerms} onChange={(event) => setForm({ ...form, paymentTerms: event.target.value })} />
      </Field>
      <div className="modal-actions full-span">
        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, children, full = false }) {
  return (
    <label className={`field ${full ? "full-span" : ""}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}
