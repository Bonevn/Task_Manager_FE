export default function jsonResponse(
	data?: any,
	message: string = 'OK',
	statusCode: number = 200,
	pages?: any,
) {
	return {
		data: data,
		message: message,
		statusCode: statusCode,
		pages: pages,
	};
}
