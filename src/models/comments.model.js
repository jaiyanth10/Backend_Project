// While writing models first design them in website like draw.io or browse for other wesite for data modelling.
// Data model for this project :https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj
// If you are in confusion about, for which field you need to put reqired, think like this, 
//for most of  fields you are taking for user, u need required
// If you are confused, refer User and video models, they have explanations in commnents
import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)


commentSchema.plugin(mongooseAggregatePaginate)

export const Comment = mongoose.model("Comment", commentSchema)