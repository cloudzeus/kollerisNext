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

});






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
    required: true
  },
  address: {
    type: addressSchema,
  },
  phones: {
    type: phoneSchema,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});






const User = models.User || model('User', userSchema);
// const Test = models.Test || model('Test', testSchema);
export default User
// export default Test