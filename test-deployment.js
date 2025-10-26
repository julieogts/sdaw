// Quick test script to verify deployment setup
const { MongoClient } = require('mongodb');

async function testMongoConnection() {
    try {
        console.log('🔍 Testing MongoDB connection...');
        
        const uri = "mongodb+srv://24uglyandrew:weaklings162@sanricosite.vgnc0qj.mongodb.net/";
        const client = new MongoClient(uri);
        
        await client.connect();
        console.log('✅ MongoDB connection successful!');
        
        // Test database access
        const db = client.db("MyProductsDb");
        const collections = await db.listCollections().toArray();
        console.log('✅ Database access successful!');
        console.log('📊 Available collections:', collections.map(c => c.name));
        
        await client.close();
        console.log('✅ Connection test completed successfully!');
        
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1);
    }
}

async function testServerDependencies() {
    try {
        console.log('🔍 Testing server dependencies...');
        
        const express = require('express');
        const cors = require('cors');
        const bcrypt = require('bcryptjs');
        const jwt = require('jsonwebtoken');
        const nodemailer = require('nodemailer');
        
        console.log('✅ All dependencies loaded successfully!');
        
    } catch (error) {
        console.error('❌ Dependency test failed:', error.message);
        process.exit(1);
    }
}

async function runTests() {
    console.log('🚀 Running deployment tests...\n');
    
    await testServerDependencies();
    console.log('');
    await testMongoConnection();
    
    console.log('\n🎉 All tests passed! Ready for deployment!');
}

runTests().catch(console.error);

