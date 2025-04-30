const pdfConfig = {
    page: {
    size: "A4", // Standard A4: 595.28 x 841.89 pt
    font: "Helvetica",
    width: 595.28,
    height: 841.89,
    margin: {
    top: 40, // ~0.55 inch
    bottom: 40,
    left: 50, // ~0.7 inch
    right: 50,
    },
    },
    performance: {
    enableCaching: true,
    compress: true,
    skipUnusedFonts: true,
    preloadFonts: ["Helvetica", "Helvetica-Bold"],
    imageCompression: "low", // if using logo or branding
    },
   };
   
   function loadFont(name, config) {
    // Reuse
    if (config.performance.enableCaching && fontCache[name]) {
    return fontCache[name];
    }
    const font = loadFontFromDiskOrMemory(name);
    fontCache[name] = font;
    return font;
   }
   
   // async function loadCompressedImage(pathToImage) {
   // const compressionLevel = pdfConfig.performance.imageCompression;
   
   // let quality = 80; // default
   // if (compressionLevel === "low") quality = 40;
   // else if (compressionLevel === "medium") quality = 60;
   
   // const imageBuffer = fs.readFileSync(pathToImage);
   // return await sharp(imageBuffer).jpeg({ quality }).toBuffer();
   // }
   
   function generateHeading(doc, { title, subtitle, investor, period }) {
    doc
    .fontSize(16)
    .font("Helvetica-Bold")
    .text(title, { align: "left" })
    .moveDown(0.3)
    .fontSize(12)
    .font("Helvetica")
    .text(subtitle)
    .moveDown(0.2)
    .text(`Investor: ${investor}`)
    .moveDown(0.5)
    .font("Helvetica-Bold")
    .text(period)
    .moveDown(1);
   }
   
   // 2. Render a subtitle for sections like "Commitment summary"
   function generateSubtitle(doc, text) {
    doc.fontSize(11).font("Helvetica-Bold").text(text).moveDown(0.3);
   }
   
   // 3. Generate a table with headers, rows, and border on last row
   function generateTable(doc, startY, headers, rows, columnWidths, options = {}) {
    const { lastRowDivider = true } = options;
    let y = startY;
   
    // Draw headers
    doc.font("Helvetica-Bold").fontSize(10);
    let x = doc.page.margins.left;
    headers.forEach((header, i) => {
    doc.text(header, x, y, { width: columnWidths[i], align: "left" });
    x += columnWidths[i];
    });
   
    y += 18;
    doc.moveTo(doc.page.margins.left, y).lineTo(550, y).stroke(); // header underline
    y += 8;
   
    // Draw rows
    doc.font("Helvetica").fontSize(10);
    rows.forEach((row, rowIndex) => {
    x = doc.page.margins.left;
    row.forEach((cell, i) => {
    doc.text(cell, x, y, {
    width: columnWidths[i],
    align: i === 0 ? "left" : "right",
    });
    x += columnWidths[i];
    });
   
    y += 20;
   
    // Add top and bottom line for last row
    if (lastRowDivider && rowIndex === rows.length - 1) {
    doc
    .moveTo(doc.page.margins.left, y - 20)
    .lineTo(550, y - 20)
    .stroke();
   
    doc.moveTo(doc.page.margins.left, y).lineTo(550, y).stroke();
    }
    });
   
    return y;
   }
   // 4. Page number at bottom-right
   function generatePageNumber(doc, pageNumber) {
    const bottom = doc.page.height - (doc.options.margin + 12);
   
    doc
    .fontSize(9)
    .font("Helvetica")
    .text(`Page ${pageNumber}`, 297.64, bottom, { align: "right" });
   }
   
   function createFooter(doc, includePageNumber = false) {
    const footerText = "Powered by Zive.AI";
    const footerY = doc.page.height - (doc.options.margin + 12);
    const textWidth = doc.widthOfString(footerText);
    const x = doc.page.width - textWidth - doc.options.margin - 420;
   
    doc.fontSize(10).fillColor("gray").text(footerText, x, footerY);
   
    if (includePageNumber) {
    generatePageNumber(doc, doc.page.pageNumber);
    }
   }
   
   /**
    * Creates a table with configurable options
    * @param {PDFDocument} doc - The PDF document
    * @param {Object} options - Table configuration options
    * @param {string} [options.title] - Optional title for the table
    * @param {Array} options.headers - Header row (use empty string for first column if needed)
    * @param {Array} options.rows - Array of row data arrays
    * @param {Array} options.colWidths - Array of column widths
    * @param {number} [options.rowHeight=20] - Height for each row
    * @param {Object} [options.styling] - Styling options
    * @param {Array} [options.styling.boldRows=[0]] - Indices of rows that should be bold (0-based)
    * @param {Object} [options.styling.currency] - Currency sign options
    * @param {Array} [options.styling.currency.columnIndices=[]] - Column indices that need currency signs
    * @param {Array} [options.styling.currency.rowIndices=[]] - Row indices that need currency signs
    * @param {Array} [options.styling.lineAfterRow=[]] - Add lines after these row indices
    */
   function createTable(doc, options) {
    const defaults = {
    title: null,
    headers: [],
    rows: [],
    colWidths: [200, 150, 150],
    rowHeight: 20,
    styling: {
    boldRows: [0],
    currency: {
    sign: "$",
    columnIndices: [],
    rowIndices: [],
    skipColumns: [],
    },
    lineAfterRow: [],
    },
    };
   
    const opts = { ...defaults, ...options };
    const { title, headers, rows, colWidths, rowHeight, styling } = opts;
   
    // Initial position
    const tableLeft = 50;
    let tableTop = doc.y;
   
    // Add title if provided
    if (title) {
    doc.font("Helvetica-Bold").fontSize(12).text(title, tableLeft, tableTop);
    tableTop += 25;
    }
   
    // Add headers if provided
    if (headers && headers.length > 0) {
    doc.font("Helvetica-Bold").fontSize(10);
   
    headers.forEach((header, index) => {
    let xPos = tableLeft;
    for (let i = 0; i < index; i++) {
    xPos += colWidths[i];
    }
   
    doc.text(header, xPos, tableTop, {
    width: colWidths[index],
    align: index === 0 ? "left" : "right",
    });
    });
   
    // Draw header line
    doc
    .moveTo(tableLeft, tableTop + 15)
    .lineTo(
    tableLeft + colWidths.reduce((acc, width) => acc + width, 0),
    tableTop + 15
    )
    .stroke();
   
    tableTop += 25;
    }
   
    // Start with rows
    let y = tableTop;
   
    // Process each row
    rows.forEach((row, rowIndex) => {
    // Set font based on whether this row should be bold
    if (styling.boldRows.includes(rowIndex)) {
    doc.font("Helvetica-Bold");
    } else {
    doc.font("Helvetica");
    }
   
    // Process each column in the row
    row.forEach((cellValue, colIndex) => {
    let xPos = tableLeft;
    for (let i = 0; i < colIndex; i++) {
    xPos += colWidths[i];
    }
   
    // Determine if this cell needs a currency sign
    const needsCurrencySign =
    styling.currency.columnIndices.includes(colIndex) &&cellValue !== "—";
   
    // Add currency sign if needed
    if (needsCurrencySign) {
    // Add currency sign
    doc.text(styling.currency.sign, xPos + 40, y, {
    width: 10,
    align: "right",
    });
   
    // // Adjust position for text after sign
    doc.text(cellValue, xPos+20, y, {
    width: colWidths[colIndex] - 20,
    align: colIndex === 0 ? "left" : "right",
    });
    } else {
    doc.text(cellValue, xPos, y, {
    width: colWidths[colIndex],
    align: colIndex === 0 ? "left" : "right",
    });
    }
    });
   
    // Add line after specific rows if configured
    if (styling.lineAfterRow?.includes(rowIndex)) {
    doc
    .moveTo(tableLeft, y + 10)
    .lineTo(
    tableLeft + colWidths.reduce((acc, width) => acc + width, 0),
    y + 10
    )
    .stroke();
    }
   
    y += rowHeight;
    });
   
    // Draw bottom line
    doc
    .moveTo(tableLeft, y)
    .lineTo(tableLeft + colWidths.reduce((acc, width) => acc + width, 0), y)
    .stroke();
   
    // Update doc.y to new position after table
    doc.y = y + 15;
   
    // Return the new y position
    return doc.y;
   }
   
   module.exports = {
    pdfConfig,
    generateHeading,
    generateSubtitle,
    generateTable,
    generatePageNumber,
    createFooter,
    createTable,
   };
   