import type { Category } from '@/types/salon';

interface CategoryChipsProps {
  categories: Category[];
  selected: string | null;
  onSelect: (id: string) => void;
}

const CategoryChips = ({ categories, selected, onSelect }: CategoryChipsProps) => {
  return (
    <div className="flex gap-5 overflow-x-auto px-5 py-2 scrollbar-hide">
      {categories.map((cat) => {
        const isActive = selected === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className="flex flex-col items-center gap-2 flex-shrink-0"
          >
            <div
              className={`w-[62px] h-[62px] rounded-full overflow-hidden transition-all duration-200 ${
                isActive
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105'
                  : 'ring-1 ring-border'
              }`}
            >
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <span className={`text-[11px] font-heading font-medium whitespace-nowrap transition-colors ${
              isActive ? 'text-primary' : 'text-muted-foreground'
            }`}>
              {cat.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryChips;
