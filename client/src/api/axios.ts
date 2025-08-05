import axios from 'axios'

export default axios.create({
	baseURL: 'https://react-express-sql-project.vercel.app/',
	withCredentials: true
})