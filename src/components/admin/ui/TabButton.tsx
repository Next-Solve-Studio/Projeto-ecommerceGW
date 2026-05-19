import { FiShoppingBag, FiGrid } from "react-icons/fi";

type TabButtonProps = {
    readonly active: boolean;
    readonly onClick: () => void;
    readonly icon: "products" | "categories";
    readonly label: string;
    readonly count: number;
};

const icons = {
    products: <FiShoppingBag size={15} />,
    categories: <FiGrid size={15} />,
};

export default function TabButton({ active, onClick, icon, label, count }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex items-center gap-2.5 px-5 py-2 rounded-lg text-sm font-semibold
        transition-all duration-200 cursor-pointer
        ${active
          ? 'bg-black text-blue shadow-sm'
          : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
        }
      `}
    >
      <span className={active ? 'text-blue' : 'text-gray-400'}>
        {icons[icon]}
      </span>
      {label}
      <span className={`
        text-[11px] font-bold px-1.5 py-0.5 rounded-md min-w-5 text-center
        ${active
          ? 'bg-white/15 text-blue'
          : 'bg-gray-200 text-gray-500'
        }
      `}>
        {count}
      </span>
    </button>
  );
}
