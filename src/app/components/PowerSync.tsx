"use client";
import React, { useEffect, useState } from 'react';
import { Customers } from '../domain/data/interfaces';
import './styles.css';
import { findAllData, setupPowerSync } from '../services/database';

const App: React.FC = () => {
    const [data, setData] = useState<Customers[] | null>(null);

    useEffect(() => {
        const initPowerSync = async () => {
            await setupPowerSync();
            const customers = await findAllData();
            console.log("Find All Data Result:", customers);
            setData(customers);
        };

        initPowerSync();
    }, []);


    return (
        <div className="app-container">
            <div className="customer-list">
                {data && data.length > 0 ? (
                    <ul>
                        {data.map((item) => (
                            <li key={item.id} className="list-item">
                                <span className="item-id">{item.id}</span>
                                <span className="item-name">{item.name}</span>
                                <span className="item-email">{item.email}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <span>No data available</span> // Display a message if no data exists
                )}
            </div>
        </div>
    );
};

export default App;
