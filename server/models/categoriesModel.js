import mongoose from 'mongoose';
import { model, models, Schema } from 'mongoose';

 const MtrCategorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
    },
    categoryIcon: {
        type: String
    },
    categoryImage: {
        type: String
    },
    softOne: {
        MTRCATEGORY: {
            type: Number
        },
        CODE: {
            type: String
        },
        NAME: {
            type: String
        },
        ISACTIVE: {
            type: Boolean
        }
    },
    localized: [
        {
            locale: {
                type: String,
                required: true
            },
            name: {
                type: String
            },
            description: {
                type: String
            }
        }
    ]
}, {

    timestamps: true,
});




const MtrGroupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true,
    },
    groupIcon: {
        type: String
    },
    groupImage: {
        type: String
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'MTRCATEGORY'
    },
    softOne: {
        MTRGROUP: {
            type: Number
        },
        CODE: {
            type: String
        },
        NAME: {
            type: String
        },
        ISACTIVE: {
            type: Boolean
        }
    },
    localized: [
        {
            locale: {
                type: String,
                required: true
            },
            name: {
                type: String
            },
            description: {
                type: String
            }
        }
    ]
}, {

    timestamps: true,
});



const MtrSubGroupSchema = new mongoose.Schema({
    subGroupName: {
        type: String,
        required: true,
    },
    subGroupIcon: {
        type: String
    },
    subGroupImage: {
        type: String
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: 'MTRGROUP'
    },
    softOne: {
        cccSubgroup2: {
            type: Number
        },
        short: {
            type: String
        },
        name: {
            type: String
        }
    },
    localized: [
        {
            locale: {
                type: String,
                required: true
            },
            name: {
                type: String
            },
            description: {
                type: String
            }
        }
    ]
}, {

    timestamps: true,
});






const MTRCATEGORY = models.MTRCATEGORY || model('MTRCATEGORY', MtrCategorySchema);
const MTRGROUP = models.MTRGROUP || model('MTRGROUP', MtrGroupSchema);
const SUBMTRGROUP = models.SUBMTRGROUP || model('SUBMTRGROUP', MtrSubGroupSchema);


export default MTRCATEGORY;