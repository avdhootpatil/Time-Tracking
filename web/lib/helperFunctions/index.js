export const getUserFromLocalStorage = () => {
  let user = localStorage.getItem("user");

  if (user) {
    let retrievedUser = JSON.parse(user);

    return retrievedUser;
  }
};
