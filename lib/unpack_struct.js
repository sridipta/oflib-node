/*
 * Author: Zoltán Lajos Kis <zoltan.lajos.kis@ericsson.com>
 */

"use strict";

var util = require('util');
var ofp = require('./ofp.js');
var packet = require('./packet.js');
var ofputil = require('./util.js');

var unpackAction      = require('./unpack_action.js');
var unpackInstruction = require('./unpack_instruction.js');

/*
 * Returns:
 * {"<struct>" : <JSON>, "offset" : <offset after instruction> }
 * Error:
 * {"error" : "<error text>" [, "ofp_error_type" : <ofp error type>, "ofp_error_code" : <ofp error code>]}
 */
module.exports = {
        "bucket" : function bucket_unpack(buffer, offset) {
                struct = {};

                if (buffer.length < offset + ofp.sizes.ofp_bucket) {
                    return {
                        "error" : util.format('Received bucket is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                var len  = buffer.readUInt16BE(offset, true);

                if (buffer.length < offset + len) {
                    return {
                        "error" : util.format('Received bucket is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                /* TODO: Implement */
                offset += len;

                return {"struct" : struct, "offset" : offset};
            },

        "flowStats" : function flowStats_unpack(buffer, offset) {
                struct = {};

                if (buffer.length < offset + ofp.sizes.ofp_flow_stats) {
                    return {
                        "error" : util.format('Received flow_stats is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                var len  = buffer.readUInt16BE(offset, true);

                if (buffer.length < offset + len) {
                    return {
                        "error" : util.format('Received flow_stats is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                /* TODO: Implement */
                offset += len;

                return {"struct" : struct, "offset" : offset};
            },

        "groupStats" : function groupStats_unpack(buffer, offset) {
                struct = {};

                if (buffer.length < offset + ofp.sizes.ofp_group_stats) {
                    return {
                        "error" : util.format('Received group_stats is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                var len  = buffer.readUInt16BE(offset, true);

                if (buffer.length < offset + len) {
                    return {
                        "error" : util.format('Received group_stats is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                /* TODO: Implement */
                offset += len;

                return {"struct" : struct, "offset" : offset};
            },

        "queueProp" : function queueProp_unpack(buffer, offset) {
                struct = {};

                if (buffer.length < offset + ofp.sizes.ofp_queue_prop_header) {
                    return {
                        "error" : util.format('Received queue_prop is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                var len  = buffer.readUInt16BE(offset, true);

                if (buffer.length < offset + len) {
                    return {
                        "error" : util.format('Received queue_prop is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                /* TODO: Implement */
                offset += len;

                return {"struct" : struct, "offset" : offset};
            },

        "packetQueue" : function packetQueue_unpack(buffer, offset) {
                struct = {};

                if (buffer.length < offset + ofp.sizes.ofp_packet_queue) {
                    return {
                        "error" : util.format('Received packet_queue is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                struct.queue_id = buffer.readUInt32BE(offset, true);
                var len  = buffer.readUInt16BE(offset + 4, true);

                if (buffer.length < offset + len) {
                    return {
                        "error" : util.format('Received packet_queue is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                /* TODO: Implement */
                offset += len;

                return {"struct" : struct, "offset" : offset};
            },

        "port" : function port_unpack(buffer, offset) {
                var port = {};

                if (buffer.length < offset + ofp.sizes.ofp_port) {
                    return {
                        "error" : util.format('Received port is too short (%d).', (buffer.length - offset))
                    }
                }

                port.port_no = buffer.readUInt32BE(offset, true);
                offset += 8; /* + pad */

                if (port.port_no > ofp.ofp_port_no.OFPP_MAX && port.port_no != ofp.ofp_port_no.OFPP_LOCAL) {
                    return {
                        "error" : util.format('Received port has invalid port_no (%d).', port.port_no)
                    }
                }

                if (port.port_no == ofp.ofp_port_no.OFPP_LOCAL) {
                    port.port_no = 'OFPP_LOCAL';
                }

                port.hw_addr = packet.ethToString(buffer, offset);
                offset += ofp.OFP_ETH_ALEN + 2; /* + pad */

                port.name = buffer.toString('utf8', offset, offset + ofp.OFP_MAX_PORT_NAME_LEN);
                port.name = port.name.substr(0, port.name.indexOf('\0'));
                offset += ofp.OFP_MAX_PORT_NAME_LEN;

                var config = buffer.readUInt32BE(offset, true);
                var configParsed = ofputil.parseFlags(config, ofp.ofp_port_config);
                if (configParsed.remain != 0) {
                    return {
                        "error" : util.format('Received port has invalid config (%d).', config)
                    }
                }
                port.config = configParsed.array;
                offset += 4;

                var state = buffer.readUInt32BE(offset, true);
                var stateParsed = ofputil.parseFlags(state, ofp.ofp_port_state);
                if (stateParsed.remain != 0) {
                    return {
                        "error" : util.format('Received port has invalid state (%d).', state)
                    }
                }
                port.state = stateParsed.array;
                offset += 4;

                var curr = buffer.readUInt32BE(offset, true);
                if (curr != 0) {
                    var currParsed = ofputil.parseFlags(curr, ofp.ofp_port_features);
                    if (currParsed.remain != 0) {
                        return {
                            "error" : util.format('Received port has invalid curr (%d).', curr)
                        }
                    }
                    port.curr = currParsed.array;
                }
                offset += 4;

                var advertised = buffer.readUInt32BE(offset, true);
                if (advertised != 0) {
                    var advertisedParsed = ofputil.parseFlags(advertised, ofp.ofp_port_features);
                    if (advertisedParsed.remain != 0) {
                        return {
                            "error" : util.format('Received port has invalid advertised (%d).', advertised)
                        }
                    }
                    port.advertised = advertisedParsed.array;
                }
                offset += 4;

                var supported = buffer.readUInt32BE(offset, true);
                if (supported != 0) {
                    var supportedParsed = ofputil.parseFlags(supported, ofp.ofp_port_features);
                    if (supportedParsed.remain != 0) {
                        return {
                            "error" : util.format('Received port has invalid supported (%d).', supported)
                        }
                    }
                    port.supported = supportedParsed.array;
                }
                offset += 4;

                var peer = buffer.readUInt32BE(offset, true);
                if (peer != 0) {
                    var peerParsed = ofputil.parseFlags(peer, ofp.ofp_port_features);
                    if (peerParsed.remain != 0) {
                        return {
                            "error" : util.format('Received port has invalid peer (%d).', peer)
                        }
                    }
                    port.peer = peerParsed.array;
                }
                offset += 4;

                port.curr_speed = buffer.readUInt32BE(offset, true);
                port.max_speed = buffer.readUInt32BE(offset + 4, true);
                offset += 8;

                return {"port" : port, "offset" : offset};
            },

        "tableStats" : function tableStats_unpack(buffer, offset) {
                struct = {};

                if (buffer.length < offset + ofp.sizes.ofp_table_stats) {
                    return {
                        "error" : util.format('Received table_stats is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                /* TODO: Implement */
                offset += ofp.sizes.ofp_table_stats;

                return {"struct" : struct, "offset" : offset};
            },

        "portStats" : function portStats_unpack(buffer, offset) {
                struct = {};

                if (buffer.length < offset + ofp.sizes.ofp_port_stats) {
                    return {
                        "error" : util.format('Received port_stats is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                /* TODO: Implement */
                offset += ofp.sizes.ofp_port_stats;

                return {"struct" : struct, "offset" : offset};
            },

        "queueStats" : function queueStats_unpack(buffer, offset) {
                struct = {};

                if (buffer.length < offset + ofp.sizes.ofp_queue_stats) {
                    return {
                        "error" : util.format('Received queue_stats is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                /* TODO: Implement */
                offset += ofp.sizes.ofp_queue_stats;

                return {"struct" : struct, "offset" : offset};
            },

        "groupDescStats" : function groupDescStats(buffer, offset) {
                struct = {};

                if (buffer.length < offset + ofp.sizes.ofp_group_desc_stats) {
                    return {
                        "error" : util.format('Received group_desc_stats is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                var len  = buffer.readUInt16BE(offset, true);

                if (buffer.length < offset + len) {
                    return {
                        "error" : util.format('Received group_desc_stats is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                /* TODO: Implement */
                offset += len;

                return {"struct" : struct, "offset" : offset};
            },

        "bucketCounter" : function bucketCounter(buffer, offset) {
                var bucketCounter = {};

                if (buffer.length < offset + ofp.sizes.ofp_bucket_counter) {
                    return {
                        "error" : util.format('Received bucket_counter is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                bucketCounter.packet_count = {};
                bucketCounter.packet_count.high = buffer.readUInt32BE(offset, true);
                bucketCounter.packet_count.low = buffer.readUInt32BE(offset + 4, true);
                offset += 8;

                bucketCounter.byte_count = {};
                bucketCounter.byte_count.high = buffer.readUInt32BE(offset, true);
                bucketCounter.byte_count.low = buffer.readUInt32BE(offset + 4, true);
                offset += 8;

                return {"bucket_counter" : bucketCounter, "offset" : offset};
            },

        "match" : function match_unpack(buffer, offset) {
                var match = {};

                if (buffer.length < offset + ofp.sizes.match) {
                    return {
                        "error" : util.format('Received match is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_REQUEST',
                        "ofp_error_code" : 'OFPBRC_BAD_LEN'
                    }
                }

                var type = buffer.readUInt16BE(offset, true);
                var len  = buffer.readUInt16BE(offset + 2, true);

                if (buffer.length < offset + len) {
                    return {
                        "error" : util.format('Received packet_queue is too short (%d).', (buffer.length - offset)),
                        "ofp_error_type" : 'OFPET_BAD_MATCH',
                        "ofp_error_code" : 'OFPBMC_BAD_LEN'
                    }
                }
                offset += 4;

                switch (type) {
                    /* TODO: Implement experimenter callbacks */
                    case ofp.ofp_match_type.OFPMT_STANDARD: {
                        // TODO: some validation missing?
                        match.type = 'OFMPT_STANDARD';

                        if (len != ofp.sizes.ofp_match_standard) {
                            return {
                                "error" : util.format('Received packet_queue is too short (%d).', (buffer.length - offset)),
                                "ofp_error_type" : 'OFPET_BAD_MATCH',
                                "ofp_error_code" : 'OFPBMC_BAD_LEN'
                            }
                        }

                        var wildcards = buffer.readUInt32BE(offset + 4, true); // skipping in_port
                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_IN_PORT) == 0) {
                            match.in_port = buffer.readUInt32BE(offset, true);
                        }
                        offset += 8; // including wildcards

                        match.dl_src = packet.ethToString(buffer, offset);
                        offset += 6;
                        match.dl_src_mask = packet.ethToString(buffer, offset);
                        offset += 6;
                        match.dl_dst = packet.ethToString(buffer, offset);
                        offset += 6;
                        match.dl_dst_mask = packet.ethToString(buffer, offset);
                        offset += 6;

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_DL_VLAN) == 0) {
                            match.dl_vlan = buffer.readUInt16BE(offset, true);
                        }
                        offset += 2;

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_DL_VLAN_PCP) == 0) {
                            match.dl_vlan_pcp = buffer.readUInt8(offset, true);
                        }
                        offset += 2; /* + pad */

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_DL_TYPE) == 0) {
                            match.dl_type = buffer.readUInt16BE(offset, true);
                        }
                        offset += 2;

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_NW_TOS) == 0) {
                            match.nw_tos = buffer.readUInt8(offset, true);
                        }
                        offset += 1;

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_NW_PROTO) == 0) {
                            match.nw_proto = buffer.readUInt8(offset, true);
                        }
                        offset += 1;

                        match.nw_src = packet.ipv4ToString(buffer, offset);
                        offset += 4;
                        match.nw_src_mask = packet.ipv4ToString(buffer, offset);
                        offset += 4;
                        match.nw_dst = packet.ipv4ToString(buffer, offset);
                        offset += 4;
                        match.nw_dst_mask = packet.ipv4ToString(buffer, offset);
                        offset += 4;

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_TP_SRC) == 0) {
                            match.tp_src = buffer.readUInt16BE(offset, true);
                        }
                        offset += 2;

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_TP_DST) == 0) {
                            match.tp_dst = buffer.readUInt16BE(offset, true);
                        }
                        offset += 2;

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_MPLS_LABEL) == 0) {
                            match.mpls_label = buffer.readUInt32BE(offset, true);
                        }
                        offset += 4;

                        if ((wildcards & ofp.ofp_flow_wildcards.OFPFW_MPLS_TC) == 0) {
                            match.mpls_tc = buffer.readUInt8(offset, true);
                        }
                        offset += 4; /* + pad */

                        match.metadata = buffer.toString('hex', offset, offset + 8);
                        match.metadata_mask = buffer.toString('hex', offset + 8, offset + 16);
                        offset += 16;

                        return {"match" : match, "offset" : offset};
                    }

                    default: {
                        return {
                            "error" : util.format('Received packet_queue is too short (%d).', (buffer.length - offset)),
                            "ofp_error_type" : 'OFPET_BAD_MATCH',
                            "ofp_error_code" : 'OFPBMC_BAD_TYPE'
                        }
                    }
                }
        }
}