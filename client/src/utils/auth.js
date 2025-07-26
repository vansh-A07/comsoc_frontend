export const getAuth = () => {
    return JSON.parse(localStorage.getItem("user"))
};
export const clearAuth = () => localStorage.removeItem("user");