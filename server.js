const express = require('express');
const PDFDocument = require('pdfkit');
const moment = require('moment');
const config = require('./config');

const app = express();
const PORT = 5100;

// Sample meta data
const reportMeta = {
  startDate: '2023-01-01',
  endDate: '2023-12-31',
  title: 'Tribe-2',
  subTitle: 'Unaudited Financial Statements',
  type: 'date',
};

app.get('/download', (req, res) => {
  console.time("PDF Generation Time");

  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  res.setHeader('Content-Disposition', 'attachment; filename="manual-table.pdf"');
  res.setHeader('Content-Type', 'application/pdf');
  doc.pipe(res);

  // ======== 1. Introduction Page ========
  addCustomPage(doc, reportMeta);

  // ======== 2. Index / Table of Contents ========
  addNewPage(doc);
  addImage(doc);
  addTableOfContents(doc);

  // ======== 3. Financial Statements Section Header ========
  addNewPage(doc);
  addCustomPage(doc, {
    title: 'SECTION-I',
    subTitle: 'Financial Statements',
    section: '(unaudited)',
    type: 'subSection'
  });

  // ======== 4. Financial Statement - Assets ========
  addNewPage(doc);
  addImage(doc);
  doc.moveDown(1);
  doc.fontSize(12).font(config.font_bold).text("Assets", 50, 100);
  doc.fontSize(10).font(config.font_normal).text('June 30 2025', 50, 118);
  addStroke(doc);
  addAssetsTable(doc);
  generatePageNumber(doc, 1);
  addFooter(doc);


  // ======== 5. Liabilities and partners' capital ========
  addNewPage(doc);
  addImage(doc);
  doc.moveDown(1);
  doc.fontSize(12).font(config.font_bold).text("Liabilities and partners' capital", 50, 100);
  doc.moveDown(1);
  doc.fontSize(10).font(config.font_normal).text('June 30 2025', 50, 118);
  addStroke(doc);
  doc.moveDown(2);
  doc.fontSize(10).font(config.font_bold).text('Liabilities', 50, 160);
  const lineY = doc.y + 2;
  doc.moveTo(50, lineY).lineTo(550, lineY).stroke();
  doc.moveDown(2);
  doc.fontSize(10).font(config.font_normal).text('Distribution Payable', 50, undefined, { width: 300 });
  doc.fontSize(10).font(config.font_normal).text('$299,999.99', 490, doc.y - 15, { width: 100 });
  doc.moveTo(50, doc.y + 2).lineTo(550, doc.y + 2).stroke();

  doc.moveDown(2);
  doc.fontSize(10).font(config.font_bold).text('Total Liabilities', 50, undefined, { width: 300 });
  doc.fontSize(10).font(config.font_bold).text('$299,999.99', 490, doc.y - 15, { width: 100 });
  doc.moveTo(50, doc.y + 2).lineTo(550, doc.y + 2).stroke();

  doc.moveDown(6);
  doc.fontSize(12).font(config.font_bold).text("Partners' capital", 50, 370);
  doc.moveTo(50, doc.y + 2).lineTo(550, doc.y + 2).stroke();

  doc.moveDown(2);
  doc.fontSize(10).font(config.font_bold).text(`Total partners' Capital`, 50, undefined, { width: 300 });
  doc.fontSize(10).font(config.font_bold).text('$260,369.60', 490, doc.y - 15, { width: 100 });
  doc.moveTo(50, doc.y + 2).lineTo(550, doc.y + 2).stroke();

  doc.moveDown(2);
  doc.fontSize(10).font(config.font_bold).text(`Liabilities and partners' Capital`, 50, undefined, { width: 300 });
  doc.fontSize(10).font(config.font_bold).text('$560,369.59', 490, doc.y - 15, { width: 100 });
  doc.moveTo(50, doc.y + 2).lineTo(550, doc.y + 2).stroke();

  generatePageNumber(doc, 2);
  addFooter(doc);

  // ======== 5. statment of operations ========

  addNewPage(doc);
  addImage(doc);
  doc.moveDown(1);
  doc.fontSize(12).font(config.font_bold).text("Statement of Operations", 50, 100);
  doc.moveDown(1);
  doc.fontSize(10).font(config.font_normal).text('For the period from April 1, 2025 to June 30, 2025', 50, 118);
  doc.moveDown(3);
  doc.fontSize(10).font(config.font_bold).text('Income', 50, 160);
  doc.moveTo(50, doc.y + 2).lineTo(550, doc.y +2).stroke();
  doc.moveDown(3);
  doc.fontSize(10).font(config.font_bold).text('Expenses', 50, 200);
  doc.moveTo(50, doc.y + 2).lineTo(550, doc.y +2).stroke();
  doc.moveDown(3);
  doc.fontSize(10).font(config.font_bold).text('Realized and unrealized gain (loss) from investments', 50, 240);
  doc.moveTo(50, doc.y + 2).lineTo(550, doc.y +2).stroke();
  generatePageNumber(doc, 3);
  addFooter(doc);



    // ======== 5. Statement of changes in partners' capital ========

    addNewPage(doc);
    addImage(doc);
    doc.moveDown(1);
    doc.fontSize(12).font(config.font_bold).text("Statement of changes in partners' capital", 50, 100);
    doc.moveDown(1);
    doc.fontSize(10).font(config.font_normal).text('For the period from April 1, 2025 to June 30, 2025', 50, 118);
    doc.moveDown(3);
    doc.moveTo(50, doc.y + 2).lineTo(550, doc.y+2 ).stroke();
    doc.moveDown(3);
    doc.fontSize(10).font(config.font_bold).text('General Partner', 220, 200);
    doc.fontSize(10).font(config.font_bold).text('Limited Partners', 340, 200);
    doc.fontSize(10).font(config.font_bold).text('Total', 500, 200);
    doc.moveTo(50, doc.y + 2).lineTo(550, doc.y+2 ).stroke();

    doc.fontSize(10).font(config.font_bold).text(`Partners' capital, beginning `, 50, 230);
    doc.fontSize(10).font(config.font_bold).text('$1,186,307.99', 350, 230);
    doc.fontSize(10).font(config.font_bold).text('$1,186,307.99', 480, 230);
    

    doc.fontSize(10).font(config.font_normal).text(`Capital Contributions`, 50, 250);
    doc.fontSize(10).font(config.font_normal).text('$124.02', 350, 250);
    doc.fontSize(10).font(config.font_normal).text('$124.02', 480, 250);

    doc.fontSize(10).font(config.font_normal).text(`Contributions outside commitmment `, 50, 270);
    doc.fontSize(10).font(config.font_normal).text('$100,000.00', 350, 270);
    doc.fontSize(10).font(config.font_normal).text('$100,000.00', 480, 270);

    doc.moveTo(50, doc.y + 2).lineTo(550, doc.y+2 ).stroke();

    doc.fontSize(10).font(config.font_bold).text(`Partners' capital, ending `, 50, 300);
    doc.fontSize(10).font(config.font_bold).text('$1,186,432.01', 350, 300);
    doc.fontSize(10).font(config.font_bold).text('$1,186,432.01', 480, 300);

    doc.moveTo(50, doc.y + 2).lineTo(550, doc.y+2 ).stroke();

    generatePageNumber(doc, 4);
    addFooter(doc);

    // ======== 6. Statement of Cash Flows ========
    addNewPage(doc);
    addImage(doc);

    doc.moveDown(1);
    doc.fontSize(12).font(config.font_bold).text("Statement of Cash Flows", 50, 100);
    doc.moveDown(1);
    doc.fontSize(10).font(config.font_normal).text('For the period from April 1, 2025 to June 30, 2025', 50, 118);
    doc.moveDown(5);
    doc.fontSize(10).font(config.font_bold).text('Cash flows from operating activities', 50, 160);
    
    doc.moveTo(50, doc.y + 2).lineTo(550, doc.y+2 ).stroke()
    
    doc.fontSize(10).font(config.font_normal).text(`Net increase / (decrease) in partners' capital from operations`, 50, 180);
    doc.fontSize(10).font(config.font_normal).text(`$0.00`, 520, 180);

    doc.fontSize(10).font(config.font_normal).text(`Net realized (gain) / loss on investments`, 50, 200);
    doc.fontSize(10).font(config.font_normal).text(`$0.00`, 520, 200);


    doc.fontSize(10).font(config.font_normal).text(`Capitalized interest`, 50, 220);
    doc.fontSize(10).font(config.font_normal).text(`$0.00`, 520, 220);


    doc.fontSize(10).font(config.font_normal).text(`Capitalized interest`, 50, 240);
    doc.fontSize(10).font(config.font_normal).text(`$0.00`, 520, 240);


    doc.fontSize(10).font(config.font_normal).text(`Purchase of investments`, 50, 260);
    doc.fontSize(10).font(config.font_normal).text(`$0.00`, 520, 260);


    doc.fontSize(10).font(config.font_normal).text(`Proceeds from sale of investments`, 50, 280);
    doc.fontSize(10).font(config.font_normal).text(`$0.00`, 520, 280);

    doc.fontSize(10).font(config.font_bold).text(`Changes in operating assets and liabilities`, 50, 320);
    doc.moveTo(50, doc.y + 2).lineTo(550, doc.y+2 ).stroke()
    
    doc.fontSize(10).font(config.font_normal).text(`(Increase) / decrease in interest receivable`, 50, 340);
    doc.fontSize(10).font(config.font_normal).text(`$0.00`, 520, 340);

    doc.fontSize(10).font(config.font_normal).text(`(Increase) / decrease in escrow receivable`, 50, 360);
    doc.fontSize(10).font(config.font_normal).text(`$0.00`, 520, 360);


    doc.fontSize(10).font(config.font_normal).text(`(Increase) / decrease in accounts receivable`, 50, 380);
    doc.fontSize(10).font(config.font_normal).text(`$0.00`, 520, 380);

    doc.fontSize(10).font(config.font_normal).text(`(Increase) / decrease in due from related parties `, 50, 400);
    doc.fontSize(10).font(config.font_normal).text(`$0.00`, 520, 400);

    doc.fontSize(10).font(config.font_normal).text(`(Increase) / decrease in capitalized organization costs`, 50, 420);
    doc.fontSize(10).font(config.font_normal).text(`$0.00`, 520, 420);

    doc.fontSize(10).font(config.font_normal).text(`(Increase) / decrease in prepaid assets`, 50, 440);
    doc.fontSize(10).font(config.font_normal).text(`$0.00`, 520, 440);

    doc.fontSize(10).font(config.font_normal).text(`(Increase) / decrease in other assets`, 50, 460);
    doc.fontSize(10).font(config.font_normal).text(`$0.00`, 520, 460);

    doc.fontSize(10).font(config.font_normal).text(`Increase / (decrease) in accrued expenses`, 50, 480);
    doc.fontSize(10).font(config.font_normal).text(`$0.00`, 520, 480);

    doc.fontSize(10).font(config.font_normal).text(`Increase / (decrease) in performance fee payable`, 50, 500);
    doc.fontSize(10).font(config.font_normal).text(`$0.00`, 520, 500);

    doc.fontSize(10).font(config.font_normal).text(`Increase / (decrease) in management fee payable `, 50, 520);
    doc.fontSize(10).font(config.font_normal).text(`$0.00`, 520, 520);

    doc.fontSize(10).font(config.font_normal).text(`Increase / (decrease) in due to related parties`, 50, 540);
    doc.fontSize(10).font(config.font_normal).text(`$0.00`, 520, 540);

    doc.fontSize(10).font(config.font_normal).text(`Net cash provided by / (used in) operating activities`, 50, 560);
    doc.fontSize(10).font(config.font_normal).text(`$0.00`, 520, 560);
    

    
    generatePageNumber(doc, 4);
    addFooter(doc);


    // ======== 6. Schedule of Portfolio Investments ========
    addNewPage(doc);
    addImage(doc);
    

    doc.moveDown(1);
    doc.fontSize(12).font(config.font_bold).text("Schedule of Portfolio Investments", 50, 100);
    doc.moveDown(1);
    doc.fontSize(10).font(config.font_normal).text('June 30, 2025', 50, 118);
    doc.moveDown(1);
    doc.moveTo(50, doc.y + 2).lineTo(550, doc.y+2 ).stroke()
    doc.moveDown(1);


    doc.fontSize(9).font(config.font_normal).text('Investment', 50, 155);
    doc.fontSize(9).font(config.font_normal).text('Date', 130,155);
    doc.fontSize(9).font(config.font_normal).text('Qty', 190,155);
    doc.fontSize(9).font(config.font_normal).text('Cost', 220,155);
    doc.fontSize(9).font(config.font_normal).text('Value', 300,155);
    doc.fontSize(9).font(config.font_normal).text('Gain/Loss', 370,155);
    doc.fontSize(9).font(config.font_normal).text('Cost/Share', 440,155);
    doc.fontSize(9).font(config.font_normal).text('Value/Share', 500,155);
    doc.moveTo(50, doc.y + 2).lineTo(550, doc.y+2 ).stroke()

    doc.fontSize(9).font(config.font_bold).text('Censia Inc.', 50,185);
    doc.fontSize(9).font(config.font_bold).text('$1,222,056.00', 220,185);
    doc.fontSize(9).font(config.font_bold).text('$800,000.00', 300,185);
    doc.fontSize(9).font(config.font_bold).text('-$422,056.00', 370,185);

    doc.moveDown(2);
    
    doc.fontSize(9).font(config.font_normal).text('Series SeedPreferred', 50,210,{
      width:80
    });
    doc.fontSize(9).font(config.font_normal).text('12/31/2018', 130,210);
    doc.fontSize(9).font(config.font_normal).text('$512,056.00', 220,210);
    doc.fontSize(9).font(config.font_normal).text('$100,000.00', 300,210);
    doc.fontSize(9).font(config.font_normal).text('-$412,056.00', 370,210);
   
    doc.fontSize(9).font(config.font_normal).text('Common', 50,240,{
      width:80
    });
    doc.fontSize(9).font(config.font_normal).text('01/10/2025', 130,240);
    doc.fontSize(9).font(config.font_normal).text('1', 190,240);
    doc.fontSize(9).font(config.font_normal).text('$10,000.00', 220,240);
    doc.fontSize(9).font(config.font_normal).text('-$10,000.00', 370,240);
    doc.fontSize(9).font(config.font_normal).text('$10,000.00', 440,240);

    doc.fontSize(9).font(config.font_normal).text('Class', 50,270,{
      width:80
    });
    doc.fontSize(9).font(config.font_normal).text('01/28/2025', 130,270);
    doc.fontSize(9).font(config.font_normal).text('10', 190,270);
    doc.fontSize(9).font(config.font_normal).text('$200,000.00', 220,270);
    doc.fontSize(9).font(config.font_normal).text('$200,000.00', 300,270);
    doc.fontSize(9).font(config.font_normal).text('$20,000.00', 440,270);
    doc.fontSize(9).font(config.font_normal).text('$20,000.00', 500,270);


    doc.fontSize(9).font(config.font_normal).text('New', 50,300,{
      width:80
    });
    doc.fontSize(9).font(config.font_normal).text('01/28/2025', 130,300);
    doc.fontSize(9).font(config.font_normal).text('$500,000.00', 220,300);
    doc.fontSize(9).font(config.font_normal).text('$500,000.00', 300,300);

    doc.moveTo(50, doc.y + 2).lineTo(550, doc.y+2 ).stroke()
    doc.fontSize(9).font(config.font_bold).text('AbSci Corporation', 50,340,{
      width:60
    });
    doc.fontSize(9).font(config.font_bold).text('$1,700,000.00', 220,340);
    doc.fontSize(9).font(config.font_bold).text('$1,400,000.00', 300,340);
    doc.fontSize(9).font(config.font_bold).text('-$300,000.00', 370,340);


    doc.fontSize(9).font(config.font_normal).text('Test', 50,370);
    doc.fontSize(9).font(config.font_normal).text('12/12/2024', 130,370);
    doc.fontSize(9).font(config.font_normal).text('$300,000.00', 300,370);
    doc.fontSize(9).font(config.font_normal).text('-$300,000.00', 370,370);



    doc.fontSize(9).font(config.font_normal).text('Test', 50,400);
    doc.fontSize(9).font(config.font_normal).text('12/12/2024', 130,400);
    doc.fontSize(9).font(config.font_normal).text('$300,000.00', 220,400);
    doc.fontSize(9).font(config.font_normal).text('-$300,000.00', 300,400);

    doc.fontSize(9).font(config.font_normal).text('Test', 50,430);
    doc.fontSize(9).font(config.font_normal).text('12/12/2024', 130,430);
    doc.fontSize(9).font(config.font_normal).text('$300,000.00', 220,430);
    doc.fontSize(9).font(config.font_normal).text('-$300,000.00', 300,430);

    doc.fontSize(9).font(config.font_normal).text('Test', 50,470);
    doc.fontSize(9).font(config.font_normal).text('12/12/2024', 130,470);
    doc.fontSize(9).font(config.font_normal).text('$300,000.00', 220,470);
    doc.fontSize(9).font(config.font_normal).text('-$300,000.00', 300,470);

    doc.fontSize(9).font(config.font_normal).text('Test', 50,500);
    doc.fontSize(9).font(config.font_normal).text('12/12/2024', 130,500);
    doc.fontSize(9).font(config.font_normal).text('$300,000.00', 220,500);
    doc.fontSize(9).font(config.font_normal).text('-$300,000.00', 300,500);

    doc.fontSize(9).font(config.font_normal).text('Test', 50,530);
    doc.fontSize(9).font(config.font_normal).text('12/12/2024', 130,530);
    doc.fontSize(9).font(config.font_normal).text('$300,000.00', 220,530);
    doc.fontSize(9).font(config.font_normal).text('-$300,000.00', 300,530);

    doc.moveTo(50, doc.y + 2).lineTo(550, doc.y+2 ).stroke()

    doc.fontSize(9).font(config.font_bold).text('Total', 50,560);
    doc.fontSize(9).font(config.font_bold).text('$2,922,056.00', 220,560);
    doc.fontSize(9).font(config.font_bold).text('$2,200,000.00', 300,560);
    doc.fontSize(9).font(config.font_bold).text('-$722,056.00', 370,560);

    generatePageNumber(doc, 5);
    addFooter(doc);



    // ======== Finalize PDF ========
  doc.end();
  console.timeEnd("PDF Generation Time");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

/**
 * ========== Utility Functions ==========
 */

// Draw horizontal line
function addStroke(doc) {
  const lineY = doc.y + 10;
  doc.moveTo(50, lineY).lineTo(550, lineY).stroke();
}

// Add footer with branding
function addFooter(doc) {
  const footerY = doc.page.height - doc.options.margin - 20;
  doc
    .font(config.font_normal)
    .fontSize(8)
    .fillColor('gray')
    .text('Powered by ', 50, footerY, { continued: true });

  doc
    .font(config.font_bold)
    .fontSize(12)
    .fillColor('black')
    .text('Zive.AI', doc.x, footerY - 2);
}

// Add branding image
function addImage(doc) {
  const imagePath = './zive.ai.png';
  const imageWidth = 100;
  const imageHeight = 25;
  const imageX = doc.page.width - imageWidth - 40;
  const imageY = 50;
  doc.image(imagePath, imageX, imageY, { width: imageWidth, height: imageHeight });
}

// Add a new page
function addNewPage(doc) {
  doc.addPage();
}

// Add title pages (Intro/Section Headers)
function addCustomPage(doc, obj) {
  addImage(doc);
  doc.moveDown(2);
  const centerY = (doc.page.height - doc.currentLineHeight()) / 2;

  doc.fontSize(25).font(config.font_bold).text(obj.title, 0, centerY - 80, { align: 'center' });
  doc.fontSize(24).font(config.font_bold).text(obj.subTitle, 0, centerY - 40, { align: 'center' });

  if (obj.type === "date") {
    const dateText = `For the period from ${moment(obj.startDate).format('MMMM D, YYYY')} to ${moment(obj.endDate).format('MMMM D, YYYY')}`;
    doc.fontSize(10).font(config.font_normal).text(dateText, { align: 'center' });
  }

  if (obj.type === "subSection") {
    doc.fontSize(24).font(config.font_bold).text(obj.section, 0, centerY - 10, { align: 'center' });
  }

  addFooter(doc);
}

// Add Table of Contents
function addTableOfContents(doc) {
  const tocItems = [
    { text: 'Assets', page: 1 },
    { text: `Liabilities and partners' capital`, page: 2 },
    { text: 'Statement of Operations', page: 3 },
    { text: `Statement of changes in partners' capital`, page: 4 },
    { text: `Statement of Cash Flows`, page: 5 },
    { text: `Statement of Cash Flows (continued)`, page: 6 },
    { text: `Schedule of Portfolio Investments`, page: 7 },
  ];

  doc.fontSize(12).font(config.font_bold).text("Table of contents", 100, 150, { underline: true });
  doc.text("Page", 450, 150, { underline: true });
  doc.text("SECTION I: Financial Statements", 100, 200);

  tocItems.forEach(item => {
    doc.moveDown(0.5);
    doc.fontSize(12).font(config.font_normal).text(item.text, 100, undefined, { width: 300 });
    doc.fontSize(12).font(config.font_normal).text(item.page.toString(), 460, doc.y - 15);
  });

  addFooter(doc);
}

// Render assets table
function addAssetsTable(doc) {
  const assets = [
    { text: "Investment", amount: "$ 4,624,583.41", bold: false },
    { text: "Investment - Unrealized Gain/Loss", amount: "$ 2,278,113.66", bold: false },
    { text: "Portfolio Investments, at Fair Market Value", amount: "$ 2,346,469.75", bold: true },
    { text: "Capital Call Receivable", amount: "$ 60,023.75", bold: false },
    { text: "Cash and Cash Equivalents", amount: "$ 1,724,965.41", bold: false },
    { text: "Total Assets", amount: "$ 561,480.59", bold: true },
  ];


  doc.moveDown(1.5);
  assets.forEach(({ text, amount, bold }) => {
    doc.moveDown(0.5);
    let fontFamily  = bold ? config.font_bold : config.font_normal
    doc.fontSize(12).font(fontFamily).text(text, 50, undefined, { width: 300 });
    doc.fontSize(12).font(fontFamily).text(amount, 460, doc.y - 15, { width: 100 });
    if(text === "Cash and Cash Equivalents"|| text === "Total Assets") {
      addStroke(doc);
      doc.moveDown(0.5);
    }

  });
}


// Add page number
function generatePageNumber(doc, pageNumber) {
  const yPos = doc.page.height - doc.options.margin - 23;
  doc.fontSize(9).font("Helvetica").text(`Page ${pageNumber}`, 297.64, yPos, { align: "right" });
}
