import mongoose from 'mongoose';

export interface IPermission extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    name: string;
}

const PermissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
});

export const Permission = mongoose.model<IPermission>(
    'Permission',
    PermissionSchema
);
