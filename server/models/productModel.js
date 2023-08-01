import mongoose from 'mongoose';
import { model, models, Schema } from 'mongoose';


const soft1Schema = new mongoose.Schema({
    // define the fields for the soft1 collection as needed
    mtrl: {
        type: Number,
        required: true
    },
    isActivel: {
        type: Number,
        required: true
    },
    //Όνομα Προιόντος
    name: {
        type: String,
        required: true
    },
    //Όνομα στα Αγγλικά
    name1: {
        type: String,
        required: true
    },
    //label Κωδικός ERP
    code: {
        type: String,
        required: true
    },
    //label Κωδικός ΕΑΝ/Barcode
    code1: {
        type: String

    },
    //label Κωδικός εργοστασίου
    code2: {
        type: String

    },
    //label Κωδικός Εμπορικής Κατηγορίας
    mtrcategory: {
        type: String,
        required: true
    },
    //label Κωδικός Κατηγορίας
    mtrgroup: {
        type: String,
        required: true
    },
    //label Κωδικός Υποκατηγορίας
    cccsubgroup2: {
        type: String,
        required: true
    },
    //label Κωδικός Κατασευαστή
    mtrmanfctr: {
        type: String,
        required: true
    },
    //label Κωδικός Μάρκας
    mtrmark: {
        type: String,
        required: true
    },
    //label Κωδικός ΦΠΑ 
    vatCode: {
        type: Number,
        required: true
    },
    //Κωδικός Κύριας Μόνάδας μέτρησης 
    mtrunit1: {
        type: Number,
        required: true
    },
    //Κωδικός Μόνάδας μέτρησης Αγορών
    mtrunit3: {
        type: Number,
        required: true
    },
    //Σχέση Μόνάδας μέτρησης Αγορών με την κύρια
    mu31: {
        type: Number,
        required: true
    },
    //Μόνάδα μέτρησης Πώλησης
    mtrunit4: {
        type: Number,
        required: true
    },
    //Σχέση Κωδικός Μόνάδας μέτρησης Αγορών με την κύρια
    mu41: {
        type: Number,
        required: true
    },

    //Διαστάσεις
    dimensions: {
        width: {
            type: Number,
            required: true
        },
        length: {
            type: Number,
            required: true
        },
        height: {
            type: Number,
            required: true
        },
    },
    //label Βάρος σε Κιλά
    gweight: {
        type: String,
        required: true
    },
    //label Όγκος σε Κιλά
    volume: {
        type: String,
        required: true
    },
    //label Κωδικός χρήστη τελευταίας ενημέρωσης
    upduser: {
        type: String,
        required: true
    },
    //label Ημερομημία τελυταίας ενημέρωσης
    upddate: {
        type: Date,
        required: true
    },
});




// στο type επιλέγουμε video, image, vector αυτό μπορούμε να το ελεγξουμε από το extension
const mediaSchema = new mongoose.Schema({
    // define the fields for the image collection as needed
    name: { type: String, required: true },
    type: { type: String, required: true },
    url: { type: String, required: true }
    // other fields...
});



const attributesSchema = new mongoose.Schema({
    localized: [{
        field: [{
            fieldName: String,
            translation: String
        }],
        locale: String,
        code: String,
    }],
    attributeValue:
    {
        label: {
            type: String
        }

    }
});


const productAttributesSchema = new mongoose.Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    attributes: [
        {
            attribute: {
                type: Schema.Types.ObjectId,
                ref: 'Attribute'
            },
            value: {
                type: String,
                required: true

            }
        }
    ]
});

//Οι IMPA codes είναι οι κωδικοί που χρησιμοποιεί η Ναυτηλία και ένα προιόν μπορεί να υπάγεται σε πολλούς IMPA
const impaCodesSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    localized: [{
        field: [{
            fieldName: String,
            translation: String
        }],
        locale: String,
        code: String,
    }],
});



const attributesGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    MtrGroup: {
        type: Schema.Types.ObjectId,
        ref: 'MtrGroupSchema'
    }
    ,
    attributes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Attribute'
        }]
});



const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    localized: [{
        field: [{
            fieldName: String,
            translation: String
        }],
        locale: String,
        code: String,
    }],
    prices: [
        {
            name: {
                type: String,
                required: true
            },
            value: {
                type: Number
            }

        }
    ],
    stock: { type: Number, required: true },
    expected: { type: Number, required: true },
    reserved: { type: Number, required: true },
    soft1: {
        type: Schema.Types.ObjectId,
        ref: 'Soft1',
        required: false
    },
    images: [{
        type: Schema.Types.ObjectId,
        ref: 'Media'
    }],
    impas: [{
        type: Schema.Types.ObjectId,
        ref: 'ImpaCodes'
    }],
    videos: [{
        type: Schema.Types.ObjectId,
        ref: 'Media'
    }],
    videosUrl: {
        type: String,
        required: true
    },
    //Σελίδα κατασκευαστή
    ventorUrl: { type: String, required: true },

});

const Attribute = models.Attribute || model('Attribute', attributesSchema);
const AttributesGroup  = models.AttributesGroup || model('AttributesGroup ', attributesGroupSchema);
const ProductAttributes = models.ProductAttributes || model('ProductAttributes', productAttributesSchema);
const ImpaCodes = models.ImpaCodes || model('ImpaCodes',impaCodesSchema );
const Media  = models.Media  || model('Media',mediaSchema);
const Soft1 = models.Soft1 || model('Soft1', soft1Schema );
const Product = models.Product || model('Product', productSchema );


export {
    AttributesGroup,
    Attribute,
    ImpaCodes,
    Media,
    Soft1,
    ProductAttributes,
    Product
}