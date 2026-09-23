import React, { useState , useEffect} from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import axios from 'axios'

const UserProtectedWrapper = ({
    children
}) => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserDataContext);
    const [ isLoading, setIsLoading ] = useState(true);


    useEffect(() => {
        if (!token) {
            navigate('/');
            return;
        }

        const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
        axios.get(`${baseUrl}/users/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 200) {
                if(!response.data.user){
                    localStorage.removeItem('token');
                    navigate('/');
                    return;
                }
                setUser(response.data.user);
                setIsLoading(false);
            }
        })
            .catch(err => {
                console.log(err);
                localStorage.removeItem('token');
                navigate('/');
            });
    }, [ token, navigate, setUser ]);


    if (isLoading) {
        return (
            <div>Loading...</div>
        )
    }


  return (

    <div>


        {children}

        
              
    </div>
  )
}

export default UserProtectedWrapper