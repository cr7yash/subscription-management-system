import Subscription from "../models/subscription.model.js";
import dayjs from "dayjs"
import { triggerReminderEmail } from "../utils/send-email.js";

const REMINDERS = [7,5,2,1]

// Upstash workflow function
const reminderWorkflow = async(context)=>{
    const {subscriptionId} = context.requestPayload
    const subscription = await fetchSubscription(context,subscriptionId)
    if(!subscription || subscription.status !== 'active'){
        throw new Error('Subscription not found')
    }

    const renewalDate = dayjs(subscription.renewalDate)
    if(renewalDate.isBefore(dayjs())){
        throw new Error('Subscription is not due for renewal')
    }

    for( const daysBefore of REMINDERS){
        const reminderDate = renewalDate.subtract(daysBefore,'day')

        if(reminderDate.isAfter(dayjs())){
            await sleepUntilReminder(context,`reminder-${daysBefore} days before`,reminderDate)
            await sendReminderEmail(context,subscription,reminderDate,`reminder-${daysBefore} days before`)
        }
    }
}

// Express handler for the workflow
export const sendReminders = async (req, res) => {
    try {
        // Create a mock context for the workflow
        const context = {
            requestPayload: req.body,
            run: async (label, fn) => await fn(),
            sleepUntil: async (date, label) => {
                // For development, we'll just log and continue
                console.log(`Would sleep until ${label} at ${date}`)
            }
        }
        
        await reminderWorkflow(context)
        res.json({ success: true, message: "Workflow completed" })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


const fetchSubscription = async(context,subscriptionId) =>{
    return await context.run('get subscription',()=>{
        return Subscription.findById(subscriptionId).populate('user','name email')
    })
}

const sleepUntilReminder = async(context,label,date) => {
    console.log(`Sleeping until ${label} reminder at ${date}`)
    await context.sleepUntil(date.toDate(), label)
}

const sendReminderEmail = async(context,subscription,reminderDate,label) => {
    return await context.run(label,async () =>{
        console.log(`Triggering ${label} reminder`)

        await triggerReminderEmail({
            to: subscription.user.email,
            type: reminderDate.label.subscription
        })
    })    
}