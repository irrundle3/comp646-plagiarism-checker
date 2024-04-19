import React, { useState, useEffect } from 'react';
import AddClass from '../components/addclass';

function StudentHome({setActiveUser}) {
    const [username, setUsername] = useState("");
    var showAddClass = false;

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
    });

    return (
        <div>
            <p> Hello <strong>{username}</strong>! Here are your classes:</p>
            <AddClass show={showAddClass}/>
        </div>
    )
}

export default StudentHome;