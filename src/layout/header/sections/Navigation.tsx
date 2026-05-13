import Link from "next/link"

export default function Navigation() {
    type ItemType = {
        id: number;
        label: string;
        href: string;
    }

    const buttonsNav: ItemType[] = [
        { id: 1, label: 'Cupons', href: '/' },
        { id: 2, label: 'Mais Vendidos', href: '/' },
    ];

    const linksNav: ItemType[] = [
        { id: 1, label: 'Hardwares', href: '/' },
        { id: 2, label: 'PC Gamer', href: '/' },
        { id: 3, label: 'Computadores', href: '/' },
        { id: 4, label: 'Notebooks', href: '/' },
        { id: 5, label: 'Periféricos', href: '/' },
        { id: 6, label: 'Monitores', href: '/' },
    ];


    return (
        <div>Navigation</div>
    )
}
