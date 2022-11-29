const userSchema = {
    name: "user",
    properties: {
      __v:  "int",
      _id:"objectId",
      createdAt: "date",
      device_token:"string",
      device_type:"string",
      email:"string",
      ever_logged_in:"bool",
      firstname:"string",
      isLoggedin:"bool",
      lastname:"string",
      login_type:"string",
      password:  "string",
      phone:  "string",
      relationship:"string",
      roles:"array",,
      social_id:  "string",
      status: "string",
      wearerId: "array",
    }
  }

export default userSchema;
