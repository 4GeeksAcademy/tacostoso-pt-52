import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {

	const { store, dispatch } = useGlobalReducer();

	return (
		<nav className="navbar text-white bg-success">
			<div className="container">
				<Link to="/" className="text-decoration-none">
					<span className="h3 text-light">
						🌮 Tancotodo
					</span>
				</Link>
				<div className="ml-auto d-flex">
					{/* <Link to="/demo">
						<button className="btn btn-primary">Check the Context in action</button>
					</Link> */}

					<p className="my-auto mx-2">
						{store.profile && `Welcome ${store.profile.email}`}
					</p>

					<Link to={'/create/taco'}>
						<button className="btn bg-white">
							Order
						</button>
					</Link>

					{!store.profile &&
						<Link to={'/login'}>
							<button className="mx-2 btn btn-outline-dark">
								Login
							</button>
						</Link>
					}

					{
						store.profile && <button className="mx-2 btn btn-outline-dark"
							onClick={() => {
								localStorage.removeItem("token")
								localStorage.removeItem("email")
								dispatch({ type: "set_profile", payload : null })
							}}
						>
							Log Out
						</button>
					}

				</div>
			</div>
		</nav>
	);
};