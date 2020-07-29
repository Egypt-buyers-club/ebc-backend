import { Schema, model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const tokenSchema = new Schema({
	_userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "User"
	},
	token: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

tokenSchema.plugin(uniqueValidator);

export const TokenModel = model("Token", tokenSchema);
