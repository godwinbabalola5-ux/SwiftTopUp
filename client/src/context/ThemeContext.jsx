import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

function ThemeProvider({ children }) {

    const [darkMode, setDarkMode] = useState(() => {

        const savedTheme = localStorage.getItem("theme");

        return savedTheme === "dark";

    });

    useEffect(() => {

        if (darkMode) {

            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");

        } else {

            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");

        }

    }, [darkMode]);

    const toggleTheme = () => {

        setDarkMode(prev => !prev);

    };

    return (

        <ThemeContext.Provider
            value={{
                darkMode,
                toggleTheme
            }}
        >

            {children}

        </ThemeContext.Provider>

    );

}

export default ThemeProvider;