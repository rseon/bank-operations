import {apiHandler} from "@/helpers";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

const getList = async (req, res) => {
	const types = await prisma.type.findMany({orderBy: [{ name: 'asc'}]})
	const recipients = await prisma.recipient.findMany({orderBy: [{ name: 'asc'}]})
	let operations = await prisma.operation.findMany({
		orderBy: [ {date: 'desc'} ],
		include: {
			recipient: true,
			type: true
		}
	})

	const balance = operations.reduce((acc, current) => {
		return acc + parseFloat(current.amount)
	}, 0)

	res.status(200).json({
		operations,
		types,
		recipients,
		balance,
	})
}

const create = async (req, res) => {
	const data = await processOperation(req.body)
	const operation = await prisma.operation.create({ data })

	res.status(200).json({
		success: true,
		operation,
	})
}

const update = async (req, res) => {
	const body = req.body
	const data = await processOperation(body)
	const operation = await prisma.operation.update({
		where: { id: body.id },
		data
	})

	res.status(200).json({
		success: true,
		operation,
	})
}

const destroy = async (req, res) => {
	const body = req.body

	const operation = await prisma.operation.delete({
		where: {
			id: body.id
		}
	})

	res.status(200).json({
		success: true,
		operation,
	})
}

const processOperation = async (body) => {
	const types = await prisma.type.findMany()
	const recipients = await prisma.recipient.findMany()

	let type = types.find(t => {
		return t.name.toLowerCase() === body.type.toLowerCase()
	})
	if (!type) {
		type = await prisma.type.create({data: {name: body.type}})
	}

	let recipient = recipients.find(r => {
		return r.name.toLowerCase() === body.recipient.toLowerCase()
	})
	if (!recipient) {
		recipient = await prisma.recipient.create({data: {name: body.recipient}})
	}

	return {
		amount: body.amount,
		date: new Date(body.date),
		detail: body.detail,
		typeId: type.id,
		recipientId: recipient.id
	}
}

export default apiHandler({
	get: getList,
	post: create,
	put: update,
	delete: destroy,
});
