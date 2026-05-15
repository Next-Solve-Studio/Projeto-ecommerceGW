import Cart from "../buttons/Cart";
import Suport from "../buttons/Suport";
import Register from "../buttons/Register";

export default function Buttons() {
    return (
        <div className="flex gap-3">
            <Cart />
            <Suport />
            <Register />
        </div>
    );
}
