import React, { useState } from "react";
import {
  ColorSwatch,
  Group,
  Radio,
  Switch,
  useMantineTheme,
} from "@mantine/core";

import { BsSun, BsMoonStars } from "react-icons/bs";

const Settings = () => {
  const [language, setLanguage] = useState("english");
  const theme = useMantineTheme();
  const swatches = Object.keys(theme.colors).map((color) => (
    <ColorSwatch key={color} color={theme.colors[color][6]} />
  ));
  return (
    <div className="p-4 text-white font-poppins">
      <h3 className="font-semibold text-xl">Settings</h3>
      <h3 className="my-4 ">Theme Mode</h3>
      <Switch
        size="md"
        color={theme.colorScheme === "dark" ? "gray" : "dark"}
        onLabel={
          <BsSun size={16} stroke={2.5} color={theme.colors.yellow[4]} />
        }
        offLabel={
          <BsMoonStars size={16} stroke={2.5} color={theme.colors.blue[6]} />
        }
      />
      <h3 className="my-4 ">Theme Color</h3>
      <div className="flex gap-4 flex-wrap">{swatches}</div>
      <h3 className="my-4 ">Language</h3>
      <Radio.Group
        name="favoriteFramework"
        value={language}
        onChange={setLanguage}
        withAsterisk
      >
        <Radio labelProps={{ color: "#fff" }} value="english" label="English" />
        <Radio labelProps={{ color: "white" }} value="nepali" label="Nepali" />
        <Radio
          labelProps={{ color: "white" }}
          value="japanese"
          label="Japanese"
        />
      </Radio.Group>
    </div>
  );
};

export default Settings;
