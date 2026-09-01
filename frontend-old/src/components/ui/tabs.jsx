"use client";

import { Tabs as ChakraTabs } from "@chakra-ui/react";

function Tabs({ tabs = [] }) {
  return (
    <ChakraTabs.Root defaultValue="login" variant="plain" fitted>
      <ChakraTabs.List bg="bg.muted" rounded="l3" p="1">
        {tabs.map((tab) => (
          <ChakraTabs.Trigger
            key={tab.value}
            value={tab.value}
            whiteSpace="nowrap"
          >
            {tab.label}
          </ChakraTabs.Trigger>
        ))}

        <ChakraTabs.Indicator rounded="l2" />
      </ChakraTabs.List>
      {tabs.map((tab) => (
        <ChakraTabs.Content key={tab.value} value={tab.value}>
          {tab.content}
        </ChakraTabs.Content>
      ))}
    </ChakraTabs.Root>
  );
}

export default Tabs;
