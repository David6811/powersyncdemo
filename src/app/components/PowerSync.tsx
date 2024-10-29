"use client";
import React, { useEffect, useState } from 'react';
import { Customers } from '../domain/data/interfaces';
import './styles.css';
import { addCustomerToLocalDB, deleteCustomerFromLocalDB, findAllData, setupPowerSync } from '../services/database';

const App: React.FC = () => {
    const [data, setData] = useState<Customers[] | null>(null);
    const [name, setName] = useState<string>('John Doe'); // Default name
    const [email, setEmail] = useState<string>('john.doe@example.com'); // Default email

    useEffect(() => {
        const initPowerSync = async () => {
            await setupPowerSync();
            const customers = await findAllData();
            console.log("Find All Data Result:", customers);
            setData(customers);
        };

        initPowerSync();

        // Set up polling to call findAllData every second
        const intervalId = setInterval(async () => {
            const customers = await findAllData();
            setData(customers); // Update the state with new data every second
        }, 50);

        // Cleanup interval when component unmounts
        return () => clearInterval(intervalId);

    }, []);

    const handleAdd = async () => {
        if (!name || !email) {
            alert("Please enter both name and email."); // Alert if fields are empty
            return;
        }

        await addCustomerToLocalDB(name, email);
        const customers = await findAllData();
        setData(customers);
        setName('John Doe');
        setEmail('john.doe@example.com');
    };

    const handleDelete = async (id: string) => {
        await deleteCustomerFromLocalDB(id);
        const customers = await findAllData();
        setData(customers); // Store the fetched data in state
    };

    return (
        <div className="app-container">
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                />
                <button onClick={handleAdd} className="add-button">ADD</button>
            </div>
            <div className="customer-list">
                {data && data.length > 0 ? (
                    <ul>
                        {data.map((item) => (
                            <li key={item.id} className="list-item">
                                <span className="item-id">{item.id}</span>
                                <span className="item-name">{item.name}</span>
                                <span className="item-email">{item.email}</span>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="delete-button"
                                    title="Delete"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <span>No data available</span>
                )}
            </div>
        </div>
    );
};

export default App;

