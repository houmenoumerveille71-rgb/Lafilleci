const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const banners = await prisma.banner.findMany();
  const categoryBanners = await prisma.categoryBanner.findMany();
  const instagramPosts = await prisma.instagramPost.findMany();

  console.log('=== BANNERS ===');
  console.log(JSON.stringify(banners, null, 2));

  console.log('\n=== CATEGORY BANNERS ===');
  console.log(JSON.stringify(categoryBanners, null, 2));

  console.log('\n=== INSTAGRAM POSTS ===');
  console.log(JSON.stringify(instagramPosts, null, 2));

  await prisma.$disconnect();
}

main();
