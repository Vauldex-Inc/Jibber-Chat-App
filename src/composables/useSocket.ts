const baseUrl = import.meta.env.VITE_JIBBER_BASE_URL_SOCKET

export const useSocket = (uri: string, callback: (data: MessageEvent) => void) => {
	const socket = new WebSocket(baseUrl + uri)
	socket.onmessage = (data: MessageEvent) => {
		callback(data)
	}	
	return socket
}