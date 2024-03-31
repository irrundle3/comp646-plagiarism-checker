import React, { useState, useEffect } from 'react';

export default function Logout({setActiveUser}) {
    setActiveUser("Not logged in");
    fetch("/api/logout").then(() => window.location.replace("/"));
}