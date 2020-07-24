import { Schema, model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
		minlength: 6
	},
	email: {
		type: String,
		required: true,
		unique: true,
		minlength: 6
	},
	activated: {
		type: Boolean,
		default: false
	},
	phone: {
		type: String,
		required: true,
		minlength: 6
	},
	password: {
		type: String,
		required: true,
		minlength: 6
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

userSchema.plugin(uniqueValidator);

export const UserModel = model("User", userSchema);
