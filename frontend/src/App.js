import {BrowserRouter as Router} from "react-router-dom";

import Footer from "./Footer";
import Content from "./Content";
import Header from "./Header";

export default function App() {
    return (
        <Router>
            <div>
                <Header />
                <Content />
                <Footer />
            </div>
        </Router>
    );
}
