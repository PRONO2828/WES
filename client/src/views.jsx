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

function formatDate(value) {
  if (!value) {
    return "Not set";
  }
  return new Date(`${value}T00:00:00`).toLocaleDateString();
}

export function StatusBadge({ status }) {
  const tone =
    status === "paid" || status === "accepted" || status === "active"
      ? "success"
      : status === "overdue" || status === "rejected"
        ? "danger"
        : status === "draft" || status === "paused"
          ? "neutral"
          : "info";

  return <span className={`status-badge ${tone}`}>{String(status || "").replace(/^\w/, (match) => match.toUpperCase())}</span>;
}

export function LoginView({ loading, error, onSubmit }) {
  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await onSubmit({
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || "")
    });
  }

  return (
    <div className="login-shell">
      <div className="login-panel hero-card">
        <div className="hero-copy">
          <span className="eyebrow">WES Manager</span>
          <h1>Industrial Invoice Control</h1>
          <p>
            Dashboard reporting, client records, invoices, estimates, payments, recurring billing, and PDF exports in one
            workflow.
          </p>
          <div className="hero-metrics">
            <div>
              <strong>Invoices</strong>
              <span>Track paid, unpaid, and overdue balances.</span>
            </div>
            <div>
              <strong>Estimates</strong>
              <span>Build quotes and convert them into invoices.</span>
            </div>
            <div>
              <strong>Payments</strong>
              <span>Record receipts and keep balances current.</span>
            </div>
          </div>
        </div>
      </div>

      <form className="login-panel auth-card" onSubmit={handleSubmit}>
        <div className="brand-block">
          <div className="brand-mark">WES</div>
          <div>
            <strong>WES Manager</strong>
            <p>Invoice manager rebranded for engineering operations.</p>
          </div>
        </div>

        <label className="field">
          <span>Email</span>
          <input name="email" type="email" placeholder="user@example.com" autoComplete="username" required />
        </label>

        <label className="field">
          <span>Password</span>
          <input name="password" type="password" placeholder="Enter the password configured on the server" autoComplete="current-password" required />
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <div className="demo-note">
          <span>Credentials</span>
          <p>Login credentials are configured outside this repository at deploy time and are intentionally not stored here.</p>
        </div>
      </form>
    </div>
  );
}

