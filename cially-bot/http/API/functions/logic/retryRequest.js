const { debug } = require("../../../../terminal/debug");
const { error } = require("../../../../terminal/error");

async function retryRequest(fn, retries = 25, baseDelay = 1000) {
	let attempt = 0;
	while (attempt < retries) {
		try {
			return await fn();
		} catch (err) {
			if (err.status === 429) {
				const retryAfter = err.response?.headers?.["retry-after"];
				const delay = retryAfter
					? Number.parseInt(retryAfter) * 1000
					: baseDelay * (attempt + 1);
				debug({
					text: `Retrying to communicate with the database in ${delay / 1000}s`,
				});
				await new Promise((resolve) => setTimeout(resolve, delay));
				attempt++;
			} else {
				error({
					text: `Request failed after ${attempt + 1} attempts. Error: ${err.message}`,
				});
				console.error(err); // Log the full error object
				throw err;
			}
		}
	}
	// This part is reached if all retries for a 429 error were exhausted
	error({
		text: `Max retries exceeded for 429 error after ${retries} attempts.`,
	});
	// It would be good to throw the last 'err' object from the 429 failure if available in this scope,
	// or a more specific error object. For now, throwing a generic one.
	throw new Error(
		`Max retries (${retries}) exceeded due to repeated 429 errors.`,
	);
}

module.exports = { retryRequest };
