import mongoose from 'mongoose';

export interface IRole extends mongoose.Document {
    name: string;
    permissions: mongoose.Types.ObjectId[];
}

const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    permissions: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Permission',
        },
    ],
});

export const Role = mongoose.model<IRole>('Role', RoleSchema);
