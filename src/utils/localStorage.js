export const addUserToLocalStorage = (user) => {
    console.log('local storage')
    localStorage.setItem('user', JSON.stringify(user));
  
}

export const getUserFromLocalStorage = () => {
  
  if (typeof window !== 'undefined') {
    let item = localStorage.getItem('user');
    if(item) {
      const user = JSON.parse(item)
      return user;
    } else {
      const user = null;
      return user;
    }
    
  }
 
}
 export const removerFromLocalStorage = () => {
    localStorage.removeItem('user');
}

