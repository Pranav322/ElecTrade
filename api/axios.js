//1. import the required packages and modules
//======================================
import axios from 'axios';

//2. set the url for the entire application
//======================================
const BASE_URL = 'https://7878-2409-40d1-100d-3123-85bd-adf1-24ed-5627.ngrok-free.app';

export default axios.create({
  baseURL: BASE_URL,
});
