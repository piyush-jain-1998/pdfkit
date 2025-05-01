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


  generateLiabilitiesAndCapital(doc, config);
  generateStatementOfOperations(doc, config);
  generateStatementOfChanges(doc, config);
  generateStatementOfCashFlows(doc, config);
  


  generatePortfolioSchedule(doc, config, {
    date: 'June 30, 2025',
    investments: [
      {
        name: 'Censia Inc.',
        cost: '$1,222,056.00',
        value: '$800,000.00',
        gainLoss: '-$422,056.00',
        subInvestments: [
          {
            type: 'Series SeedPreferred',
            date: '12/31/2018',
            cost: '$512,056.00',
            value: '$100,000.00',
            gainLoss: '-$412,056.00',
          },
          {
            type: 'Common',
            date: '01/10/2025',
            qty: '1',
            cost: '$10,000.00',
            gainLoss: '-$10,000.00',
            costShare: '$10,000.00',
          },
          {
            type: 'Class',
            date: '01/28/2025',
            qty: '10',
            cost: '$200,000.00',
            value: '$200,000.00',
            costShare: '$20,000.00',
            valueShare: '$20,000.00',
          },
          {
            type: 'New',
            date: '01/28/2025',
            cost: '$500,000.00',
            value: '$500,000.00',
          },
        ],
      },
      {
        name: 'AbSci Corporation',
        cost: '$1,700,000.00',
        value: '$1,400,000.00',
        gainLoss: '-$300,000.00',
        subInvestments: [
          {
            type: 'Test',
            date: '12/12/2024',
            value: '$300,000.00',
            gainLoss: '-$300,000.00',
          },
          {
            type: 'Test',
            date: '12/12/2024',
            cost: '$300,000.00',
            gainLoss: '-$300,000.00',
          },
          {
            type: 'Test',
            date: '12/12/2024',
            cost: '$300,000.00',
            gainLoss: '-$300,000.00',
          },
          {
            type: 'Test',
            date: '12/12/2024',
            cost: '$300,000.00',
            gainLoss: '-$300,000.00',
          },
          {
            type: 'Test',
            date: '12/12/2024',
            cost: '$300,000.00',
            gainLoss: '-$300,000.00',
          },
        ],
      },
    ],
    totalCost: '$2,922,056.00',
    totalValue: '$2,200,000.00',
    totalGainLoss: '-$722,056.00',
  }, 5);
  

  
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



const generateLiabilitiesAndCapital = (doc, config) => {
  addNewPage(doc);
  addImage(doc);
  doc.moveDown(1);

  doc.fontSize(12).font(config.font_bold).text("Liabilities and partners' capital", 50, 100);
  doc.moveDown(1);
  doc.fontSize(10).font(config.font_normal).text('June 30 2025', 50, 118);

  addStroke(doc);
  doc.moveDown(2);

  doc.fontSize(10).font(config.font_bold).text('Liabilities', 50);
  doc.moveTo(50, doc.y + 2).lineTo(550, doc.y + 2).stroke();

  doc.moveDown(2);
  doc.font(config.font_normal).text('Distribution Payable', 50, undefined, { width: 300 });
  doc.font(config.font_normal).text('$299,999.99', 490, doc.y - 15, { width: 100 });
  doc.moveTo(50, doc.y + 2).lineTo(550, doc.y + 2).stroke();

  doc.moveDown(2);
  doc.font(config.font_bold).text('Total Liabilities', 50, undefined, { width: 300 });
  doc.font(config.font_bold).text('$299,999.99', 490, doc.y - 15, { width: 100 });
  doc.moveTo(50, doc.y + 2).lineTo(550, doc.y + 2).stroke();

  doc.moveDown(6);
  doc.fontSize(12).font(config.font_bold).text("Partners' capital", 50);
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
};

