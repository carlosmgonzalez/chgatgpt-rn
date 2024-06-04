import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Drawer } from "expo-router/drawer";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  useHeaderHeight,
  Header,
  getHeaderTitle,
} from "@react-navigation/elements";
import React, { useEffect, useState } from "react";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const sections = [
  { title: "Top Picks", label: "Curated top picks from this week" },
  { title: "Dall·E", label: "Transform your ideas into amazing images" },
  {
    title: "Writing",
    label:
      "Enhance your writing with tools for creation, editing, and style refinement",
  },
  { title: "Productivity", label: "Increase your efficiency" },
  {
    title: "Research & Analysis",
    label: "Find, evaluate, interpret, and visualize information",
  },
  { title: "Programming", label: "Write code, debug, test, and learn" },
];

const apps = [
  {
    title: "Instant Website [Multipage]",
    description:
      "Generates functional multipage websites aimed at meeting the needs of startups and small businesses. Continuously updated with new features.",
    author: "By Max & Kirill Dubovitsky",
    image:
      "https://files.oaiusercontent.com/file-9P4NhIxlr14rKlHEM41VVbxS?se=2124-03-21T08%3A51%3A45Z&sp=r&sv=2021-08-06&sr=b&rscc=max-age%3D1209600%2C%20immutable&rscd=attachment%3B%20filename%3Dsdfgasdfx.jpg&sig=8xHssdF2qgY0qpyaUNRn4My5tJwh9iYMn1Lg53H9Z1c%3D",
  },
  {
    title: "Diagrams & Data",
    description:
      "Helps research, analyze, and visualize complex data through diagrams and charts. Useful for coders and business analysts alike.",
    author: "By Max & Kirill Dubovitsky",
    image:
      "https://files.oaiusercontent.com/file-teufH6uVdqxmxHjEUIQjD8ur?se=2124-03-24T19%3A02%3A04Z&sp=r&sv=2021-08-06&sr=b&rscc=max-age%3D1209600%2C%20immutable&rscd=attachment%3B%20filename%3Dvar6.jpg&sig=wn6KyKdgbqJ1gGkHltYV8cl3/ZwLZmgO039GkueA8Z8%3D",
  },
  {
    title: "ChatPRD",
    description:
      "Acts as an on-demand Chief Product Officer, enhancing product requirement documents and providing coaching for product managers and engineers.",
    author: "By Claire V Lawless",
    image:
      "https://files.oaiusercontent.com/file-qeVpUG3AJT0FINT4eZ6Gbt2q?se=2123-10-17T23%3A41%3A20Z&sp=r&sv=2021-08-06&sr=b&rscc=max-age%3D31536000%2C%20immutable&rscd=attachment%3B%20filename%3Dcvolawless_illustration_of_a_female_ceo_at_a_laptop_lo-fi_asthe_c60ce7fb-5902-474c-aa85-54c7469aa089.png&sig=eHU4/LmvHg96KaqivlhaLufaIleMC1wm3pE0kMQF1AA%3D",
  },
  {
    title: "Music Teacher",
    description:
      "Specializes in music theory, scales, production, and more, also includes image generation capabilities for cover art.",
    author: "By gryphonedm.com",
    image:
      "https://files.oaiusercontent.com/file-gLZOuk6mmgg4vsCuhWxgQ2Cm?se=2123-12-13T21%3A57%3A04Z&sp=r&sv=2021-08-06&sr=b&rscc=max-age%3D1209600%2C%20immutable&rscd=attachment%3B%20filename%3D3e763913-0301-49ec-b2f0-c9ad832df862.png&sig=cCp02Ji5dcCxt0UPu92vrFgmZ8p1jwkqUYlYbR4IfoY%3D",
  },
  {
    title: "UX Design Mentor",
    description:
      "Provides specific feedback on UX or Product Design, enhancing the design process.",
    author: "By community builder",
    image:
      "https://files.oaiusercontent.com/file-Nz98JJBUj7rzXmJAyALeuV87?se=2123-10-16T04%3A49%3A04Z&sp=r&sv=2021-08-06&sr=b&rscc=max-age%3D31536000%2C%20immutable&rscd=attachment%3B%20filename%3D476c2153-1121-4e4c-ad3b-ea164ec21499.png&sig=8TkhKoq6xPQYcrXHiCzvp2SV0G9k3jMllTAy3fe30R8%3D",
  },
];

