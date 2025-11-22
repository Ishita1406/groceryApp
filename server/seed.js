// seed.js
import mongoose from 'mongoose';
import Product from './models/product.model.js';
import dotenv from 'dotenv';

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI;

const seedProducts = [
  { name: 'Red Apple', price: 40, imageUrl: 'https://images.unsplash.com/photo-1695028102094-9b1396f17304?q=80&w=772&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'Fruits', stock: 50, description: 'Fresh red apples' },
  { name: 'Banana Bunch', price: 30, imageUrl: 'https://plus.unsplash.com/premium_photo-1724250081106-4bb1be9bf950?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'Fruits', stock: 100 },
  { name: 'Spinach Pack', price: 20, imageUrl: 'https://images.unsplash.com/photo-1622127573737-2921057fdf62?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'Vegetables', stock: 70 },
  { name: 'Milk 1L', price: 50, imageUrl: 'https://images.unsplash.com/photo-1576186726115-4d51596775d1?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'Dairy', stock: 200 },
  { name: 'Paneer 200g', price: 120, imageUrl: 'https://plus.unsplash.com/premium_photo-1695044277238-6eac8969fb77?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'Dairy', stock: 40 },
  { name: 'Carrot 1kg', price: 35, imageUrl: 'https://images.unsplash.com/photo-1582515073490-39981397c445?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'Vegetables', stock: 80 }
];

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to mongo — seeding...');
    await Product.deleteMany({});
    await Product.insertMany(seedProducts);
    console.log('Seed complete');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });