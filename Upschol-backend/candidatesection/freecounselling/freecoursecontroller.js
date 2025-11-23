const freecounselling = require("./FreecounsellingModel");
const stateandcities = require("./stateandcity");

exports.getAllstate = async () => {
  try {
    const state = await stateandcities.find().select('state _id');
    return state;
  } catch (error) {
    console.error("Error fetching state", error);
    throw new Error("Failed to fetch state");
  }
};


exports.getAllcity = async (id) => {
  try {
    const city = await stateandcities.find({_id:id}).select('districts _id');
    return city;
  } catch (error) {
    console.error("Error fetching state", error);
    throw new Error("Failed to fetch state");
  }
};


exports.freecounsellingadd = async (body) => {
  try {
    const freecounsellings = new freecounselling({
      name: body.name,
      email: body.email,
      phoneNumber: body.phoneNumber,
      city: body.city,
      state: body.state
    });      
    const result = await freecounsellings.save();
    return { message: 'Councelling Submit successfully', result };
  } catch (error) {
    console.error("Error fetching state", error);
    throw new Error("Failed to fetch state");
  }
};