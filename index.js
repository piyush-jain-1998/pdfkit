const express = require("express");
const PDFDocument = require("pdfkit");
const compression = require("compression");
const fs = require("fs");
const path = require("path");
const { pdfConfig, createFooter, createTable } = require("./pdfUtils");
const sharp = require("sharp");

const app = express();
app.use(compression());
const PORT = 3100;

app.get("/download", async (req, res) => {
  try {
  const doc = new PDFDocument({
  margin: 50,
  size: "A4",
  compress: pdfConfig.performance.compress,
  font: pdfConfig.page.font,
  });
  const filename = "financial-report.pdf";
 
  // Set headers
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
 
  // Pipe the PDF to the response
  doc.pipe(res);
 
  // === HEADER LOGO + TITLES ===
  const logoPath = path.join(__dirname, "zive.ai.png");
  if (fs.existsSync(logoPath)) {
  const compressedImage = await sharp(logoPath)
  .png({ quality: 80 })
  .toBuffer();
  doc.image(compressedImage, doc.page.width - 90, 40, { width: 40 });
  }
 
  doc.fontSize(18).font("Helvetica-Bold").text("Tribe-2", 50, 50);
  doc
  .moveDown(0.2)
  .fontSize(13)
  .font("Helvetica")
  .text("Statement of Changes in Investors' Capital");
  doc
  .moveDown(0.2)
  .fontSize(10)
  .text("Investor: Enterprise International, Inc.");
  doc
  .moveDown(0.5)
  .fontSize(12)
  .font("Helvetica-Bold")
  .text(`For the period from April 1, 2025 to June 30, 2025`);
 
  // Add spacing before first table
  doc.moveDown(1);
 
  // Statement of Changes table
  createTable(doc, {
  headers: ["", "Statement period", "Inception to date"],
  rows: [
  ["Beginning of period", "104,956.14", "—"],
  ["Capital contribution", "—", "250,000.00"],
  ["Distribution", "—", "(26,728.44)"],
  ["Formation Costs", "—", "—"],
  ["Unrealized gain (loss)", "—", "(114,896.7)"],
  ["Management fees", "—", "(2,859.21)"],
  ["Net operating income (loss)", "—", "(569.4)"],
  ["Net realized gain (loss)", "—", "9.89"],
  ["Realized gain in escrow", "—", "—"],
  ["Transfers", "—", "—"],
  ["Carried interest accrued", "—", "—"],
  ["Other", "—", "—"],
  ["Ending balance", "104,956.14", "104,956.14"],
  ],
  colWidths: [200, 150, 150],
  styling: {
  boldRows: [0, 12], // First and last rows should be bold
  currency: {
  sign: "$",
  columnIndices: [1], // All monetary columns
  skipColumns: [2,3,4,5,6,7,8,9,10,11], // Skip the first column
  },
  lineAfterRow: [11], // Add line after the row before the ending balance
  },
  });
 
  // Commitment summary table
  createTable(doc, {
  title: "Commitment summary",
  headers: ["", "Statement period", "Inception to date"],
  rows: [
  ["Initial commitment", "250,000.00", "250,000.00"],
  ["Contributions", "—", "250,000.00"],
  ["% Contributed", "—", "100%"],
  ],
  colWidths: [200, 150, 150],
  styling: {
  boldRows: [],
  currency: {
  sign: "$",
  rowIndices: [], // Not used anymore
  columnIndices: [1], // All monetary columns
  skipColumns: [],
  },
  lineAfterRow: [1], // Add line before % Contributed row
  },
  });
 
  // Contributions owed table
  createTable(doc, {
  title: "Contributions owed as of June 30, 2025",
  headers: ["", "Amount"],
  rows: [["Receivable", "—"]],
  colWidths: [400, 100],
  styling: {
  boldRows: [],
  currency: {
  sign: "$",
  rowIndices: [], // Not used anymore
  columnIndices: [1], // Amount column
  skipColumns: [],
  },
  },
  });
 
  // Deposit & Management Fees table
  createTable(doc, {
  title: "Deposit & Management Fees Prepaid as of June 30, 2025",
  headers: ["", "Amount"],
  rows: [
  ["Deposit", "$0.00"],
  ["Management Fees Prepaid", "$0"],
  ],
  colWidths: [400, 100],
  styling: {
  boldRows: [],
  currency: {
  sign: "$",
  rowIndices: [], // Not used anymore
  columnIndices: [1], // Amount column
  skipColumns: [],
  },
  },
  });
 
  createFooter(doc, true);
 
  // Finalize the PDF - this will end the response when the document is complete
  doc.end();
  } catch (error) {
  console.error("Error generating PDF:", error);
  res.status(500).send("Error generating PDF");
  }
 });
 


app.listen(PORT, () => {
 console.log(`✅ Server running at http://localhost:${PORT}/download`);
});
