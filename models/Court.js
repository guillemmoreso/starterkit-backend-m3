const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const courtSchema = new Schema(
  {
    clubCourt: [{ type: ObjectId, ref: 'Club' }],
    courtName: { type: String },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

const Court = mongoose.model('Court', courtSchema);

module.exports = Court;
