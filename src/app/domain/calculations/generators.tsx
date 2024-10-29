// Function to generate a MongoDB ObjectId
export const generateObjectId = (): string => {
    const timestamp = (Date.now() / 1000 | 0).toString(16).padStart(8, '0'); // 4 bytes timestamp in hex
    const randomBytes = [...Array(5)].map(() => (Math.random() * 256 | 0).toString(16).padStart(2, '0')).join(''); // 5 bytes random
    const counter = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0'); // 3 bytes counter
    return timestamp + randomBytes + counter; // Combine all parts
};
