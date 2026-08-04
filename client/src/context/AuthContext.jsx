import { createContext, useEffect, useState } from "react";
import api from "../services/api";
import socket from "../services/socket";

export const AuthContext = createContext();

function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {

        const token = localStorage.getItem("token");

        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {

            const response = await api.get("/profile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const profile = response.data.profile;

            setUser(profile);

            console.log("PROFILE:", profile);

            if (profile?.id) {
                socket.emit("join", profile.id);
            }

        } catch (err) {

            console.error("Refresh User Error:", err);

            setUser(null);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {
        refreshUser();
    }, []);

    const logout = () => {

        localStorage.removeItem("token");
        sessionStorage.removeItem("token");

        socket.disconnect();

        setUser(null);

    };

    return (

        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                refreshUser,
                logout
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}

export default AuthProvider;