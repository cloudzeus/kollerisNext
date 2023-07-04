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
    ],
    status: Boolean,
    updatedFrom: String,
    createdFrom: String,
    deletedFrom: String,
    groups: [{ type: Schema.Types.ObjectId, ref: "MtrGroup" }],
}, {

    timestamps: true,
});




const MtrGroupSchema = new mongoose.Schema({
    category: { type: Schema.Types.ObjectId, ref: "MtrCategory" },
    subGroups: [{ type: Schema.Types.ObjectId, ref: "SubMtrGroup" }],
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
    ],
    status: Boolean,
    updatedFrom: String,
    createdFrom: String,
    deletedFrom: String,
}, {

    timestamps: true,
});



const MtrSubGroupSchema = new mongoose.Schema({
    group: {
        type: Schema.Types.ObjectId,
        ref: 'MTRGROUP'
    },
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
    ],
    status: Boolean,
    updatedFrom: String,
    createdFrom: String,
    deletedFrom: String,
}, {

    timestamps: true,
});






const MtrCategory = mongoose.models.MtrCategory || mongoose.model('MtrCategory', MtrCategorySchema);
const MtrGroup = mongoose.models.MtrGroup || mongoose.model('MtrGroup', MtrGroupSchema);
const SubMtrGroup = mongoose.models.SubMtrGroup || mongoose.model('SubMtrGroup', MtrSubGroupSchema)

export {
    MtrCategory,
    MtrGroup,
    SubMtrGroup
}