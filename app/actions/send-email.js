import { Resend } from "resend";

export async function sendEmail({to,subject,react}){

    const resend= new Resend(process.env.RESEND_API_KEY);

    try {
        const {data}=await resend.emails.send({
           
            from: 'Acme <onboarding@resend.dev>',
            to,
            subject,
            react,
            
        });

         

        return {success:true, data};


    } catch (error) {
        console.log("Error in the send email action",error.message);
         return {success:false,error};
    }

}