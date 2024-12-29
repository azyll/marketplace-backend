export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    //data from services from db?
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch user",
      error: err.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    //data from services from db?
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: err.message,
    });
  }
};

export const addUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, program } = req.body;

    //data to services to db?

    res.status(201).json({
      message: "User created successfully",
      // data: {
      //   createUser: firstName,
      //   lastName: lastName,
      //   email: email,
      //   password: password,
      //   role: role,
      //   program: program,
      // },
    });
  } catch (err) {
    res.status(500).json({
      message: "User creation unsuccessful",
      error: err.message,
    });
  }
};

export const editUser = async (req, res) => {
  try {
  } catch (err) {}
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    //data to services to db
  } catch (err) {
    res.status(500).json({
      message: "User cannot be deleted",
      error: err.message,
    });
  }
};
