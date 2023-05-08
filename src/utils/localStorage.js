export const addUserToLocalStorage = (user) => {
  // console.log('local storage')
  localStorage.setItem('user', JSON.stringify(user));

}

export const getUserFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    if(localStorage.getItem('user') !== 'undefined') {
      console.log(localStorage.getItem('user'))
      let user = JSON.parse(localStorage.getItem('user') || null)
      return user;
    }
   
  }


}

export const removerFromLocalStorage = () => {
  localStorage.removeItem('user');
}

