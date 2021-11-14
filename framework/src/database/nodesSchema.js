const mongoose = require('mongoose');

const dataSchema = mongoose.Schema({
    account: String,
    label: String,
    reserved: { type: Boolean, default: false },
    history: [{
        day: String,
        subs: [Object],
    }],
    updated: Boolean,
    new_subs: [Object],
},
{ collection: 'nodes' }
);

const Nodes = mongoose.model('nodes', dataSchema);

module.exports = Nodes;

// export async function byAlias(alias) {
//     return Nodes.findOne({ alias });
// }
