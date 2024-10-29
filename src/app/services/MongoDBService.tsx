export const saveCustomerToMongo = async (_id: string, name: string, email: string) => {
    const response = await fetch('/api/mongo', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id, name, email }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${errorData.error || response.status}`);
    }

    await response.json();
};
