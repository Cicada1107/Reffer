//Prisma db connection test file (AI Generated)
import { prisma } from './prisma';

export async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    const userCount = await prisma.user.count();
    console.log(`📊 Total users: ${userCount}`);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

testDatabaseConnection();