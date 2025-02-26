import { test } from "../../../test/setup.js"
import { createMessageElement, createMessagesWrapperElement, createDummyMessageElement } from "../../../test/fake-ui.js"
import { findMessagesWrapper, loadMoreMessages, findMessages } from "./dom-lookup.js"

test("findMessages", async t => {
	const messageElement = createMessageElement(t.context.document, "Test")
	t.context.mountElement.append(messageElement)
	t.deepEqual(await findMessages(t.context.document.body), [messageElement])
})

test("findMessages ignore if already processed", async t => {
	const messageElement = createMessageElement(t.context.document, "Test", true, true)
	t.context.mountElement.append(messageElement)
	t.deepEqual(await findMessages(t.context.document.body), [])
})

test("findMessages ignore if unsend button is not found", async t => {
	const messageElement = createMessageElement(t.context.document, "Test", false)
	t.context.mountElement.append(messageElement)
	t.deepEqual(await findMessages(t.context.document.body), [])
})

test("findMessages multiple", async t => {
	t.context.mountElement.append(...[
		createMessageElement(t.context.document, "Test", false),
		createMessageElement(t.context.document, "Testdsadsadsac"),
		createMessageElement(t.context.document, "Test", false),
		createMessageElement(t.context.document, "xzcxzdsadsadsa"),
		createMessageElement(t.context.document, "Test", false),
		createMessageElement(t.context.document, "32132xzcxzdsadsadsa"),
	])
	let messageElements = await findMessages(t.context.document.body)
	t.is(messageElements.length, 3)
	t.is(messageElements[0].querySelector("span").textContent, "Testdsadsadsac")
	t.is(messageElements[1].querySelector("span").textContent, "xzcxzdsadsadsa")
	t.is(messageElements[2].querySelector("span").textContent, "32132xzcxzdsadsadsa")
	messageElements = await findMessages(t.context.document.body)
	t.is(messageElements.length, 3)
	t.is(messageElements[0].querySelector("span").textContent, "Testdsadsadsac")
	t.is(messageElements[1].querySelector("span").textContent, "xzcxzdsadsadsa")
	t.is(messageElements[2].querySelector("span").textContent, "32132xzcxzdsadsadsa")
})

test("findMessages multiple dummies", async t => {
	t.context.mountElement.append(...[
		createDummyMessageElement(t.context.document),
		createMessageElement(t.context.document, "Test1", false),
		createMessageElement(t.context.document, "Testdsadsadsac"),
		createDummyMessageElement(t.context.document),
		createMessageElement(t.context.document, "Test2", false),
		createMessageElement(t.context.document, "xzcxzdsadsadsa"),
		createMessageElement(t.context.document, "Test3", false),
		createMessageElement(t.context.document, "32132xzcxzdsadsadsa"),
	])
	let messageElements = await findMessages(t.context.document.body)
	t.is(messageElements.length, 3)
	t.is(messageElements[0].querySelector("span").textContent, "Testdsadsadsac")
	t.is(messageElements[1].querySelector("span").textContent, "xzcxzdsadsadsa")
	t.is(messageElements[2].querySelector("span").textContent, "32132xzcxzdsadsadsa")
	messageElements = await findMessages(t.context.document.body)
	t.is(messageElements.length, 3)
	t.is(messageElements[0].querySelector("span").textContent, "Testdsadsadsac")
	t.is(messageElements[1].querySelector("span").textContent, "xzcxzdsadsadsa")
	t.is(messageElements[2].querySelector("span").textContent, "32132xzcxzdsadsadsa")
})

test("findMessagesWrapper", t => {
	const messagesWrapperElement = createMessagesWrapperElement(t.context.document)
	t.context.mountElement.append(messagesWrapperElement)
	t.not(findMessagesWrapper(t.context.window), null)
})

test("loadMoreMessages done", async t => {
	t.context.mountElement.append(createMessagesWrapperElement(t.context.document))
	const messagesWrapperElement = findMessagesWrapper(t.context.window)
	messagesWrapperElement.innerHTML += `<div role="progressbar"></div>` // FIXME subject to change
	const result = loadMoreMessages(messagesWrapperElement)
	messagesWrapperElement.querySelector("[role=progressbar]").remove()
	t.is(await result, true)
})

test("loadMoreMessages not done", async t => {
	t.context.mountElement.append(createMessagesWrapperElement(t.context.document))
	const messagesWrapperElement = findMessagesWrapper(t.context.window)
	messagesWrapperElement.innerHTML += `<div role="progressbar"></div>`  // FIXME subject to change
	const result = loadMoreMessages(messagesWrapperElement)
	messagesWrapperElement.scrollTop = 1
	messagesWrapperElement.querySelector("[role=progressbar]").remove()  // FIXME subject to change
	t.is(await result, false)
})

test("loadMoreMessages multiple pages", async t => {
	t.plan(7)
	const totalPages = 2
	const itemsPerPage = 5
	t.context.mountElement.append(createMessagesWrapperElement(t.context.document, totalPages, itemsPerPage))
	const messagesWrapperElement = findMessagesWrapper(t.context.window)
	let result
	for(let i = 0; i < totalPages;i ++) {
		t.is((await findMessages(t.context.document.body)).length, itemsPerPage)
		result = await loadMoreMessages(messagesWrapperElement)
		t.is((await findMessages(t.context.document.body)).length, itemsPerPage)
		if(i === 0) {
			t.is(result, false)
		}
	}
	t.is(result, true)
	t.is(messagesWrapperElement.currentPage, totalPages)
})

