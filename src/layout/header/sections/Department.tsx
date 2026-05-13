import Link from "next/link"

export default function Department() {
    type ItemType = {
        id: number;
        label: string;
        href: string;
    }
    const linksNav: ItemType[] = [
        { id: 1, label: 'Hardwares', href: '/' },
        { id: 2, label: 'PC Gamer', href: '/' },
        { id: 3, label: 'Computadores', href: '/' },
        { id: 4, label: 'Notebooks', href: '/' },
        { id: 5, label: 'Periféricos', href: '/' },
        { id: 6, label: 'Monitores', href: '/' },
        { id: 7, label: 'Consoles', href: '/' },
        { id: 7, label: 'Teclados e Mouses', href: '/' },
    ];

    return (
        <div>Departamento</div>
    )
}
