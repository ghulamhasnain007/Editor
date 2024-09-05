import mongoose, { Document, Model, Schema } from 'mongoose';

interface IContent extends Document {
  content: string;
  createdAt: Date;
}

const ContentSchema: Schema<IContent> = new Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Content: Model<IContent> = mongoose.models.Content || mongoose.model('Content', ContentSchema);

export default Content;
