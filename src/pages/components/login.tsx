import type { NextPage } from "next";
import type { SetStateAction } from "react";
import { signIn } from "next-auth/react";
import { useState } from "react";

const Login: NextPage<{
    setRegister: (value: SetStateAction<boolean>) => void;
}> = ({ setRegister }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        signIn("credentials", {
            username,
            password,
        });
        setUsername("");
        setPassword("");
    };

    return (
        <div>
            <div className="bg-neutral-900 h-24 grid place-content-center">
                <p className="text-white text-[40px] mob:text-[35px]">Log In</p>
            </div>
            <div className="grid grid-cols-layout h-[calc(100vh-96px)] mob:grid mob:grid-cols-none">
                <div className="bg-[#3f3f3f] mob:hidden">
                    <p className="mt-10 text-center text-white text-lg">
                        Log In to see solves
                    </p>
                </div>
                <div className="bg-[#3c3c3c] grid place-content-center mob:bg-[#3f3f3f]">
                    <form
                        className="bg-neutral-900 text-2xl p-[105px] mob:text-xl mob:p-[90px]"
                        onSubmit={handleSubmit}
                    >
                        <label className="text-white">
                            <p className="mb-4 mob:mb-3">Username:</p>
                            <input
                                className="px-2 mb-8 bg-[#474747] w-[330px] h-[49px] mob:h-[45px] mob:w-[320px] mob:mb-6"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </label>
                        <label className="text-white">
                            <p className="mb-4 mob:mb-3">Password:</p>
                            <input
                                className="px-2 mb-12 bg-[#474747] w-[330px] h-[49px] mob:h-[45px] mob:w-[320px] mob:mb-9"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>
                        <div>
                            <button
                                className="mb-1 bg-[#3f3f3f] rounded-full border border-purple-400 text-xl text-white w-[330px] h-[42px] mob:text-base mob:w-[320px]"
                                type="submit"
                            >
                                Log In
                            </button>
                        </div>
                        <div>
                            <p
                                className="text-xl text-purple-400 text-center cursor-pointer font-light mob:text-base"
                                onClick={() => setRegister(true)}
                            >
                                or register
                            </p>
                        </div>
                    </form>
                </div>
                <div className="bg-[#3f3f3f] mob:hidden">
                    <p className="text-white text-lg mt-10 text-center">
                        Log In to see stats
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
