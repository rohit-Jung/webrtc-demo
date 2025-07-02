## WebRTC

- WebRTC works on UDP(User Datagram Protocol) protocol
- uses DTLS (Datagram TLS) for secure key exchange.
- data packets aren't 100% sure to deliver, hence used in video calling

### STUN and ICE

- IP of device isn't directly exposed to the internet, done through router: port forwarding
- STUN (Session Traversal Utilities for NAT) and ICE (Interactive Connectivity Establishment) are used to discover the best path between peers.
- STUN helps discover the public IP and port mappings through NAT.

### Signaling

- a way to exchange information between peers, SDP (Session Description Protocol)
- Socket can be used
- can be used for negotiating SDP and ICE candidates between peers before the actual WebRTC connection

## DRAWBACK

- P2P connection
- Mesh topology is formed if all peers are connected to each other

## SFU (Selective Forwarding Unit) Topology (Recommended)

- A virtual machine / server is created
- the server than compose the video stream / audio stream of all the users and send it to the client

- WebRTC is natively supported in all modern browsers

### Symmetric NAT

- NAT (Network Address Translation) is used by routers to allow multiple devices on a local network to share a single public IP address
- Symmetric NAT creates a unique public IP:port mapping for each destination, which makes peer-to-peer negotiation difficult. STUN servers are used to discover public IP:port mappings, but they don't work reliably with symmetric NAT. In such cases, TURN servers are required to relay media between peers.
