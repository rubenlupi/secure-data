import * as mongoose from 'mongoose';

const { Schema } = mongoose;

const ShipmentsSchema = new Schema({
    entity_id: { type: Schema.Types.String },
    shipment_id: { type: Schema.Types.String },
}, { _id: false });

const BiproShipmentSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.String, ref: 'User' },
        id: { type: mongoose.Schema.Types.String, unique: true },
        category: { type: mongoose.Schema.Types.String, enum: ['170011000'] },
        shipment_items: [ShipmentsSchema],
        acknowledged_at: { type: mongoose.Schema.Types.Date },
        created_date: { type: mongoose.Schema.Types.Date },
    },
);

const BiproShipment = mongoose.model('BiproShipment', BiproShipmentSchema);

export { BiproShipment, BiproShipmentSchema };
