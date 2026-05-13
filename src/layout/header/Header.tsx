import Logo from "./sections/Logo"
import SearchBar from "./sections/SearchBar"
import Buttons from "./sections/Buttons"
import Department from "./sections/Department"
import Navigation from "./sections/Navigation"

export default function Header() {
    return (
        <header className="w-full fixed h-20 bg-black">
            <section className="">
                <div className="">
                    <Logo />
                    <SearchBar />
                    <Buttons />
                </div>
                <div className="">
                    <Department />
                    <Navigation />
                </div>
            </section>
        </header>
    )
}
