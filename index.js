const prisma = require("./prisma/prisma")

async function main() {
    console.log("main() ran")

    // await prisma.debt.deleteMany()
    // const users = await prisma.user.findMany()
    // console.log(users)

    const requests = await prisma.moneyRequest.findMany()

    console.log(requests)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
