/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#111827", // Dark slate/black from screenshots
                secondary: "#64748b", // Muted text
                accent: "#0ea5e9", // Blue accent
                success: "#22c55e", // Green logs
                warning: "#eab308", // Yellow status
                error: "#ef4444", // Red alerts
                card: "#ffffff",
                background: "#f8fafc", // Light gray background
            },
            fontFamily: {
                // In a real app we'd load fonts. Using system default for prototype.
                sans: ["System"],
            }
        },
    },
    plugins: [],
}
