import { useContext, createContext } from "react"
import { setAuthToken } from "../utils/auth"
import { useLocalStorage } from "./storage"
import { useCookies } from "react-cookie"
import { parseJWT } from "../utils/auth"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [cookies, setCookie, removeCookie] = useCookies(["token"])
    const [user, setLocalUser] = useLocalStorage("user", null);

    setAuthToken(cookies.token);

    const login = async token => {
        let decode = parseJWT(token);

        setCookie("token", token, { path: "/", sameSite: "none", expires: new Date(decode.exp * 1000), secure: true })
        setAuthToken(token);
    }

    const logout = () => {
        removeCookie("token");
        setUser(null);
        setAuthToken();
    }

    const setUser = user => {
        setLocalUser(user);
    }

    return (
        <AuthContext.Provider value={{ login, logout, cookies, user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}

