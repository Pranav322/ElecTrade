//1. import the required packages and modules
//======================================
import axios from 'axios';

//2. set the url for the entire application
//======================================
const BASE_URL = 'https://9e10-2409-40d1-100a-b1e0-f523-3006-5737-9629.ngrok-free.app';

export default axios.create({
  baseURL: BASE_URL,
});
