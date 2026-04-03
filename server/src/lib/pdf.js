import PDFDocument from "pdfkit";

function moneyFormatter(settings) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: settings.currencyCode || "USD",
    minimumFractionDigits: Number(settings.decimalPlaces || 2),
    maximumFractionDigits: Number(settings.decimalPlaces || 2)
  });
}

function money(settings, value) {
  const formatted = moneyFormatter(settings).format(Number(value || 0));
  if ((settings.currencyPosition || "prefix") === "suffix") {
    return `${Number(value || 0).toFixed(Number(settings.decimalPlaces || 2))} ${settings.currencySymbol || settings.currencyCode}`;
  }
  return formatted;
}

function drawHeader(doc, settings, title, number) {
  doc.roundedRect(40, 30, 515, 110, 18).fill("#f6fbff");
  doc.roundedRect(55, 45, 140, 50, 10).fill("#1f96f2");
  doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(20).text(settings.logoText || "WES Manager", 68, 61);

  doc.fillColor("#17324a").fontSize(24).text(title, 390, 52, { width: 140, align: "right" });
  doc.fillColor("#5f7388").font("Helvetica").fontSize(10).text(number, 390, 84, { width: 140, align: "right" });

  doc
    .fillColor("#17324a")
    .font("Helvetica-Bold")
    .fontSize(11)
    .text(settings.companyName, 55, 103)
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#5f7388")
    .text([settings.addressLine1, settings.addressLine2, settings.city, settings.country].filter(Boolean).join(", "), 55, 118)
    .text([settings.email, settings.phone].filter(Boolean).join(" | "), 55, 132);
}

function drawMeta(doc, documentData, title) {
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#17324a")
    .text("Bill To", 40, 165)
    .text(title === "Estimate" ? "Estimate Details" : "Invoice Details", 360, 165);

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#4f667d")
    .text(documentData.clientName, 40, 183)
    .text(documentData.client.contactName || "", 40, 197)
    .text(documentData.client.email || "", 40, 211)
    .text(documentData.client.phone || "", 40, 225)
    .text(
      [documentData.client.address, documentData.client.city, documentData.client.country].filter(Boolean).join(", "),
      40,
      239,
      { width: 240 }
    );

  const metaRows = [
    [title === "Estimate" ? "Estimate No." : "Invoice No.", documentData.invoiceNumber || documentData.quoteNumber],
    ["Issue Date", documentData.issueDate],
    [documentData.dueDate ? "Due Date" : "Valid Until", documentData.dueDate || documentData.validUntil],
    ["Reference", documentData.reference || "N/A"]
  ];

  let y = 183;
  for (const [label, value] of metaRows) {
    doc
      .font("Helvetica-Bold")
      .fillColor("#17324a")
      .text(label, 360, y, { width: 90 })
      .font("Helvetica")
      .fillColor("#4f667d")
      .text(value, 450, y, { width: 90, align: "right" });
    y += 18;
  }
}

function drawLineItems(doc, settings, documentData) {
  const startY = 290;
  const columns = {
    description: 45,
    qty: 265,
    price: 320,
    tax: 395,
    amount: 470
  };

  doc.roundedRect(40, startY, 515, 28, 8).fill("#1f96f2");
  doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(10);
  doc.text("Description", columns.description, startY + 9);
  doc.text("Qty", columns.qty, startY + 9);
  doc.text("Price", columns.price, startY + 9);
  doc.text("Tax", columns.tax, startY + 9);
  doc.text("Amount", columns.amount, startY + 9);

  let y = startY + 42;

  for (const item of documentData.lineItems) {
    if (y > 650) {
      doc.addPage();
      y = 70;
    }

    doc
      .fillColor("#17324a")
      .font("Helvetica")
      .fontSize(10)
      .text(item.description, columns.description, y, { width: 200 })
      .text(String(item.quantity), columns.qty, y)
      .text(money(settings, item.unitPrice), columns.price, y)
      .text(`${item.taxRate}%`, columns.tax, y)
      .text(money(settings, item.total), columns.amount, y, { width: 70, align: "right" });

    doc.strokeColor("#d8e6f3").moveTo(40, y + 20).lineTo(555, y + 20).stroke();
    y += 28;
  }

  return y + 10;
}

function drawTotals(doc, settings, documentData, y) {
  doc.font("Helvetica-Bold").fillColor("#17324a").fontSize(11).text("Terms & Conditions", 40, y);
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#4f667d")
    .text(documentData.terms || "", 40, y + 18, { width: 240 })
    .text(documentData.notes || "", 40, y + 58, { width: 240 });

  const rows = [
    ["Sub-total", documentData.subtotal],
    ["Discount", documentData.discountTotal],
    [settings.taxLabel || "Tax", documentData.taxTotal],
    ["Total", documentData.total]
  ];

  let totalsY = y;
  for (const [label, value] of rows) {
    doc
      .font(label === "Total" ? "Helvetica-Bold" : "Helvetica")
      .fillColor("#17324a")
      .fontSize(11)
      .text(label, 360, totalsY, { width: 90 })
      .text(money(settings, value), 450, totalsY, { width: 90, align: "right" });
    totalsY += 20;
  }

  if (typeof documentData.paidAmount === "number") {
    doc
      .font("Helvetica")
      .fillColor("#4f667d")
      .text("Paid", 360, totalsY, { width: 90 })
      .text(money(settings, documentData.paidAmount), 450, totalsY, { width: 90, align: "right" });
    totalsY += 20;
    doc
      .font("Helvetica-Bold")
      .fillColor("#17324a")
      .text("Balance", 360, totalsY, { width: 90 })
      .text(money(settings, documentData.balance), 450, totalsY, { width: 90, align: "right" });
  }
}

function sendDocumentPdf(res, settings, title, documentData, fileName) {
  const doc = new PDFDocument({ margin: 40, size: "A4" });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
  doc.pipe(res);

  drawHeader(doc, settings, title, documentData.invoiceNumber || documentData.quoteNumber);
  drawMeta(doc, documentData, title);
  const bottomY = drawLineItems(doc, settings, documentData);
  drawTotals(doc, settings, documentData, bottomY);
  doc.end();
}

export function sendInvoicePdf(res, settings, invoice) {
  sendDocumentPdf(res, settings, "Invoice", invoice, `${invoice.invoiceNumber}.pdf`);
}

export function sendQuotePdf(res, settings, quote) {
  sendDocumentPdf(res, settings, "Estimate", quote, `${quote.quoteNumber}.pdf`);
}
