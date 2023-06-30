import { model, models } from 'mongoose';
import mongoose from 'mongoose';



const phoneSchema = new mongoose.Schema({
  mobile: {
    type: String,
  },
  landline: {
    type: String,
  }
});



const addressSchema = new mongoose.Schema({
  country: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  postalcode: {
    type: String,
  },
  shippingAddress: {
    type: String,
  },

}
);






const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true

  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'employee', 'manager', 'admin']
  },
 
  address: {
    country: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    postalcode: {
      type: String,
    },
    shippingAddress: {
      type: String,
    },
  
  },
  phones:{
    mobile: {
      type: String,
    },
    landline: {
      type: String,
    }
  }, 
  status: Boolean,
  updatedFrom: String,
  
},
{
  timestamps: true,
}
);







const User = models.User || model('User', userSchema);
export default User