import React, { useState, useEffect } from 'react';
import AddClass from '../components/addclass';

function Home({ setActiveUser }) {
    const [username, setUsername] = useState("");
    var showAddClass = false;

    useEffect(() => {
        async function validateLogin() {
            const response = await fetch("/api/teacher/login", {
                method: "GET"
            });
            if (response.ok) {
                try {
                    const data = await response.json();
                    setUsername(data.username);
                    setActiveUser(data.username);
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                    // Handle the error here, e.g., show a message to the user
                }
            } else {
                console.error("Response not OK:", response.status);
                // Handle the error here, e.g., show a message to the user
                window.location.replace("/login");
            }
        }
        validateLogin();
    }, []); // Empty dependency array to run only once after initial render

    useEffect(() => {
        console.log("Username updated:", username);
    }, [username]); // Log the username whenever it changes

    console.log("Username after rendering:", username);

    return (
        <div>
            <p> Hello <strong>{username}</strong>! Here are your classes:</p>
            <AddClass setActiveUser={setActiveUser} />

        </div>
    )
}

export default Home;
