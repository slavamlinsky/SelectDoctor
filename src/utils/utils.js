export const getAge = (birthDate) => {
  let today = new Date();

  if (birthDate) {
    let age = today.getFullYear() - birthDate.getFullYear();
    let agemonth = today.getMonth() - birthDate.getMonth();
    if (
      agemonth < 0 ||
      (agemonth === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  } else {
    return null;
  }
};
