import { BrowserRouter, Route, Routes } from "react-router";
import Homepage from "./pages/Homepage";
import { SocketProvider } from "./providers/Socket";
import Roompage from "./pages/Roompage";

function App() {
	return (
		<SocketProvider>
			<BrowserRouter>
				<Routes>
					<Route
						path="/"
						Component={Homepage}
					/>
					<Route
						path="/room/:roomId"
						Component={Roompage}
					/>
				</Routes>
			</BrowserRouter>
		</SocketProvider>
	);
}

export default App;
