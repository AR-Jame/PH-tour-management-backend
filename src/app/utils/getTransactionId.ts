import crypto from 'crypto';
export const generateTransactionId = () => {
    return `tran-${crypto.randomBytes(10).toString('hex')}`
}