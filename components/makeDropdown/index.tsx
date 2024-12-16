import { MoreIcon } from "@/assets/icon";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";

interface DropdownItem {
  key: string
  label: string
}

interface MakeDropdownProps {
  items: DropdownItem[]
  icon?: React.ReactNode
  onAction?: (key: string) => void
}

const MakeDropdown: React.FC<MakeDropdownProps> = ({
  items,
  icon = <MoreIcon className="w-4 h-4 text-black dark:text-white" />,
  onAction,
}) => {
  const handleAction = (key: React.Key) => {
    onAction?.(key.toString())
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly variant="light" size="sm">
          {icon}
        </Button>
      </DropdownTrigger>
      <DropdownMenu variant="light" hideSelectedIcon onAction={handleAction}>
        {items.map((item) => (
          <DropdownItem key={item.key}>{item.label}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}

export default MakeDropdown
