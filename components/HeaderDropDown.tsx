import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import * as DropdownMenu from "zeego/dropdown-menu";
import * as ContextMenu from "zeego/context-menu";
import Colors from "@/constants/Colors";

interface Props {
  title: string;
  selected?: string;
  onSelect: (key: string) => void;
  items: { key: string; title: string; icon: string }[];
}

export const HeaderDropDown = ({ title, selected, onSelect, items }: Props) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Text style={{ fontWeight: "500", fontSize: 16 }}>{title}</Text>
          {selected && (
            <Text
              style={{
                color: Colors.greyLight,
                fontWeight: "500",
                fontSize: 15,
              }}
            >
              {selected}
            </Text>
          )}
        </View>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        style={{ borderRadius: 20, backgroundColor: "red" }}
      >
        {items.map(({ key, title, icon }) => (
          <DropdownMenu.Item key={key} onSelect={() => onSelect(key)}>
            <DropdownMenu.ItemTitle>{title}</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemIcon
              ios={{
                name: icon,
                pointSize: 18,
              }}
            />
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