export function Layout({ session, view, navItems, onViewChange, onLogout, onQuickAction, children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar-card">
        <div className="brand-block sidebar-brand">
          <div className="brand-mark">WES</div>
          <div>
            <strong>WES Manager</strong>
            <p>{session.user.role === "admin" ? "Admin Workspace" : "Sales Workspace"}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-link ${view === item.id ? "active" : ""}`}
              onClick={() => onViewChange(item.id)}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="secondary-button" onClick={onQuickAction}>
            New Invoice
          </button>
          <button type="button" className="ghost-button" onClick={onLogout}>
            Log Out
          </button>
        </div>
      </aside>

      <main className="workspace-shell">{children}</main>
    </div>
  );
}

export function DashboardView({ dashboard, settings, onViewChange }) {
  if (!dashboard) {
    return <section className="page-card">Loading dashboard...</section>;
  }

  return (
    <section className="page-grid">
      <div className="page-card">
        <div className="page-header">
          <div>
            <span className="eyebrow">Dashboard</span>
            <h2>Invoice Overview</h2>
          </div>
          <button type="button" className="ghost-button" onClick={() => onViewChange("invoices")}>
            Open Invoices
          </button>
        </div>

        <div className="metric-grid">
          <MetricCard label="Total Invoices" value={dashboard.metrics.totalInvoices} />
          <MetricCard label="Paid" value={dashboard.metrics.paidInvoices} />
          <MetricCard label="Unpaid" value={dashboard.metrics.unpaidInvoices} />
          <MetricCard label="Overdue" value={dashboard.metrics.overdueInvoices} />
          <MetricCard label="Total Billed" value={money(settings, dashboard.metrics.totalBilled)} />
          <MetricCard label="Outstanding" value={money(settings, dashboard.metrics.outstandingBalance)} />
          <MetricCard label="Estimates" value={dashboard.metrics.totalQuotes} />
          <MetricCard label="Recurring" value={dashboard.metrics.activeRecurring} />
        </div>
      </div>

      <div className="page-card">
        <div className="page-header">
          <h3>Status Breakdown</h3>
        </div>
        <div className="breakdown-list">
          {dashboard.statusBreakdown.map((entry) => (
            <div key={entry.label} className="breakdown-item">
              <div>
                <strong>{entry.label}</strong>
                <p>{entry.count} invoices</p>
              </div>
              <StatusBadge status={entry.status} />
            </div>
          ))}
        </div>
      </div>

      <CardTable
        title="Recent Invoices"
        actionLabel="View All"
        onAction={() => onViewChange("invoices")}
        columns={["Invoice", "Client", "Issue", "Total", "Status"]}
        rows={dashboard.recentInvoices.map((invoice) => [
          invoice.invoiceNumber,
          invoice.clientName,
          formatDate(invoice.issueDate),
          money(settings, invoice.total),
          <StatusBadge key={invoice.id} status={invoice.status} />
        ])}
      />

      <CardTable
        title="Recent Payments"
        actionLabel="View All"
        onAction={() => onViewChange("payments")}
        columns={["Payment", "Invoice", "Client", "Date", "Amount"]}
        rows={dashboard.recentPayments.map((payment) => [
          payment.paymentNumber,
          payment.invoiceNumber,
          payment.clientName,
          formatDate(payment.paymentDate),
          money(settings, payment.amount)
        ])}
      />

      <CardTable
        title="Overdue Invoices"
        actionLabel="Filter"
        onAction={() => onViewChange("invoices")}
        columns={["Invoice", "Client", "Due", "Balance", "Status"]}
        rows={dashboard.overdueInvoices.map((invoice) => [
          invoice.invoiceNumber,
          invoice.clientName,
          formatDate(invoice.dueDate),
          money(settings, invoice.balance),
          <StatusBadge key={invoice.id} status={invoice.status} />
        ])}
      />

      <CardTable
        title="Recurring Due Soon"
        actionLabel="Open"
        onAction={() => onViewChange("recurring")}
        columns={["Template", "Client", "Next Run", "Total", "Status"]}
        rows={dashboard.recurringDueSoon.map((profile) => [
          profile.profileNumber,
          profile.clientName,
          formatDate(profile.nextRunDate),
          money(settings, profile.total),
          <StatusBadge key={profile.id} status={profile.status} />
        ])}
      />
    </section>
  );
}

export function EntityPage({ title, description, filters, onFiltersChange, primaryAction, columns, rows }) {
  return (
    <section className="page-card">
      <div className="page-header">
        <div>
          <span className="eyebrow">{title}</span>
          <h2>{description}</h2>
        </div>
        <button type="button" className="primary-button" onClick={primaryAction.onClick}>
          {primaryAction.label}
        </button>
      </div>

      <div className="toolbar">
        <input
          value={filters.search}
          onChange={(event) => onFiltersChange({ ...filters, search: event.target.value })}
          placeholder={`Search ${title.toLowerCase()}`}
        />
      </div>

      <DataTable columns={columns} rows={rows} />
    </section>
  );
}

export function DocumentsPage({ title, description, filters, onFiltersChange, primaryAction, clients, columns, rows }) {
  return (
    <section className="page-card">
      <div className="page-header">
        <div>
          <span className="eyebrow">{title}</span>
          <h2>{description}</h2>
        </div>
        <button type="button" className="primary-button" onClick={primaryAction.onClick}>
          {primaryAction.label}
        </button>
      </div>

      <div className="toolbar toolbar-grid">
        <input
          value={filters.search}
          onChange={(event) => onFiltersChange({ ...filters, search: event.target.value })}
          placeholder={`Search ${title.toLowerCase()}`}
        />
        <select value={filters.status} onChange={(event) => onFiltersChange({ ...filters, status: event.target.value })}>
          <option value="all">All Statuses</option>
          {filters.statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select value={filters.clientId} onChange={(event) => onFiltersChange({ ...filters, clientId: event.target.value })}>
          <option value="">All Clients</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.displayName}
            </option>
          ))}
        </select>
        <input type="date" value={filters.from} onChange={(event) => onFiltersChange({ ...filters, from: event.target.value })} />
        <input type="date" value={filters.to} onChange={(event) => onFiltersChange({ ...filters, to: event.target.value })} />
      </div>

      <DataTable columns={columns} rows={rows} />
    </section>
  );
}

export function SettingsPage({ children }) {
  return <section className="page-card">{children}</section>;
}

export function DataTable({ columns, rows }) {
  return (
    <div className="data-table">
      <div className="table-row table-head">
        {columns.map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>
      {rows.length ? (
        rows.map((row, index) => (
          <div key={index} className="table-row">
            {row.map((cell, cellIndex) => (
              <div key={cellIndex} className="table-cell">
                {cell}
              </div>
            ))}
          </div>
        ))
      ) : (
        <div className="empty-table">No records found for the current filters.</div>
      )}
    </div>
  );
}

function CardTable({ title, actionLabel, onAction, columns, rows }) {
  return (
    <div className="page-card">
      <div className="page-header compact">
        <h3>{title}</h3>
        <button type="button" className="ghost-button" onClick={onAction}>
          {actionLabel}
        </button>
      </div>
      <DataTable columns={columns} rows={rows} />
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
