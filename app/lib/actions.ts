'use server' // Esto genera que todas las acciones de este archivo se generen en el servidor y nada se envia ni se ejecuta en el cliente

import { z } from 'zod'
import { Invoice } from './definitions'
import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const createInvoiceSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount : z.coerce.number(),
    status : z.enum(['pending' , 'paid']),
    date: z.string(),
})

const createInvoiceFormSchema = createInvoiceSchema.omit({
    id: true,
    date: true,
})

export async function createInvoice(formData : FormData){
    const {customerId, amount , status} = createInvoiceFormSchema.parse({
        customerId : formData.get('customerId'),
        amount : formData.get('amount'),
        status : formData.get('status')
    })

    //Se redondea para evitar errores de redondeo
    const amountInCents = amount * 100
    //Creamos la fecha de hoy en formato AAAA/MM/DD
    const [date] = new Date().toISOString().split('T')

    /* const rawFormData = Object.fromEntries(formData.entries()) ----> para hacer lo mismo que arriba pero de manera automatica */

    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices')
}