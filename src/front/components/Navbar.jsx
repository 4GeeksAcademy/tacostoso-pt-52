import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar text-white bg-success">
			<div className="container">
				<Link to="/" className="text-decoration-none">
					<span className="h3 text-light">
						🌮 Tancotodo
					</span>
				</Link>
				<div className="ml-auto">
					{/* <Link to="/demo">
						<button className="btn btn-primary">Check the Context in action</button>
					</Link> */}
					<Link to={'/create/taco'}>
						<button className="btn bg-white">
							Order
						</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};