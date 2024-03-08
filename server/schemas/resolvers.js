const { User, Complaint, Property } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");
const { S3, PutObjectCommand } = require("@aws-sdk/client-s3");
const s3Bucket = process.env.S3_BUCKET;
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const resolvers = {
  Query: {
    //returns all the users
    users: async () => {
      try {
        return User.find();
      } catch (error) {
        console.log("Could not find users", error);
      }
    },
    //returns the property details based on role and user id
    propertiesByUser: async (parent, { role }, context) => {
      try {
        if (role === "agent")
          return await Property.find({ agent: context.user._id })
            .sort({ _id: -1 })
            .populate("owner")
            .populate("agent")
            .populate("tenant");
        else if (role === "owner")
          return await Property.find({ owner: context.user._id })
            .sort({ _id: -1 })
            .populate("owner")
            .populate("agent")
            .populate("tenant");
        else
          return await Property.find()
            .sort({ _id: -1 })
            .populate("owner")
            .populate("agent")
            .populate("tenant");
      } catch (error) {
        console.log("Could not find properties", error);
      }
    },
    //returns the complaints related to logged in user.
    //If the logged in user is tenant then returns all the complaints raised by that tenant.
    //If the logged in user is agent then returns all the complaints related to properties that they manage.
    //If the logged in user is owner then returns all the complaints related to properties that they own.
    complaintsRaised: async (parent, args, context) => {
      try {
        const params = {};
        const propertyIds = [];
        let properties = [];
        switch (context.user.role) {
          case "owner":
            properties = await Property.find({
              owner: context.user._id,
            });
            break;
          case "agent":
            properties = await Property.find({ agent: context.user._id });
            break;
          case "tenant":
            properties = await Property.find({ tenant: context.user._id });
            break;
          default:
            break;
        }
        properties.map((x) => propertyIds.push(x._id));

        const complaints = await Complaint.find({
          property: { $in: propertyIds },
        })
          .sort({ _id: -1 })
          .populate("property");
        return complaints;
      } catch (error) {
        console.log("Could not find complaints", error);
      }
    },
  },
  Mutation: {
    //adds propert details
    addProperty: async (parent, { propertyDetails }) => {
      try {
        return Property.create(propertyDetails);
      } catch (error) {
        console.log("Could not add property!", error);
      }
    },

    //update property details
    updateProperty: async (parent, { propertyDetails, propertyId }) => {
      try {
        return await Property.findByIdAndUpdate(propertyId, propertyDetails, {
          new: true,
        });
      } catch (error) {
        console.log("Could not update property", error);
      }
    },

    //add complaint and image url if any
    addComplaint: async (parent, { complaint, picUrl }, context) => {
      try {
        const properties = await Property.find({ tenant: context.user._id });
        const propertyId = properties[0]._id;
        return Complaint.create({ complaint, picUrl, property: propertyId });
      } catch (error) {
        console.log("Could not raise complaint", error);
      }
    },

    //updates complaint
    updateComplaint: async (
      parent,
      { complaint, quotes, status, complaintId, picUrl }
    ) => {
      try {
        if (complaint)
          return await Complaint.findByIdAndUpdate(
            complaintId,
            { complaint, picUrl },
            { new: true }
          );
        else
          return await Complaint.findByIdAndUpdate(
            complaintId,
            { $set: { quotes: quotes, status: status } },
            { new: true }
          );
      } catch (error) {
        console.log("Could not update complaint", error);
      }
    },

    //update the complaint collection with approved quote
    addApprovedQuote: async (parent, { approvedQuote, complaintId }) => {
      try {
        return await Complaint.findByIdAndUpdate(
          complaintId,
          { approvedQuote },
          { new: true }
        );
      } catch (error) {
        console.log("Could not update approved quote", error);
      }
    },
    //add  new user
    addUser: async (parent, args) => {
      try {
        const user = await User.create(args);
        const token = signToken(user);
        return { token, user };
      } catch (error) {
        console.log("SignUp failed", error);
      }
    },

    //login
    login: async (parent, { email, password, complaintId }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw AuthenticationError;
        }
        const correctPassword = await user.isCorrectPassword(password);
        if (!correctPassword) {
          throw AuthenticationError;
        }
        const token = signToken(user);
        return { token, user };
      } catch (error) {
        console.log("Login failed", error);
      }
    },

    //gets signed url from s3 and returns the same with object url
    s3Sign: async (parent, { filename, filetype }) => {
      const s3 = new S3({
        region: "ap-southeast-2",
        credentials: {
          accessKeyId: process.env.ACCESS_KEY,
          secretAccessKey: process.env.SECRET_KEY,
        },
      });
      //parameters for s3 upload
      const s3Params = {
        Bucket: s3Bucket,
        Key: filename,
        ContentType: filetype,
        ACL: "public-read",
      };
      const expiresIn = 3600;

      const signedRequest = await getSignedUrl(
        s3,
        new PutObjectCommand(s3Params),
        { expiresIn }
      );
      const url = `https://${s3Bucket}.s3.amazonaws.com/${filename}`;

      return {
        signedRequest,
        url,
      };
    },
  },
};
module.exports = resolvers;
