import { PrismaClient } from "@prisma/client";

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Software Engineering" },
        { name: "Data" },
        { name: "Web Development" },
        { name: "Cloud Computing" },
        { name: "Artificial IIntelligence" },
        { name: "Computer Networking" },
        { name: "Engineering" },
        { name: "Business" },
        { name: "Sports" },
        { name: "Music" },
        { name: "Arts" },
        { name: "Drawing" },
        { name: "Writting" },
        { name: "Photography" },
        { name: "Videography" },
        { name: "Marketing" },
        { name: "Accounting" },
        { name: "Human Resources" },
        { name: "Management" },
        { name: "Self Improvement" },
      ],
    });
    
    console.log("Success");
  } catch (error) {
    console.log("Error seeding the database categories", error);
  } finally {
    await database.$disconnect();
  }
}

main();