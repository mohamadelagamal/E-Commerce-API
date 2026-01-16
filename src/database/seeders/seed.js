const User = require('../models/User');
const Product = require('../models/Product');
const logger = require('../../utils/logger');

/**
 * Seed database with sample data
 */
const seedDatabase = async () => {
    try {
        logger.info('Starting database seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});

        // Create admin user
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@ecommerce.com',
            password: 'admin123',
            role: 'admin',
            isEmailVerified: true
        });

        logger.info('Admin user created');

        // Create sample users
        const users = await User.create([
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                phone: '+1234567890',
                isEmailVerified: true
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: 'password123',
                phone: '+1234567891',
                isEmailVerified: true
            }
        ]);

        logger.info(`${users.length} sample users created`);

        // Create sample products
        const products = await Product.create([
            {
                name: 'Wireless Headphones',
                description: 'High-quality wireless headphones with noise cancellation',
                price: 99.99,
                comparePrice: 149.99,
                category: 'electronics',
                brand: 'AudioTech',
                sku: 'WH-001',
                stock: 50,
                images: [
                    {
                        url: 'https://via.placeholder.com/500x500?text=Headphones',
                        alt: 'Wireless Headphones',
                        isPrimary: true
                    }
                ],
                tags: ['wireless', 'audio', 'headphones'],
                isFeatured: true
            },
            {
                name: 'Smart Watch',
                description: 'Feature-rich smartwatch with fitness tracking',
                price: 199.99,
                comparePrice: 299.99,
                category: 'electronics',
                brand: 'TechWear',
                sku: 'SW-001',
                stock: 30,
                images: [
                    {
                        url: 'https://via.placeholder.com/500x500?text=Smart+Watch',
                        alt: 'Smart Watch',
                        isPrimary: true
                    }
                ],
                tags: ['smartwatch', 'fitness', 'wearable'],
                isFeatured: true
            },
            {
                name: 'Running Shoes',
                description: 'Comfortable running shoes for all terrains',
                price: 79.99,
                category: 'sports',
                brand: 'SportFit',
                sku: 'RS-001',
                stock: 100,
                images: [
                    {
                        url: 'https://via.placeholder.com/500x500?text=Running+Shoes',
                        alt: 'Running Shoes',
                        isPrimary: true
                    }
                ],
                tags: ['shoes', 'running', 'sports']
            },
            {
                name: 'Laptop Backpack',
                description: 'Durable backpack with laptop compartment',
                price: 49.99,
                category: 'other',
                brand: 'TravelGear',
                sku: 'LB-001',
                stock: 75,
                images: [
                    {
                        url: 'https://via.placeholder.com/500x500?text=Laptop+Backpack',
                        alt: 'Laptop Backpack',
                        isPrimary: true
                    }
                ],
                tags: ['backpack', 'laptop', 'travel']
            },
            {
                name: 'Coffee Maker',
                description: 'Programmable coffee maker with thermal carafe',
                price: 89.99,
                category: 'home',
                brand: 'BrewMaster',
                sku: 'CM-001',
                stock: 40,
                images: [
                    {
                        url: 'https://via.placeholder.com/500x500?text=Coffee+Maker',
                        alt: 'Coffee Maker',
                        isPrimary: true
                    }
                ],
                tags: ['coffee', 'kitchen', 'appliance']
            }
        ]);

        logger.info(`${products.length} sample products created`);
        logger.info('Database seeding completed successfully');

        console.log('\n=== Seeding Summary ===');
        console.log(`Admin User: ${adminUser.email} / admin123`);
        console.log(`Sample Users: ${users.length}`);
        console.log(`Sample Products: ${products.length}`);
        console.log('======================\n');

    } catch (error) {
        logger.error('Seeding error:', error);
        throw error;
    }
};

// Run seeder if this file is executed directly
if (require.main === module) {
    require('dotenv').config();
    const connectDB = require('../../config/database');

    connectDB().then(async () => {
        await seedDatabase();
        process.exit(0);
    }).catch((error) => {
        logger.error('Seeding failed:', error);
        process.exit(1);
    });
}

module.exports = seedDatabase;
