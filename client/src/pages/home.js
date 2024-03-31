import React, { useState, useEffect } from 'react';

function Home({setActiveUser}) {
    const [username, setUsername] = useState("");

    useEffect(() => {
        async function validateLogin() {
            const response = await fetch("api/login")
            if (await response.ok) {
                const data = await response.json()
                setUsername(data.username);
                setActiveUser(data.username);
                return;
            }
            window.location.replace("/login");
        }
        validateLogin();
    }, [])

    return (
        <p> Hello {username} </p>
    )
}

export default Home;