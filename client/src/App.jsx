import { useEffect, useState } from "react";
import { downloadFile, request } from "./api.js";
import { ClientForm, DocumentForm, PaymentForm, ProductForm, SettingsForm } from "./forms.jsx";
import { DashboardView, DocumentsPage, EntityPage, Layout, LoginView, SettingsPage, StatusBadge } from "./views.jsx";

const SESSION_KEY = "wes-manager-session-v1";

function readStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch (error) {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getInitialView() {
  const hash = window.location.hash.replace(/^#\//, "");
  return hash || "dashboard";
}

function emptyWorkspace() {
  return {
    dashboard: null,
    clients: [],
    products: [],
    invoices: [],
    quotes: [],
    payments: [],
    recurring: [],
    settings: null
  };
}

function initialFilters() {
  return {
    clients: { search: "" },
    products: { search: "" },
    invoices: { search: "", status: "all", clientId: "", from: "", to: "", statusOptions: ["draft", "sent", "paid", "overdue"] },
    quotes: { search: "", status: "all", clientId: "", from: "", to: "", statusOptions: ["draft", "sent", "accepted", "rejected"] },
    payments: { search: "", clientId: "" },
    recurring: { search: "", status: "all" }
  };
}

export default function App() {
  const [session, setSession] = useState(() => readStorage(SESSION_KEY, null));
  const [workspace, setWorkspace] = useState(emptyWorkspace);
  const [view, setView] = useState(getInitialView);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [toast, setToast] = useState("");
  const [modal, setModal] = useState(null);

  useEffect(() => {
    writeStorage(SESSION_KEY, session);
  }, [session]);

  useEffect(() => {
    window.location.hash = `/${view}`;
  }, [view]);

  useEffect(() => {
    if (!session?.token) {
      setWorkspace(emptyWorkspace());
      return;
    }

    refreshWorkspace();
  }, [session?.token]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }
    const timeoutId = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  async function refreshWorkspace() {
    if (!session?.token) {
      return;
    }

    setLoading(true);

    try {
      const [dashboard, clients, products, invoices, quotes, payments, recurring, settings] = await Promise.all([
        request("/dashboard", { token: session.token }),
        request("/clients", { token: session.token }),
        request("/products", { token: session.token }),
        request("/invoices", { token: session.token }),
        request("/quotes", { token: session.token }),
        request("/payments", { token: session.token }),
        request("/recurring", { token: session.token }),
        request("/settings", { token: session.token })
      ]);

      setWorkspace({ dashboard, clients, products, invoices, quotes, payments, recurring, settings });
    } catch (error) {
      if (error.statusCode === 401) {
        setSession(null);
        setLoginError("Your session expired. Please sign in again.");
      } else {
        setToast(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(credentials) {
    setLoading(true);
    setLoginError("");

    try {
      const result = await request("/auth/login", {
        method: "POST",
        body: credentials
      });
      setSession(result);
      setView("dashboard");
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function performAction(task, successMessage) {
    if (!session?.token) {
      return;
    }

    setSaving(true);

    try {
      await task();
      setModal(null);
      if (successMessage) {
        setToast(successMessage);
      }
      await refreshWorkspace();
    } catch (error) {
      setToast(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function removeResource(path, message) {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }
    await performAction(() => request(path, { method: "DELETE", token: session.token }), message);
  }

  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "clients", label: "Clients" },
    { id: "products", label: "Products" },
    { id: "invoices", label: "Invoices" },
    { id: "quotes", label: "Estimates" },
    { id: "payments", label: "Payments" },
    { id: "recurring", label: "Recurring" },
    ...(session?.user?.role === "admin" ? [{ id: "settings", label: "Settings" }] : [])
  ];

  const filteredClients = workspace.clients.filter((client) =>
    [client.displayName, client.contactName, client.email, client.phone].join(" ").toLowerCase().includes(filters.clients.search.toLowerCase())
  );
  const filteredProducts = workspace.products.filter((product) =>
    [product.name, product.sku, product.description].join(" ").toLowerCase().includes(filters.products.search.toLowerCase())
  );
  const filteredPayments = workspace.payments.filter((payment) => {
    if (filters.payments.clientId && payment.client?.id !== filters.payments.clientId) {
      return false;
    }
    return [payment.paymentNumber, payment.invoiceNumber, payment.clientName, payment.reference, payment.paymentMethod]
      .join(" ")
      .toLowerCase()
      .includes(filters.payments.search.toLowerCase());
  });
  const filteredRecurring = workspace.recurring.filter((profile) => {
    if (filters.recurring.status !== "all" && profile.status !== filters.recurring.status) {
      return false;
    }
    return [profile.profileNumber, profile.title, profile.clientName, profile.reference].join(" ").toLowerCase().includes(filters.recurring.search.toLowerCase());
  });

  if (!session?.token) {
    return <LoginView loading={loading} error={loginError} onSubmit={handleLogin} />;
  }

  const invoiceRows = workspace.invoices
    .filter((invoice) => filterDocument(invoice, filters.invoices))
    .map((invoice) => [
      <div key={invoice.id}>
        <strong>{invoice.invoiceNumber}</strong>
        <p>{invoice.reference || "No reference"}</p>
      </div>,
      invoice.clientName,
      formatDate(invoice.issueDate),
      formatMoney(workspace.settings, invoice.total),
      formatMoney(workspace.settings, invoice.balance),
      <StatusBadge key={`${invoice.id}-status`} status={invoice.status} />,
      <RowActions
        key={`${invoice.id}-actions`}
        actions={[
          { label: "Edit", onClick: () => setModal({ type: "invoice", value: invoice }) },
          { label: "Send", onClick: () => performAction(() => request(`/invoices/${invoice.id}/send`, { method: "POST", token: session.token }), "Invoice marked as sent") },
          { label: "PDF", onClick: () => downloadFile(`/invoices/${invoice.id}/pdf`, session.token, `${invoice.invoiceNumber}.pdf`) },
          { label: "Delete", onClick: () => removeResource(`/invoices/${invoice.id}`, "Invoice deleted") }
        ]}
      />
    ]);

  const quoteRows = workspace.quotes
    .filter((quote) => filterDocument(quote, filters.quotes))
    .map((quote) => [
      <div key={quote.id}>
        <strong>{quote.quoteNumber}</strong>
        <p>{quote.reference || "No reference"}</p>
      </div>,
      quote.clientName,
      formatDate(quote.issueDate),
      formatMoney(workspace.settings, quote.total),
      <StatusBadge key={`${quote.id}-status`} status={quote.status} />,
      <RowActions
        key={`${quote.id}-actions`}
        actions={[
          { label: "Edit", onClick: () => setModal({ type: "quote", value: quote }) },
          { label: "Convert", onClick: () => performAction(() => request(`/quotes/${quote.id}/convert`, { method: "POST", token: session.token }), "Estimate converted into an invoice") },
          { label: "PDF", onClick: () => downloadFile(`/quotes/${quote.id}/pdf`, session.token, `${quote.quoteNumber}.pdf`) },
          { label: "Delete", onClick: () => removeResource(`/quotes/${quote.id}`, "Estimate deleted") }
        ]}
      />
    ]);

  const paymentRows = filteredPayments.map((payment) => [
    payment.paymentNumber,
    payment.invoiceNumber,
    payment.clientName,
    formatDate(payment.paymentDate),
    formatMoney(workspace.settings, payment.amount),
    <RowActions
      key={`${payment.id}-actions`}
      actions={[
        { label: "Edit", onClick: () => setModal({ type: "payment", value: payment }) },
        { label: "Delete", onClick: () => removeResource(`/payments/${payment.id}`, "Payment deleted") }
      ]}
    />
  ]);

  const recurringRows = filteredRecurring.map((profile) => [
    profile.profileNumber,
    profile.title,
    profile.clientName,
    formatDate(profile.nextRunDate),
    formatMoney(workspace.settings, profile.total),
    <StatusBadge key={`${profile.id}-status`} status={profile.status} />,
    <RowActions
      key={`${profile.id}-actions`}
      actions={[
        { label: "Edit", onClick: () => setModal({ type: "recurring", value: profile }) },
        { label: "Generate", onClick: () => performAction(() => request(`/recurring/${profile.id}/generate`, { method: "POST", token: session.token }), "Invoice generated from recurring template") },
        { label: "Delete", onClick: () => removeResource(`/recurring/${profile.id}`, "Recurring template deleted") }
      ]}
    />
  ]);

  return (
    <>
      <Layout
        session={session}
        view={view}
        navItems={navItems}
        onViewChange={setView}
        onLogout={() => setSession(null)}
        onQuickAction={() => setModal({ type: "invoice", value: null })}
      >
        <header className="page-card top-summary">
          <div>
            <span className="eyebrow">Workspace</span>
            <h1>{navItems.find((item) => item.id === view)?.label || "Dashboard"}</h1>
          </div>
          <div className="top-actions">
            <button type="button" className="ghost-button" onClick={refreshWorkspace} disabled={loading}>
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </header>

        {view === "dashboard" ? <DashboardView dashboard={workspace.dashboard} settings={workspace.settings} onViewChange={setView} /> : null}

        {view === "clients" ? (
          <EntityPage
            title="Clients"
            description="Client records and contact details"
            filters={filters.clients}
            onFiltersChange={(next) => setFilters({ ...filters, clients: next })}
            primaryAction={{ label: "Add Client", onClick: () => setModal({ type: "client", value: null }) }}
            columns={["Client", "Contact", "Email", "Phone", "Location", "Actions"]}
            rows={filteredClients.map((client) => [
              client.displayName,
              client.contactName || "Not set",
              client.email || "Not set",
              client.phone || "Not set",
              [client.city, client.country].filter(Boolean).join(", ") || "Not set",
              <RowActions
                key={`${client.id}-actions`}
                actions={[
                  { label: "Edit", onClick: () => setModal({ type: "client", value: client }) },
                  { label: "Delete", onClick: () => removeResource(`/clients/${client.id}`, "Client deleted") }
                ]}
              />
            ])}
          />
        ) : null}

        {view === "products" ? (
          <EntityPage
            title="Products"
            description="Catalog items used in invoice line items"
            filters={filters.products}
            onFiltersChange={(next) => setFilters({ ...filters, products: next })}
            primaryAction={{ label: "Add Product", onClick: () => setModal({ type: "product", value: null }) }}
            columns={["Product", "SKU", "Unit", "Rate", "Tax", "Actions"]}
            rows={filteredProducts.map((product) => [
              product.name,
              product.sku || "Not set",
              product.unit,
              formatMoney(workspace.settings, product.unitPrice),
              `${product.defaultTaxRate}%`,
              <RowActions
                key={`${product.id}-actions`}
                actions={[
                  { label: "Edit", onClick: () => setModal({ type: "product", value: product }) },
                  { label: "Delete", onClick: () => removeResource(`/products/${product.id}`, "Product deleted") }
                ]}
              />
            ])}
          />
        ) : null}

        {view === "invoices" ? (
          <DocumentsPage
            title="Invoices"
            description="Invoice search, status tracking, and PDF output"
            filters={filters.invoices}
            onFiltersChange={(next) => setFilters({ ...filters, invoices: next })}
            primaryAction={{ label: "New Invoice", onClick: () => setModal({ type: "invoice", value: null }) }}
            clients={workspace.clients}
            columns={["Invoice", "Client", "Issue Date", "Total", "Balance", "Status", "Actions"]}
            rows={invoiceRows}
          />
        ) : null}

        {view === "quotes" ? (
          <DocumentsPage
            title="Estimates"
            description="Quotation workflow with invoice conversion"
            filters={filters.quotes}
            onFiltersChange={(next) => setFilters({ ...filters, quotes: next })}
            primaryAction={{ label: "New Estimate", onClick: () => setModal({ type: "quote", value: null }) }}
            clients={workspace.clients}
            columns={["Estimate", "Client", "Issue Date", "Total", "Status", "Actions"]}
            rows={quoteRows}
          />
        ) : null}

        {view === "payments" ? (
          <EntityPage
            title="Payments"
            description="Record and maintain invoice receipts"
            filters={filters.payments}
            onFiltersChange={(next) => setFilters({ ...filters, payments: next })}
            primaryAction={{ label: "Record Payment", onClick: () => setModal({ type: "payment", value: null }) }}
            columns={["Payment", "Invoice", "Client", "Date", "Amount", "Actions"]}
            rows={paymentRows}
          />
        ) : null}

        {view === "recurring" ? (
          <EntityPage
            title="Recurring"
            description="Recurring invoice templates and generation"
            filters={filters.recurring}
            onFiltersChange={(next) => setFilters({ ...filters, recurring: next })}
            primaryAction={{ label: "New Template", onClick: () => setModal({ type: "recurring", value: null }) }}
            columns={["Template", "Title", "Client", "Next Run", "Total", "Status", "Actions"]}
            rows={recurringRows}
          />
        ) : null}

        {view === "settings" ? (
          <SettingsPage>
            <div className="page-header">
              <div>
                <span className="eyebrow">Settings</span>
                <h2>Company, currency, and tax settings</h2>
              </div>
            </div>
            <SettingsForm
              initialValue={workspace.settings}
              loading={saving}
              onSubmit={(payload) => performAction(() => request("/settings", { method: "PUT", body: payload, token: session.token }), "Settings saved")}
            />
          </SettingsPage>
        ) : null}
      </Layout>

      {toast ? <div className="toast">{toast}</div> : null}

      {modal?.type === "client" ? (
        <ClientForm
          initialValue={modal.value}
          loading={saving}
          onClose={() => setModal(null)}
          onSubmit={(payload) =>
            performAction(
              () =>
                request(modal.value ? `/clients/${modal.value.id}` : "/clients", {
                  method: modal.value ? "PUT" : "POST",
                  body: payload,
                  token: session.token
                }),
              modal.value ? "Client updated" : "Client created"
            )
          }
        />
      ) : null}

      {modal?.type === "product" ? (
        <ProductForm
          initialValue={modal.value}
          loading={saving}
          onClose={() => setModal(null)}
          onSubmit={(payload) =>
            performAction(
              () =>
                request(modal.value ? `/products/${modal.value.id}` : "/products", {
                  method: modal.value ? "PUT" : "POST",
                  body: payload,
                  token: session.token
                }),
              modal.value ? "Product updated" : "Product created"
            )
          }
        />
      ) : null}

      {["invoice", "quote", "recurring"].includes(modal?.type) ? (
        <DocumentForm
          type={modal.type}
          settings={workspace.settings}
          clients={workspace.clients}
          products={workspace.products}
          initialValue={modal.value}
          loading={saving}
          onClose={() => setModal(null)}
          onSubmit={(payload) =>
            performAction(
              () =>
                request(
                  modal.type === "invoice"
                    ? modal.value
                      ? `/invoices/${modal.value.id}`
                      : "/invoices"
                    : modal.type === "quote"
                      ? modal.value
                        ? `/quotes/${modal.value.id}`
                        : "/quotes"
                      : modal.value
                        ? `/recurring/${modal.value.id}`
                        : "/recurring",
                  {
                    method: modal.value ? "PUT" : "POST",
                    body: payload,
                    token: session.token
                  }
                ),
              modal.value ? "Record updated" : "Record created"
            )
          }
        />
      ) : null}

      {modal?.type === "payment" ? (
        <PaymentForm
          initialValue={modal.value}
          invoices={workspace.invoices.filter((invoice) => invoice.status !== "draft" && invoice.balance > 0)}
          loading={saving}
          onClose={() => setModal(null)}
          onSubmit={(payload) =>
            performAction(
              () =>
                request(modal.value ? `/payments/${modal.value.id}` : "/payments", {
                  method: modal.value ? "PUT" : "POST",
                  body: payload,
                  token: session.token
                }),
              modal.value ? "Payment updated" : "Payment recorded"
            )
          }
        />
      ) : null}
    </>
  );
}

function RowActions({ actions }) {
  return (
    <div className="row-actions">
      {actions.map((action) => (
        <button key={action.label} type="button" className="ghost-button" onClick={action.onClick}>
          {action.label}
        </button>
      ))}
    </div>
  );
}

function filterDocument(document, filter) {
  if (filter.status !== "all" && document.status !== filter.status) {
    return false;
  }
  if (filter.clientId && document.client?.id !== filter.clientId) {
    return false;
  }
  if (filter.from && document.issueDate < filter.from) {
    return false;
  }
  if (filter.to && document.issueDate > filter.to) {
    return false;
  }
  return [document.invoiceNumber, document.quoteNumber, document.clientName, document.reference]
    .join(" ")
    .toLowerCase()
    .includes(filter.search.toLowerCase());
}

function formatMoney(settings, value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: settings?.currencyCode || "USD",
    minimumFractionDigits: Number(settings?.decimalPlaces ?? 2),
    maximumFractionDigits: Number(settings?.decimalPlaces ?? 2)
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) {
    return "Not set";
  }
  return new Date(`${value}T00:00:00`).toLocaleDateString();
}
