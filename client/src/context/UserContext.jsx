import React, { createContext, useState } from 'react'

export const UserDataContext = createContext();

const UserContext = ({children}) => {

    const [user, setUser] = useState({
        email:'',
        username:'',
        preferredLanguage:'',       
    });

  return (
    <div>
      <UserDataContext.Provider value={{user, setUser}}>
        {children}
      </UserDataContext.Provider>
    </div>
  )
}

export default UserContext