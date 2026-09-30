const { randomBytes } = require("node:crypto");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const examples = [
  {
    email: "demo.giorgi.welder@example.com",
    firstName: "Giorgi",
    lastName: "Kapanadze",
    categoryId: "welder",
    subcategory: "ელექტრო შედუღება",
    city: "tbilisi",
    bio: "Experienced welder for gates, fences, and custom metalwork.",
    price: 80,
    isVip: true,
  },
  {
    email: "demo.nino.tiles@example.com",
    firstName: "Nino",
    lastName: "Maisuradze",
    categoryId: "tile",
    subcategory: "კედლის ფილების დაგება (აბაზანა, სამზარეულო)",
    city: "batumi",
    bio: "Bathroom and kitchen tiling, careful surface preparation, and grouting.",
    price: 65,
    isVip: true,
  },
  {
    email: "demo.davit.ac@example.com",
    firstName: "Davit",
    lastName: "Tsereteli",
    categoryId: "ac",
    subcategory: "კონდიციონერის მონტაჟი",
    city: "tbilisi",
    bio: "Air conditioner installation and maintenance for homes and small offices.",
    price: 100,
    isVip: true,
  },
  {
    email: "demo.levan.handyman@example.com",
    firstName: "Levan",
    lastName: "Beridze",
    categoryId: "handyman",
    subcategory: "წვრილმანი სარემონტო სამუშაოები",
    city: "kutaisi",
    bio: "Small home repairs, furniture assembly, and practical installation work.",
    price: 45,
    isVip: true,
  },
  {
    email: "demo.mariam.locksmith@example.com",
    firstName: "Mariam",
    lastName: "Chikovani",
    categoryId: "locksmith",
    subcategory: "კარის საკეტის მონტაჟი-შეცვლა",
    city: "rustavi",
    bio: "Door lock replacement and installation, with clear pricing before work begins.",
    price: 50,
    isVip: false,
  },
  {
    email: "demo.zurab.auto@example.com",
    firstName: "Zurab",
    lastName: "Gabunia",
    categoryId: "auto",
    subcategory: "ავტო ელექტრიკოსი",
    city: "gori",
    bio: "Automotive electrical diagnostics and repairs for common vehicle faults.",
    price: 70,
    isVip: false,
  },
];

async function main() {
  for (const example of examples) {
    const { email, firstName, lastName, ...profile } = example;
    const passwordHash = await bcrypt.hash(randomBytes(32).toString("hex"), 12);

    await prisma.user.upsert({
      where: { email },
      update: {
        firstName,
        lastName,
        role: "HANDYMAN",
        handyman: {
          upsert: {
            create: profile,
            update: profile,
          },
        },
      },
      create: {
        email,
        firstName,
        lastName,
        role: "HANDYMAN",
        passwordHash,
        handyman: { create: profile },
      },
    });
  }

  console.log(`Seeded ${examples.length} example handyman profiles.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
