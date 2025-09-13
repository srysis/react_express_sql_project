import half_circle from "../assets/half-circle.png"

import "../style/loader.css"

function LoadingSpinnerInline() {
	return(
		<span className="loading_spinner"><img src={half_circle}/></span>
	)
}

export default LoadingSpinnerInline;