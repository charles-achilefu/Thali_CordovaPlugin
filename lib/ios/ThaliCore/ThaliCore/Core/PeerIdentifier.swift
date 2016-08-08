//
//  Thali CordovaPlugin
//  PeerIdentifier.swift
//
//  Copyright (C) Microsoft. All rights reserved.
//  Licensed under the MIT license. See LICENSE.txt file in the project root for full license information.
//

import Foundation
import MultipeerConnectivity

enum PeerIdentifierError: String, ErrorType {
    case WrongDataFormat
}

///Peer identifier for with generations
struct PeerIdentifier {
    ///UUID identifier of peer
    let uuid: String
    ///generation of peer.
    let generation: Int

    init() {
        uuid = NSUUID().UUIDString
        generation = 0
    }

    private init(uuidIdentifier: String, generation: Int) {
        self.uuid = uuidIdentifier
        self.generation = generation
    }

    init(stringValue: String) throws {
        let parts = stringValue.characters.split {
             $0 == ":"
             }.map(String.init)
        guard parts.count == 2 else {
            throw PeerIdentifierError.WrongDataFormat
        }
        guard let generation = Int(parts[1], radix: 16) else {
            throw PeerIdentifierError.WrongDataFormat
        }
        self.uuid = parts[0]
        self.generation = generation
    }

    func nextGenerationPeer() -> PeerIdentifier {
        return PeerIdentifier(uuidIdentifier: uuid, generation: generation + 1)
    }

    var stringValue: String {
        return "\(uuid):\(String(generation, radix: 16))"
    }
}

extension PeerIdentifier {
    var mcPeer: MCPeerID {
        return MCPeerID(displayName: uuid)
    }
}
