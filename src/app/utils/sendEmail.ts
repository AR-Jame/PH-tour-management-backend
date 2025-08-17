/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from 'nodemailer';
import { envVars } from '../config/env';
import path from 'path'
import ejs from 'ejs';
import AppError from '../errorHelper/AppError';


const transporter = nodemailer.createTransport({
    secure: true,
    auth: {
        user: envVars.SMTP.SMTP_USER,
        pass: envVars.SMTP.SMTP_PASS
    },
    port: Number(envVars.SMTP.SMTP_PORT),
    host: envVars.SMTP.SMTP_HOST
})

interface SendEmailOptions {
    to: string,
    subject: string;
    templateName: string;
    templateData?: Record<string, any>
    attachments?: {
        filename: string,
        content: Buffer | string,
        contentType: string
    }[]
}


export const sendEmail = async ({
    to,
    subject,
    templateName,
    templateData,
    attachments,
}: SendEmailOptions) => {

    try {
        const templatePath = path.join(__dirname, `templates/${templateName}.ejs`)

        const html = await ejs.renderFile(templatePath, templateData)

        const info = await transporter.sendMail({
            from: envVars.SMTP.SMTP_FROM,
            to: to,
            subject: subject,
            html: html,
            attachments: attachments?.map(attachment => ({
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType
            }))
        })

        console.log(info);

    } catch (error: any) {
        console.log(error.message);
        throw new AppError(500, "Error occurred during email sending")
    }
}