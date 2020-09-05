import * as mongoose from 'mongoose';
// standard id, avoid db discovering
import { v4 } from 'uuid';

const { Schema } = mongoose;

// avoid db discovering
function omitPrivate(doc, obj) {
    delete obj.__v;
    delete obj._id;
    return obj;
}

// schema options
const options = {
    toJSON: {
        transform: omitPrivate
    }
};

const SecureDataSchema = new Schema(
    {
        id: { type: mongoose.Schema.Types.String, unique: true, default: v4 },
        encryption_key: { type: mongoose.Schema.Types.String,  },
        value: { },
    },
    options,
);

const SecureData = mongoose.model('SecureData', SecureDataSchema);

export { SecureData, SecureDataSchema };
