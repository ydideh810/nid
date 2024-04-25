import { Theme, extendTheme } from "@chakra-ui/react";
import "@fontsource/zen-dots";
import "@fontsource/zen-dots";
import "@fontsource/zen-dots";
import '@fontsource/zen-dots';

import { theme } from "@ngine/react";

import buttonTheme from "@goalz/theme/components/button";
import tagTheme from "@goalz/theme/components/tag";
import progressTheme from "@goalz/theme/components/progress";
import avatarTheme from "@goalz/theme/components/avatar";
import cardTheme from "@goalz/theme/components/card";

export default extendTheme(
  {
    fonts: {
      heading: `'Zen Dots', system-ui`,
      body: `''Zen Dots', system-ui;`,
    },
    config: {
      initialColorMode: "dark",
      useSystemColorMode: false,
    },
    components: {
      Tag: tagTheme,
      Button: buttonTheme,
      Progress: progressTheme,
      Avatar: avatarTheme,
      Card: cardTheme,
    },
  },
  theme,
) as Theme;
