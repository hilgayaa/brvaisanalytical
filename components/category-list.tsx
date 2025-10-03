"use client"

type Category = {
  id: string
  name: string
  children?: Category[]
}

interface CategoryListProps {
  nodes: Category[]
  selectedId?: string
  onSelect: (id: string) => void
}

export function CategoryList({ nodes, selectedId, onSelect }: CategoryListProps) {
  if (!nodes?.length) return null

  return (
    <ul role="tree" aria-label="Category tree" className="space-y-1">
      {nodes.map((node) => (
        <li key={node.id} role="treeitem" aria-expanded={!!node.children?.length}>
          <button
            type="button"
            onClick={() => onSelect(node.id)}
            aria-current={selectedId === node.id ? "true" : undefined}
            className={
              selectedId === node.id
                ? "w-full text-left px-3 py-2 rounded-md text-sm bg-primary text-primary-foreground"
                : "w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted"
            }
          >
            {node.name}
          </button>

          {node.children && node.children.length > 0 && (
            <div className="pl-4">
              <CategoryList nodes={node.children} selectedId={selectedId} onSelect={onSelect} />
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
