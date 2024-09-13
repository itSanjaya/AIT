import mongoose from 'mongoose';
import mongooseSlugPlugin from 'mongoose-slug-plugin';

// TODO: add schemas
const { Schema } = mongoose;

const UserSchema = new Schema({username: String, 
    email: String, 
    password: {type: String, unique: true, required: true}});

const ArticleSchema = new Schema({
    user_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    title: String, url: String,
    description: String
});

// TODO: configure plugin
ArticleSchema.plugin(mongooseSlugPlugin, {tmpl: '<%=title%>'});

// TODO: register models
mongoose.model('User', UserSchema);
mongoose.model('Article', ArticleSchema);

mongoose.connect('mongodb://127.0.0.1/hw05');    // https://www.mongodb.com/community/forums/t/mongooseserverselectionerror-connect-econnrefused-127-0-0-1-27017/123421/3