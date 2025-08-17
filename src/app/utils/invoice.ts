/* eslint-disable @typescript-eslint/no-explicit-any */
import PDFDocument from 'pdfkit';
import AppError from '../errorHelper/AppError';

export interface IInvoiceData {
    transactionId: string;
    bookingDate: Date;
    customerName: string;
}

export const generatePdf = async (invoice: IInvoiceData): Promise<Buffer<ArrayBufferLike>> => {
    try {

        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ size: 'A4', margin: 50 });

            const buffer: Uint8Array[] = [];

            doc.on('data', (chunk) => { buffer.push(chunk) });
            doc.on('end', () => resolve(Buffer.concat(buffer)));
            doc.on("error", (err) => reject(err))

            doc.fontSize(20).text("Invoice", { align: "center" });
            doc.moveDown();
            doc.fontSize(14).text(`Transaction ID: ${invoice.transactionId}`)
            doc.text(`Booking Data: ${invoice.bookingDate}`)
            doc.text(`Customer Name: ${invoice.customerName}`)

            doc.moveDown();

            doc.text("Thank you to choose us for your traveling");
            doc.end();

        })


    } catch (error: any) {
        console.log(error);
        throw new AppError(401, `PDF create error. ${error.message}`)
    }
}