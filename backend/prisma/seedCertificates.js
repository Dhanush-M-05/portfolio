const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const certsDir = path.resolve(__dirname, '../uploads/certifications');

if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir, { recursive: true });
}

function createDummyPdf(title, recipient, issuer) {
  return Buffer.from(`%PDF-1.4
%âãÏÓ
1 0 obj
<<
  /Type /Catalog
  /Pages 2 0 R
>>
endobj
2 0 obj
<<
  /Type /Pages
  /Kids [3 0 R]
  /Count 1
>>
endobj
3 0 obj
<<
  /Type /Page
  /Parent 2 0 R
  /MediaBox [0 0 612 792]
  /Resources <<
    /Font <<
      /F1 <<
        /Type /Font
        /Subtype /Type1
        /BaseFont /Helvetica-Bold
      >>
    >>
  >>
  /Contents 4 0 R
>>
endobj
4 0 obj
<<
  /Length 280
>>
stream
BT
/F1 22 Tf
50 720 Td
(CERTIFICATE OF COMPLETION) Tj
/F1 14 Tf
0 -40 Td
(This certifies that ${recipient}) Tj
0 -25 Td
(has successfully completed the credential:) Tj
/F1 16 Tf
0 -30 Td
(${title}) Tj
/F1 12 Tf
0 -35 Td
(Issued by: ${issuer}) Tj
0 -20 Td
(Verified by Dhanush M Portfolio Credentials) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000015 00000 n 
0000000068 00000 n 
0000000125 00000 n 
0000000305 00000 n 
trailer
<<
  /Size 5
  /Root 1 0 R
>>
startxref
640
%%EOF`);
}

async function seedCertFiles() {
  const existingCerts = await prisma.certification.findMany();

  for (const cert of existingCerts) {
    const sanitized = cert.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
    const filename = `${sanitized}_Certificate.pdf`;
    const fullPath = path.join(certsDir, filename);

    const pdfContent = createDummyPdf(cert.title, 'Dhanush M', cert.issuer);
    fs.writeFileSync(fullPath, pdfContent);

    const stats = fs.statSync(fullPath);
    const fileUrl = `http://localhost:5000/uploads/certifications/${filename}`;

    await prisma.certification.update({
      where: { id: cert.id },
      data: {
        fileName: filename,
        fileUrl,
        fileType: 'application/pdf',
        fileSize: stats.size,
      },
    });

    console.log(`Updated cert ${cert.id}: ${cert.title} -> ${fileUrl}`);
  }
}

seedCertFiles()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
