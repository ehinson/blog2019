import axios from 'axios';

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
    const { data } = await axios.post('/api/register', values);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
