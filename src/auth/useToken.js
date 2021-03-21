import { useState } from 'react';

// a custom hook to trigger hook rerender
export default function useToken() {
    const [token, setToken] = useState('');
    const saveToken = userToken => {
        setToken(userToken);
    }
    return [
        token,
        saveToken,
    ]
}