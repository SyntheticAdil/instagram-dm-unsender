/** @module default-ui Default UI / English UI */

import UI from "../ui.js"
import { findMessagesWrapper, findMessages } from "./dom-lookup.js"
import UIPIMessage from "../../uipi/uipi-message.js"
import UIMessage from "./ui-message.js"
import UIMessagesWrapper from "./ui-messages-wrapper.js"

class DefaultUI extends UI {

	constructor(root, identifier={}) {
		super(root, identifier)
		this.lastScrollTop = null
	}

	/**
	 * @param {Window} window
	 * @returns {DefaultUI}
	 */
	static create(window) {
		console.debug("UI create")
		const messagesWrapperElement = findMessagesWrapper(window)
		if(messagesWrapperElement !== null) {
			console.debug("Found messagesWrapperElement", messagesWrapperElement)
			const uiMessagesWrapper = new UIMessagesWrapper(messagesWrapperElement)
			return new DefaultUI(window, { uiMessagesWrapper })
		} else {
			throw new Error("Unable to find messagesWrapperElement")
		}
	}

	/**
	* @param {AbortController} abortController
	* @returns {Promise}
	*/
	async fetchAndRenderThreadNextMessagePage(abortController) {
		console.debug("UI fetchAndRenderThreadNextMessagePage")
		return await this.identifier.uiMessagesWrapper.fetchAndRenderThreadNextMessagePage(abortController)
	}

	/**
	 * @param {AbortController} abortController
	 * @returns {Promise<UIPIMessage>}
	 */
	async getNextUIPIMessage(abortController) {
		console.debug("UI getNextUIPIMessage", this.lastScrollTop)
		const uiMessagesWrapperRoot = this.identifier.uiMessagesWrapper.root
		const startScrollTop = this.lastScrollTop || uiMessagesWrapperRoot.scrollHeight - uiMessagesWrapperRoot.clientHeight
		for(let i = startScrollTop;i > 0;i = i - 1 ) { // TODO scroll and map element to scrollTop
			if(abortController.signal.aborted) {
				break
			}
			this.lastScrollTop = i
			uiMessagesWrapperRoot.scrollTop = i
			uiMessagesWrapperRoot.dispatchEvent(new this.root.Event("scroll"))
			await new Promise(resolve => setTimeout(resolve, 200)) // IDMU_MESSAGE_QUEUE_DELAY
			const messageElement = (await findMessages(uiMessagesWrapperRoot, abortController)).pop()
			if(messageElement) {
				const uiMessage = new UIMessage(messageElement)
				return new UIPIMessage(uiMessage)
			}
		}
	}

}

export default DefaultUI
