// components/Admin/TabButton.tsx
type TabButtonProps = {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  count: number;
};

export default function TabButton({ active, onClick, icon, label, count }: TabButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-7 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                active ? 'bg-black text-sky-400' : 'bg-gray-200 text-gray-600 hover:bg-gray-300 '
            }`}
        >
        {icon} {label} ({count})
        </button>
    );
}