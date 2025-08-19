import { useState } from "react";
import TacoLogo from "../assets/img/logo.png";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const navigate = useNavigate()

    const [credentials, setCredentials] = useState({});

    const { dispatch } = useGlobalReducer();

    const handleInputs = (evt) => {
        const key = evt.target.name; // email - password
        setCredentials({
            ...credentials, [key]: evt.target.value
        })
    }

    const apiUrl = import.meta.env.VITE_BACKEND_URL;

    const authorize = async (evt) => {
        evt.preventDefault();
        console.log(credentials);

        const resp = await fetch(apiUrl + `/api/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials)

        })

        if (resp.ok) {
            const data = await resp.json()

            dispatch({
                type: 'set_profile',
                payload: {
                    email: credentials.email,
                    token: data.access_token,
                }
            })

            localStorage.setItem('token', data.access_token);
            localStorage.setItem('email', credentials.email)

            alert(
                `Access granted! 🦖`
            )

            navigate(`/`)

            return data;
        }


    }

    return (<>
        <main className="form-signin col-6 mx-auto my-5" style={{ minHeight: '75vh' }}>
            <form className="d-flex flex-column w-100">
                <img className="mb-4 mx-auto" src={TacoLogo} alt="" width="72" height="57" />
                <h1 className="h3 mb-3 fw-normal">Log in</h1>
                <div className="form-floating">
                    <input type="email" name="email" className="form-control" id="floatingInput" placeholder="name@example.com"
                        onChange={handleInputs}
                    />
                    <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating">
                    <input type="password" name="password" className="form-control" id="floatingPassword" placeholder="Password"
                        onChange={handleInputs}
                    />
                    <label htmlFor="floatingPassword">Password</label>
                </div>
                {/* <div className="form-check text-start my-3">
                    <input className="form-check-input" type="checkbox" value="remember-me" id="checkDefault" />
                    <label className="form-check-label" htmlFor="checkDefault">
                        Remember me
                    </label>
                </div> */}
                <button className="btn btn-success w-100 py-2 mt-2"
                    onClick={authorize}
                    type="submit"
                >
                    Log in
                </button>
            </form>
        </main>
    </>)
}

export default Login;