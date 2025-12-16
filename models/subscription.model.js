import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required:[true,"Name is required"],
        trim:true,
        minlength:[3,"Name must be at least 3 characters long"],
        maxlength:[100,"Name must be at most 100 characters long"]
    },
    price: {
        type: Number,
        required:[true,"Price is required"],
        trim:true,
        min:[0,"Price must be greater than 0"],
    },
    currency: {
        type: String,
        required:[true,"Currency is required"],
        trim:true,
        enum:["USD","EUR","GBP"],
        default:"USD"
    },
    frequency: {
        type: String,
        enum:["monthly","yearly", 'daily','weekly'],
        required:true
    },
    category: {
        type: String,
        enum:['sports','music','books','movies','tv-shows','gaming','fitness','health','beauty','food','travel','education','business','technology','entertainment','other'],
        required:true
    },
    paymentMethod: {
        type: String,
        required:true,
        trim:true
    },
    status: {
        type: String,
        enum:["active","cancelled",'expired'],
        default:"active"
    },
    startDate:{
        type: Date,
        required:true,
        validate: {
            validator: (value) => value <= new Date(),
            message: "Start date must be in the past"
        }
    },
    renewalDate:{
        type: Date,
        validate: {
            validator: (value) => value > this.startDate,
            message: "Renewal date must be after the start date"
        }
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true
    }
}, {timestamps:true})

// Auto calculate renewal date if missing.
subscriptionSchema.pre('save', async function(){
    if(!this.renewalDate){
        if(!this.frequency){
            throw new Error('Frequency is required to calculate renewal date');
        }
        const renewalPeriods = {
            monthly: 30,
            yearly: 365,
            daily: 1,
            weekly: 7
        }
        if(!renewalPeriods[this.frequency]){
            throw new Error('Invalid frequency specified');
        }
        this.renewalDate = new Date(this.startDate)
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency])
    }

    // Auto update the status if renewal date has passed
    if(this.renewalDate < new Date()){
        this.status = "expired"
    }
})

const Subscription = mongoose.model("Subscription",subscriptionSchema)

export default Subscription