import React, { useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import Logo from "../assets/img/logo.png"

const titleStyles = {
	fontFamily: "'Playfair Display', serif",
	fontWeight: "700",
}

const Hero = () => (
	<div
		className="p-4 p-md-5 mb-4 rounded position-relative text-white"
		style={{
			...titleStyles,
			backgroundImage: `url(${Logo})`,
			backgroundSize: "cover",
			backgroundPosition: "center",
			backgroundRepeat: "no-repeat",
			color: "#fff",
			overflow: "hidden",
			//border: "4px solid #C8102E", // Mexican red accent
			boxShadow: "0 0 20px 0 #FFD600", // Mexican yellow accent
		}}
	>
		{/* Overlay for readability */}
		<div
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				background: "rgba(3, 3, 3, 0.5)", // Bootstrap dark with opacity
				zIndex: 1,
				borderRadius: "inherit",
			}}
		/>
		<div className="col-md-6 px-0 position-relative" style={{ zIndex: 2 }}>
			<h1 className="display-4 fst-italic text-white">
				Tacostoso: más sabroso que tu ex 🫣
			</h1>
			<p className="lead mb-0">
				<button className="fw-bold btn btn-danger">Buy Now</button>
			</p>
		</div>
	</div>
)

const tacoImage = "https://cdn.pixabay.com/photo/2023/08/08/08/46/tacos-8176774_1280.jpg"

const exampleTacos = [
	{
		"id": 1,
		"protein": {
			"id": 1,
			"name": "Birria",
			"price": 0.8
		},
		"sauces": [
			{
				"id": 2,
				"name": "Roja",
				"spice": "MEDIO"
			},
			{
				"id": 3,
				"name": "Amarilla",
				"spice": "ARRANCA_GARGANTAS"
			}
		],
		"tortilla": "HARINA"
	},
	{
		"id": 2,
		"protein": {
			"id": 3,
			"name": "Al Pastor",
			"price": 1.2
		},
		"sauces": [],
		"tortilla": "HARINA"
	},
	{
		"id": 3,
		"protein": {
			"id": 6,
			"name": "ternera",
			"price": 0.5
		},
		"sauces": [],
		"tortilla": "MAIZ"
	}
]

const TacoCard = ({ taco }) => {
	return (
		<div className="col-3">
			<div className="card m-2" style={{ width: "18rem" }}>
				<img
					src={tacoImage}
					className="card-img-top"
					alt={`Taco de ${taco.protein ? taco.protein.name : "desconocido"}`}
				/>
				<div className="card-body">
					<h5 className="card-title">Taco de {taco && taco.protein.name}</h5>
					<p className="card-text">
						<strong>
							<i className="fa-solid fa-drumstick-bite" style={{
								color: "#a15912"
							}}>
							</i> Proteína:
						</strong>{" "}
						{taco.protein.name} (${taco.protein.price.toFixed(2)}) <br />
						<strong>
							<i className="fa-solid fa-pepper-hot"
								style={{
									color: "red"
								}}>
							</i> Salsas:
						</strong>{" "}
						{taco.sauces && taco.sauces.length > 0
							? taco.sauces.map((sauce) => sauce.name).join(", ")
							: "Ninguna"} <br />
						<strong>
							<i className="fa-solid fa-bread-slice"
								style={{
									color: "#e3c19f"
								}}
							></i> Tortilla:
						</strong>{" "}
						{taco.tortilla}
					</p>
					<button className="btn btn-success">
						Ver detalles
					</button>
				</div>
			</div>
		</div>
	);
};

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()

	const loadTacos = async () => {
		try {

			const backendUrl = import.meta.env.VITE_BACKEND_URL
			const response = await fetch(backendUrl + "api/taco")
			const data = await response.json()
			if (response.ok) dispatch({ type: "set_tacos", payload: data })
			return data
		} catch (error) {
			if (error.message) throw new Error(
				`Could not fetch the 🌮 from the backend.
				Please check if the backend is running and the backend port is public. 🤠`
			);
		}
	}

	useEffect(() => {
		loadTacos()
	}, [])

	return (
		<div className="text-center mt-5 mx-4">
			<Hero />
			<div className="d-flex flex-wrap">
				{
					store.tacos && store.tacos.length > 0 && (
						store.tacos.map(taco => <TacoCard key={taco.id} taco={taco} />)
					)
				}
			</div>

		</div>
	);
}; 