const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('admin123', 10);
  
  await prisma.adminUser.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      email: 'admin@admin.com',
      password: hash,
    },
  });

  await prisma.ctaConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      buttonText: 'Lançar Meu Projeto',
      link: '#',
      helpText: 'Vamos construir juntos a próxima experiência digital de sucesso unindo estética requintada e performance impecável.',
    }
  });

  console.log('Seed completed. Admin: admin@admin.com / admin123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