const generateStatementOfOperations = (doc, config) => {
  addNewPage(doc);
  addImage(doc);
  doc.moveDown(1);

  doc.fontSize(12).font(config.font_bold).text("Statement of Operations", 50, 100);
  doc.moveDown(1);
  doc.fontSize(10).font(config.font_normal).text('For the period from April 1, 2025 to June 30, 2025', 50, 118);

  doc.moveDown(3);
  doc.fontSize(10).font(config.font_bold).text('Income', 50);
  doc.moveTo(50, doc.y + 2).lineTo(550, doc.y + 2).stroke();

  doc.moveDown(3);
  doc.fontSize(10).font(config.font_bold).text('Expenses', 50);
  doc.moveTo(50, doc.y + 2).lineTo(550, doc.y + 2).stroke();

  doc.moveDown(3);
  doc.fontSize(10).font(config.font_bold).text('Realized and unrealized gain (loss) from investments', 50);
  doc.moveTo(50, doc.y + 2).lineTo(550, doc.y + 2).stroke();

  generatePageNumber(doc, 3);
  addFooter(doc);
};

const generateStatementOfChanges = (doc, config) => {
  addNewPage(doc);
  addImage(doc);
  doc.moveDown(1);

  doc.fontSize(12).font(config.font_bold).text("Statement of changes in partners' capital", 50, 100);
  doc.moveDown(1);
  doc.fontSize(10).font(config.font_normal).text('For the period from April 1, 2025 to June 30, 2025', 50, 118);

  doc.moveDown(3);
  doc.moveTo(50, doc.y + 2).lineTo(550, doc.y + 2).stroke();

  doc.moveDown(3);
  doc.fontSize(10).font(config.font_bold).text('General Partner', 220);
  doc.fontSize(10).font(config.font_bold).text('Limited Partners', 340);
  doc.fontSize(10).font(config.font_bold).text('Total', 500);
  doc.moveTo(50, doc.y + 2).lineTo(550, doc.y + 2).stroke();

  doc.moveDown(1);
  doc.fontSize(10).font(config.font_bold).text(`Partners' capital, beginning `, 50);
  doc.fontSize(10).font(config.font_bold).text('$1,186,307.99', 350);
  doc.fontSize(10).font(config.font_bold).text('$1,186,307.99', 480);

  doc.moveDown(1);
  doc.fontSize(10).font(config.font_normal).text(`Capital Contributions`, 50);
  doc.fontSize(10).font(config.font_normal).text('$124.02', 350);
  doc.fontSize(10).font(config.font_normal).text('$124.02', 480);

  doc.moveDown(1);
  doc.fontSize(10).font(config.font_normal).text(`Contributions outside commitment`, 50);
  doc.fontSize(10).font(config.font_normal).text('$100,000.00', 350);
  doc.fontSize(10).font(config.font_normal).text('$100,000.00', 480);

  doc.moveTo(50, doc.y + 2).lineTo(550, doc.y + 2).stroke();

  doc.moveDown(1);
  doc.fontSize(10).font(config.font_bold).text(`Partners' capital, ending `, 50);
  doc.fontSize(10).font(config.font_bold).text('$1,186,432.01', 350);
  doc.fontSize(10).font(config.font_bold).text('$1,186,432.01', 480);

  doc.moveTo(50, doc.y + 2).lineTo(550, doc.y + 2).stroke();

  generatePageNumber(doc, 4);
  addFooter(doc);
};

const generateStatementOfCashFlows = (doc, config) => {
  addNewPage(doc);
  addImage(doc);
  doc.moveDown(1);

  doc.fontSize(12).font(config.font_bold).text("Statement of Cash Flows", 50, 100);
  doc.moveDown(1);
  doc.fontSize(10).font(config.font_normal).text('For the period from April 1, 2025 to June 30, 2025', 50, 118);

  doc.moveDown(5);
  doc.fontSize(10).font(config.font_bold).text('Cash flows from operating activities', 50);
  doc.moveTo(50, doc.y + 2).lineTo(550, doc.y + 2).stroke();

  doc.moveDown(2);
  const cashFlows = [
    `Net increase / (decrease) in partners' capital from operations`,
    `Net realized (gain) / loss on investments`,
    `Capitalized interest`,
    `Capitalized interest`,
    `Purchase of investments`,
    `Proceeds from sale of investments`
  ];

  cashFlows.forEach(text => {
    doc.font(config.font_normal).text(text, 50);
    doc.font(config.font_normal).text(`$0.00`, 520, doc.y - 15);
    doc.moveDown(1);
  });

  doc.moveDown(2);
  doc.font(config.font_bold).text(`Changes in operating assets and liabilities`, 50);
  doc.moveTo(50, doc.y + 2).lineTo(550, doc.y + 2).stroke();

  doc.moveDown(2);
  const changes = [
    `(Increase) / decrease in interest receivable`,
    `(Increase) / decrease in escrow receivable`,
    `(Increase) / decrease in accounts receivable`,
    `(Increase) / decrease in due from related parties`,
    `(Increase) / decrease in capitalized organization costs`,
    `(Increase) / decrease in prepaid assets`
  ];

  changes.forEach(text => {
    doc.font(config.font_normal).text(text, 50);
    doc.font(config.font_normal).text(`$0.00`, 520, doc.y - 15);
    doc.moveDown(1);
  });

  generatePageNumber(doc, 5);
  addFooter(doc);
};

