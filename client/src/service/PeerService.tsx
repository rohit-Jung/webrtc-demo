class PeerService {
	public peer: RTCPeerConnection | null = null;

	constructor() {
		if (!this.peer) {
			this.peer = new RTCPeerConnection({
				iceServers: [
					{
						urls: "stun:stun.l.google.com:19302",
					},
				],
			});
		}
	}

	async createOffer(): Promise<RTCSessionDescriptionInit> {
		if (!this.peer) {
			throw new Error("Peer connection not initialized");
		}

		const offer = await this.peer.createOffer();
		await this.peer.setLocalDescription(offer);
		return offer;
	}

	async createAnswer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
		if (!this.peer) {
			throw new Error("Peer connection not initialized");
		}
		await this.peer.setRemoteDescription(offer);
		const answer = await this.peer.createAnswer();
		await this.peer.setLocalDescription(answer);
		return answer;
	}

	async setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void> {
		if (!this.peer) {
			throw new Error("Peer connection not initialized");
		}
		await this.peer.setRemoteDescription(description);
	}
}

export default new PeerService();
