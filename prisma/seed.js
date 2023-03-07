const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
	const types = [
		{ name: 'CB' },
		{ name: 'Bank check' },
		{ name: 'Debit' },
		{ name: 'Debit (auto)' },
		{ name: 'Transfer' },
	]
	const recipients = [
		{ name: 'Shopping' },
		{ name: 'Gas' },
	]

	await prisma.type.deleteMany({})
	for (const type of types) {
		await prisma.type.create({
			data: type
		})
	}

	await prisma.recipient.deleteMany({})
	for (const recipient of recipients) {
		await prisma.recipient.create({
			data: recipient
		})
	}
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