export default function ExploreScreen() {
  const headerHeight = useHeaderHeight();
  const [selected, setSelected] = useState(sections[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 4000);
  }, []);

  return (
    <View style={styles.container}>
      <Drawer.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity style={{ marginRight: 16 }}>
              <Ionicons name="search" size={24} color={Colors.grey} />
            </TouchableOpacity>
          ),
          headerTitleStyle: {
            fontSize: 16,
          },
          headerTransparent: true,
          headerBackground: () => (
            <BlurView
              intensity={90}
              tint="light"
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: "rgba(255, 255, 255, 0.1)" },
              ]}
            />
          ),
          headerShadowVisible: false,
          header: ({ options, route }) => (
            <View>
              <Header
                {...options}
                title={getHeaderTitle(options, route.name)}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  gap: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                }}
              >
                {sections.map((section, index) => (
                  <TouchableOpacity
                    key={index}
                    style={
                      selected === section
                        ? styles.sectionSelectedBtn
                        : styles.sectionBtn
                    }
                    onPress={() => setSelected(section)}
                  >
                    <Text
                      style={
                        selected === section
                          ? styles.sectionSelectedTextBtn
                          : styles.sectionTextBtn
                      }
                    >
                      {section.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ),
        }}
      />
      <ScrollView contentContainerStyle={{ paddingTop: headerHeight }}>
        {sections.map((section, index) => (
          <React.Fragment key={index}>
            {selected === section && (
              <Animated.View
                style={styles.section}
                entering={FadeIn.duration(600).delay(400)}
                exiting={FadeOut.duration(400)}
              >
                <ShimmerPlaceholder width={160} height={20} visible={!loading}>
                  <Text style={styles.title}>{section.title}</Text>
                </ShimmerPlaceholder>
                <ShimmerPlaceholder
                  width={280}
                  height={20}
                  visible={!loading}
                  shimmerStyle={{ marginVertical: 10 }}
                >
                  <Text style={styles.label}>{section.label}</Text>
                </ShimmerPlaceholder>
                {apps.map((app, index) => (
                  <View key={index} style={styles.card}>
                    <ShimmerPlaceholder
                      style={styles.cardImage}
                      visible={!loading}
                    >
                      <Image
                        source={{ uri: app.image }}
                        style={styles.cardImage}
                      />
                    </ShimmerPlaceholder>

                    <View style={{ flexShrink: 1, gap: 4 }}>
                      <ShimmerPlaceholder
                        width={160}
                        height={20}
                        visible={!loading}
                      >
                        <Text style={styles.cardTitle}>{app.title}</Text>
                      </ShimmerPlaceholder>
                      <ShimmerPlaceholder
                        width={160}
                        height={20}
                        visible={!loading}
                      >
                        <Text style={styles.cardDesc}>{app.description}</Text>
                      </ShimmerPlaceholder>
                      <ShimmerPlaceholder
                        width={250}
                        height={20}
                        visible={!loading}
                      >
                        <Text style={styles.cardAuthor}>{app.author}</Text>
                      </ShimmerPlaceholder>
                    </View>
                  </View>
                ))}
              </Animated.View>
            )}
          </React.Fragment>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light,
  },
  sectionBtn: {
    backgroundColor: Colors.input,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sectionSelectedBtn: {
    backgroundColor: Colors.grey,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sectionTextBtn: {
    color: "#000",
    fontWeight: "500",
  },
  sectionSelectedTextBtn: {
    color: "#fff",
    fontWeight: "500",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  section: {
    padding: 16,
  },
  card: {
    backgroundColor: Colors.input,
    borderRadius: 8,
    marginBottom: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 40,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardDesc: {
    fontSize: 14,
    color: "#000",
  },
  cardAuthor: {
    fontSize: 14,
    color: "#666",
  },
});
