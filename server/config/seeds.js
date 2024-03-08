const db = require("./connection");
const cleanDB = require("./cleanDB");
const { Property, Complaint, User } = require("../models");
db.once("open", async () => {
  await cleanDB("Property", "properties");
  await cleanDB("Complaint", "complaints");
  await cleanDB("User", "users");

  //seed user
  const users = await User.create([
    {
      username: "agent",
      email: "agent@testmail.com",
      password: "12345678",
      role: "agent",
    },
    {
      username: "Kim",
      email: "kim@testmail.com",
      password: "12345678",
      role: "agent",
    },
    {
      username: "tenant",
      email: "tenant@testmail.com",
      password: "12345678",
      role: "tenant",
    },
    {
      username: "Maya",
      email: "maya@testmail.com",
      password: "12345678",
      role: "tenant",
    },
    {
      username: "kayla",
      email: "kayla@testmail.com",
      password: "12345678",
      role: "tenant",
    },
    {
      username: "owner",
      email: "owner@testmail.com",
      password: "12345678",
      role: "owner",
    },
    {
      username: "Neda",
      email: "neda@testmail.com",
      password: "12345678",
      role: "owner",
    },
    {
      username: "admin",
      email: "admin@testmail.com",
      password: "12345678",
      role: "admin",
    },
  ]);

  console.log("users seeded");

  const properties = await Property.insertMany([
    {
      address: "Unit 1, 88 Abc Street, Sydney",
      owner: users[5]._id,
      agent: users[0]._id,
      tenant: users[2]._id,
    },
    {
      address: "Unit 2, 88 Abc Street, Sydney",
      owner: users[6]._id,
      agent: users[1]._id,
      tenant: users[3]._id,
    },
    {
      address: "Unit 3, 88 Abc Street, Sydney",
      owner: users[6]._id,
      agent: users[0]._id,
      tenant: users[4]._id,
    },
  ]);
  console.log("Properties seeded");
  const complaints = await Complaint.insertMany([
    {
      complaint: "Leakage in kitchen sink ",
      property: properties[0],
    },
    {
      complaint: "Dishwasher is not working ",
      property: properties[1],
    },
    {
      complaint: "Oven is not working ",
      property: properties[2],
    },
  ]);
  console.log("Complaints seeded");
  process.exit;
});
