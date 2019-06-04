import axios from "axios";

async function getUser() {
    try {
      const response = await axios.get('/user?ID=12345');
      console.log(response);
    } catch (error) {
      console.error(error);
    }
}

export const createUser = async (values, dispatch) => {
  try {
    const response = await axios.post('/register', values);
    console.log(response);
  } catch (error) {
    console.error(error);
    
  } 
}