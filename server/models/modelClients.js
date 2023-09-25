import mongoose from 'mongoose';
import { model, models, Schema } from 'mongoose';


const clientsSchema= new mongoose.Schema({
    TRDR: {
        type: String,
        require: true
    },
    CODE: {
        type: String,
        require: true
    },
   
    NAME: {
        type: String,
        require: true
    },
    jobtypetrd: {
        type: String,
    },
    AFM: {
        type: String,
        require: true
    },
    ISPROSP: {
        type: String,
        require: true
    },
    SOCURRENCY: {
        type: String,
        require: true
    },
    COMPANYTYPE: {
        type: String,
        require: true
    },
    DIASCODE: {
        type: String
    },
    ADDRESS: {
        type: String,
        require: true
    },
    ZIP: {
        type: String,
        require: true
    },
    PHONE01: {
        type: String,
    },
    PHONE02: {
        type: String,
    },
    FAX: {
        type: String,
    },
    TRDGROUP: {
        type: String,
    },
    TRDGROUP_NAME: {
        type: String,
    },
    CMPMODE: {
        type: String,
    },
  
},{
    timestamps: true
});


clientsSchema.index({
    NAME: 'text',
    PHONE01: 'text',
    CODE: 'text'
});



const Clients = models.Clients || model('Clients', clientsSchema);
// const Test = models.Test || model('Test', testSchema);
export default Clients
// export default Test