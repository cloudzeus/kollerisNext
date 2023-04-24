export const addUserToLocalStorage = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
}


export const removerFromLocalStorage = () => {
  localStorage.removeItem('user');
}

export const getUserFromLocalStorage = () => {
    const result = localStorage.getItem('user');
    const user = result ? JSON.parse(result) : null;
    return user
}