import PDFDocument from 'pdfkit';

export const buildSalarySlipBuffer = async (salaryData) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50, size: 'A4' });
            const chunks = [];
            
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));

            // Extract data safely
            const empName = salaryData.employeeId?.userId?.name || 'Employee';
            const empId = salaryData.employeeId?.employeeId || 'N/A';
            const designation = salaryData.employeeId?.designation || 'N/A';
            const department = salaryData.employeeId?.department?.dep_name || 'N/A';
            const payDate = new Date(salaryData.payDate);
            const monthYear = payDate.toLocaleString('default', { month: 'long', year: 'numeric' });
            
            // Layout Variables
            const topMargin = 50;
            
            // Header: Company Details
            doc.fontSize(24).font('Helvetica-Bold').fillColor('#4F46E5')
               .text('AdminPro Organization', 50, topMargin, { align: 'center' });
            
            doc.fontSize(10).font('Helvetica').fillColor('#64748B')
               .text('123 Corporate Blvd, Business District, NY 10001', { align: 'center' })
               .moveDown(0.2)
               .text('Email: hr@adminpro.com | Phone: +1 800-555-0199', { align: 'center' })
               .moveDown(1);
               
            // HR Line
            doc.moveTo(50, doc.y).lineTo(545, doc.y).lineWidth(1).strokeColor('#E2E8F0').stroke();
            doc.moveDown(1.5);

            // Title
            doc.fontSize(16).font('Helvetica-Bold').fillColor('#1F2937')
               .text(`SALARY SLIP FOR ${monthYear.toUpperCase()}`, { align: 'center', underline: true });
            doc.moveDown(2);

            // Employee Information Block
            doc.rect(50, doc.y, 495, 80).fillColor('#F8FAFC').fill();
            doc.fillColor('#1F2937').fontSize(11).font('Helvetica');

            let yPosBeforeBox = doc.y - 80;
            const startY = yPosBeforeBox + 15;
            
            // Col 1
            doc.font('Helvetica-Bold').text('Employee Name:', 65, startY);
            doc.font('Helvetica').text(empName, 170, startY);
            
            doc.font('Helvetica-Bold').text('Employee ID:', 65, startY + 20);
            doc.font('Helvetica').text(empId, 170, startY + 20);

            doc.font('Helvetica-Bold').text('Designation:', 65, startY + 40);
            doc.font('Helvetica').text(designation, 170, startY + 40);

            // Col 2
            doc.font('Helvetica-Bold').text('Department:', 320, startY);
            doc.font('Helvetica').text(department, 410, startY);
            
            doc.font('Helvetica-Bold').text('Pay Date:', 320, startY + 20);
            doc.font('Helvetica').text(payDate.toLocaleDateString(), 410, startY + 20);

            doc.y = startY + 80;
            doc.moveDown(2);

            // SALARY BREAKDOWN TABLE
            const tableTop = doc.y;

            // Table Header
            doc.rect(50, tableTop, 495, 30).fillColor('#4F46E5').fill();
            doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(11);
            doc.text('Earnings', 65, tableTop + 10);
            doc.text('Amount (INR)', 200, tableTop + 10, { width: 90, align: 'right' });
            doc.text('Deductions', 330, tableTop + 10);
            doc.text('Amount (INR)', 430, tableTop + 10, { width: 100, align: 'right' });

            // Table Rows
            const rowSpacing = 25;
            doc.font('Helvetica').fontSize(11).fillColor('#1F2937');
            
            // Row 1: Basic
            doc.rect(50, tableTop + 30, 495, rowSpacing).strokeColor('#E2E8F0').stroke();
            doc.text('Basic Salary', 65, tableTop + 38);
            doc.text(salaryData.basicSalary.toLocaleString('en-IN'), 200, tableTop + 38, { width: 90, align: 'right' });
            
            doc.text('Standard Deductions', 330, tableTop + 38);
            doc.text(salaryData.deductions.toLocaleString('en-IN'), 430, tableTop + 38, { width: 100, align: 'right' });

            // Row 2: Allowances
            doc.rect(50, tableTop + 30 + rowSpacing, 495, rowSpacing).strokeColor('#E2E8F0').stroke();
            doc.text('Allowances', 65, tableTop + 38 + rowSpacing);
            doc.text(salaryData.allowances.toLocaleString('en-IN'), 200, tableTop + 38 + rowSpacing, { width: 90, align: 'right' });
            
            // Empty deduction row match
            doc.text('-', 430, tableTop + 38 + rowSpacing, { width: 100, align: 'right' });

            // Table Footer / Total
            const tableBottom = tableTop + 30 + (rowSpacing * 2);
            doc.rect(50, tableBottom, 495, 30).fillColor('#F1F5F9').fill();
            doc.fillColor('#1F2937').font('Helvetica-Bold');
            
            const totalEarnings = salaryData.basicSalary + salaryData.allowances;
            const totalDeductions = salaryData.deductions;

            doc.text('Gross Earnings', 65, tableBottom + 10);
            doc.text(totalEarnings.toLocaleString('en-IN'), 200, tableBottom + 10, { width: 90, align: 'right' });
            
            doc.text('Total Deductions', 330, tableBottom + 10);
            doc.text(totalDeductions.toLocaleString('en-IN'), 430, tableBottom + 10, { width: 100, align: 'right' });

            doc.moveDown(3);

            // NET PAY
            doc.rect(320, doc.y, 225, 40).fillColor('#E0E7FF').fill();
            const netPayY = doc.y - 40;
            doc.fillColor('#3730A3').font('Helvetica-Bold').fontSize(14);
            doc.text('NET PAY:', 340, netPayY + 13);
            doc.text(`INR ${salaryData.netSalary.toLocaleString('en-IN')}`, 400, netPayY + 13, { width: 130, align: 'right' });

            doc.moveDown(4);

            // Footer Note
            const amountInWords = `This is a system generated salary slip and does not require a physical signature.`;
            doc.fontSize(9).font('Helvetica-Oblique').fillColor('#94A3B8')
               .text(amountInWords, 50, doc.y, { align: 'center' });

            doc.end();
            
        } catch (error) {
            reject(error);
        }
    });
};
