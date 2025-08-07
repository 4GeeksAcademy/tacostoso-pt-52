export const Footer = () => (
	<footer className="footer mt-auto py-3 text-center bg-success text-white" style={{ letterSpacing: "0.5px" }}>
		<div className="container">
			<span className="fw-bold" style={{ fontFamily: "'Playfair Display', serif", fontWeight: "700" }}>
				🌮 Tacontodo &mdash; El sabor que conquista
			</span>
			<br />
			<small className="d-block mt-2">
				&copy; {new Date().getFullYear()} Tacostoso. Todos los derechos reservados.
			</small>
		</div>
	</footer>
);
