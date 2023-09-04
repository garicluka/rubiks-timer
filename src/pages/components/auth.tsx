import type { NextPage } from "next";
import { useState } from "react";
import Login from "./login";
import Register from "./register";

const Auth: NextPage = () => {
    const [register, setRegister] = useState(false);

    return (
        <div>
            {register ? (
                <div>
                    <Register setRegister={setRegister} />
                </div>
            ) : (
                <div>
                    <Login setRegister={setRegister} />
                </div>
            )}
        </div>
    );
};

export default Auth;
