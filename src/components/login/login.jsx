import { useRef, useState } from "react";
import useToken from "../../Hooks/useToken";

import "./login.css"

function Login() {
    const [, setToken] = useToken();
    const [status, setStatus] = useState(0);
    const name = useRef();
    const loginSubmit = (e) => {
        e.preventDefault();
        (async () => {
            try {
                const res = await fetch("https://backend6.onrender.com/user", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: name.current.value,
                    }),
                });
                const data = await res.json();
                setStatus(data?.status);
                setToken(data.data._id)

            } catch (error) {
                console.log(error);
            }
        })();

    };
    return (
        <div className="login">
            <h1>Name</h1>
            <form onSubmit={loginSubmit}>

                <input placeholder="name" className="login-input" style={
                    status === 400
                        ? {
                            border: "1px solid #D61F1F",
                        }
                        : {}
                } ref={name} type="text" />
                {
                    status === 400 ? <p> User alrady created</p> : ""
                } <br />
                <button className="login-btn">Enter</button>
            </form>

        </div>
    )
}

export default Login;
