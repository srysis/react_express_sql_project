import half_circle from "../assets/half-circle.png"

import "../style/loader.css"

function LoadingSpinnerBlock() {
	return(
		<section id="loading">
			<div className="loading_spinner"><img src={half_circle}/></div>
		</section>
	)
}

export default LoadingSpinnerBlock;