function generatePortfolioSchedule(doc, config, data, pageNumber = 1) {
  // Start new page
  addNewPage(doc);
  addImage(doc);

  // Heading
  doc.moveDown(1);
  doc.fontSize(12).font(config.font_bold).text("Schedule of Portfolio Investments", 50, 100);
  doc.moveDown(1);
  doc.fontSize(10).font(config.font_normal).text(data.date || 'June 30, 2025', 50, 118);
  doc.moveDown(1);
  doc.moveTo(50, doc.y + 2).lineTo(550, doc.y + 2).stroke();
  doc.moveDown(1);

  // Table Headers
  const headers = [
    { text: 'Investment', x: 50 },
    { text: 'Date', x: 130 },
    { text: 'Qty', x: 190 },
    { text: 'Cost', x: 220 },
    { text: 'Value', x: 300 },
    { text: 'Gain/Loss', x: 370 },
    { text: 'Cost/Share', x: 440 },
    { text: 'Value/Share', x: 500 },
  ];
  headers.forEach(header => {
    doc.fontSize(9).font(config.font_normal).text(header.text, header.x, 155);
  });
  doc.moveTo(50, doc.y + 2).lineTo(550, doc.y + 2).stroke();

  let y = 185;

  data.investments.forEach((investment, i) => {
    // Main Investment Title Row (Bold)
    doc.fontSize(9).font(config.font_bold).text(investment.name, 50, y);
    doc.fontSize(9).font(config.font_bold).text(investment.cost, 220, y);
    doc.fontSize(9).font(config.font_bold).text(investment.value, 300, y);
    doc.fontSize(9).font(config.font_bold).text(investment.gainLoss, 370, y);

    y += 25;

    // Sub Investments (Normal)
    investment.subInvestments.forEach(sub => {
      doc.fontSize(9).font(config.font_normal).text(sub.type, 50, y, { width: 80 });
      doc.fontSize(9).font(config.font_normal).text(sub.date, 130, y);
      if (sub.qty) doc.fontSize(9).font(config.font_normal).text(sub.qty, 190, y);
      if (sub.cost) doc.fontSize(9).font(config.font_normal).text(sub.cost, 220, y);
      if (sub.value) doc.fontSize(9).font(config.font_normal).text(sub.value, 300, y);
      if (sub.gainLoss) doc.fontSize(9).font(config.font_normal).text(sub.gainLoss, 370, y);
      if (sub.costShare) doc.fontSize(9).font(config.font_normal).text(sub.costShare, 440, y);
      if (sub.valueShare) doc.fontSize(9).font(config.font_normal).text(sub.valueShare, 500, y);

      y += 30;
    });

    // Draw line after each main investment block
    doc.moveTo(50, y - 10).lineTo(550, y - 10).stroke();
  });

  // Total Row
  doc.fontSize(9).font(config.font_bold).text('Total', 50, y + 10);
  doc.fontSize(9).font(config.font_bold).text(data.totalCost, 220, y + 10);
  doc.fontSize(9).font(config.font_bold).text(data.totalValue, 300, y + 10);
  doc.fontSize(9).font(config.font_bold).text(data.totalGainLoss, 370, y + 10);

  generatePageNumber(doc, pageNumber);
  addFooter(doc);
}


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
