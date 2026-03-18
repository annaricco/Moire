const MESSAGES = {
  all: "Your closet is empty. Add your first item to get started.",
  sets: "No matching sets yet. Tag items with the same set name to group them here.",
  top: "No tops yet. Add one!",
  bottom: "No bottoms in your closet yet.",
  shoes: "No shoes added yet.",
  outerwear: "No outerwear yet.",
  accessory: "No accessories yet.",
};

export default function EmptyState({ category = 'all' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 mb-4 text-gray-200">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </div>
      <p className="text-gray-400 text-sm">{MESSAGES[category] || MESSAGES.all}</p>
    </div>
  );
}
