import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";
import * as DropdownMenu from "zeego/dropdown-menu";

interface Props {
  items: {
    key: string;
    title: string;
    icon: string;
  }[];
  onSelect: (key: string) => void;
}

export const DropDownMenu = ({ items, onSelect }: Props) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {items.map(({ title, icon, key }) => (
          <DropdownMenu.Item key={key} onSelect={() => onSelect(key)}>
            <DropdownMenu.ItemTitle>{title}</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemIcon ios={{ name: icon, pointSize: 18 }} />
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
